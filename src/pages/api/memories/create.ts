import { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]';
import { PrismaClient } from '@prisma/client';
import { z } from 'zod';

const prisma = new PrismaClient();

// Validation schema for creating memories
const CreateMemorySchema = z.object({
  title: z.string().min(1, 'Title is required').max(200, 'Title too long'),
  description: z.string().optional(),
  type: z.enum(['video', 'audio', 'photo', 'story']),
  content: z.string().optional(), // S3 URL for uploads, text content for stories
  scheduledFor: z.string().optional().transform(val => val ? new Date(val) : undefined),
  releaseAt: z.string().optional().transform(val => val ? new Date(val) : undefined),
  isPublic: z.boolean().optional().default(false),
  sharedWithIds: z.array(z.string()).optional().default([]),
  tags: z.array(z.string()).optional().default([])
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const session = await getServerSession(req, res, authOptions);
    
    if (!session?.user?.email) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    // Get user from database
    const user = await prisma.user.findUnique({
      where: { email: session.user.email }
    });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Validate request body
    const validationResult = CreateMemorySchema.safeParse(req.body);
    
    if (!validationResult.success) {
      return res.status(400).json({ 
        message: 'Validation error',
        errors: validationResult.error.errors
      });
    }

    const { title, description, type, content, scheduledFor, releaseAt, isPublic, sharedWithIds, tags } = validationResult.data;

    // For story type, content should be in description
    const finalContent = type === 'story' ? (description || '') : (content || '');
    const finalDescription = type === 'story' ? description : description;

    // Create the memory in the database
    const memory = await prisma.video.create({
      data: {
        fileName: title, // Use title as fileName for now
        filePath: finalContent || '', // Use content as filePath
        contentType: type === 'story' ? 'text/plain' : 'application/octet-stream',
        size: finalContent?.length || 0,
        userId: user.id,
        releaseAt: releaseAt || null,
        isPublic: isPublic || false
      }
    });

    // Handle sharing with specific users
    if (sharedWithIds.length > 0) {
      await prisma.video.update({
        where: { id: memory.id },
        data: {
          sharedWith: {
            connect: sharedWithIds.map(id => ({ id }))
          }
        }
      });
    }

    // TODO: Implement tags system
    // For now, we'll store tags in a simple JSON format or create a separate tags table

    // Return the created memory
    const response = {
      id: memory.id,
      title: memory.fileName,
      description: finalDescription || '',
      type: type,
      date: memory.uploadedAt.toISOString(),
      content: memory.filePath,
      releaseAt: memory.releaseAt?.toISOString(),
      tags: tags || []
    };

    return res.status(201).json({
      message: 'Memory created successfully',
      memory: response
    });

  } catch (error) {
    console.error('Error creating memory:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
} 