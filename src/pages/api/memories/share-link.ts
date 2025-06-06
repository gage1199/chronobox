import { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]';
import { PrismaClient } from '@prisma/client';
import { z } from 'zod';
import { v4 as uuidv4 } from 'uuid';

const prisma = new PrismaClient();

const ShareLinkSchema = z.object({
  videoId: z.string(),
  expiresInHours: z.number().min(1).max(8760) // 1 hour to 1 year
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
    const validationResult = ShareLinkSchema.safeParse(req.body);
    
    if (!validationResult.success) {
      return res.status(400).json({ 
        message: 'Validation error',
        errors: validationResult.error.errors
      });
    }

    const { videoId, expiresInHours } = validationResult.data;

    // Verify the user owns this video
    const video = await prisma.video.findFirst({
      where: {
        id: videoId,
        userId: user.id
      }
    });

    if (!video) {
      return res.status(404).json({ message: 'Video not found or access denied' });
    }

    // Generate unique token
    const token = uuidv4();
    const expiresAt = new Date(Date.now() + (expiresInHours * 60 * 60 * 1000));

    // Create share link
    const shareLink = await prisma.shareLink.create({
      data: {
        videoId,
        token,
        expiresAt
      }
    });

    // Generate public URL
    const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000';
    const publicUrl = `${baseUrl}/shared/${token}`;

    return res.status(201).json({
      message: 'Share link created successfully',
      shareLink: {
        id: shareLink.id,
        token: shareLink.token,
        url: publicUrl,
        expiresAt: shareLink.expiresAt.toISOString(),
        expiresInHours
      }
    });

  } catch (error) {
    console.error('Error creating share link:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
} 