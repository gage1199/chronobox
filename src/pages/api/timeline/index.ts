import { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]';
import { prisma } from '@/lib/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ status: 405, message: 'Method not allowed' });
  }

  try {
    const session = await getServerSession(req, res, authOptions);
    
    if (!session?.user?.email) {
      return res.status(401).json({ status: 401, message: 'Unauthorized' });
    }

    // Get user from database
    const user = await prisma.user.findUnique({
      where: { email: session.user.email }
    });

    if (!user) {
      return res.status(404).json({ status: 404, message: 'User not found' });
    }

    // Parse query parameters
    const { limit = '50', offset = '0' } = req.query;

    // Fetch timeline events for the user
    const timelineEvents = await prisma.timelineEvent.findMany({
      where: {
        userId: user.id
      },
      orderBy: {
        createdAt: 'desc'
      },
      take: parseInt(limit as string),
      skip: parseInt(offset as string),
      include: {
        video: {
          select: {
            id: true,
            fileName: true,
            contentType: true,
            size: true,
            duration: true
          }
        }
      }
    });

    // Transform events for frontend
    const formattedEvents = timelineEvents.map(event => ({
      id: event.id,
      type: event.type,
      description: event.description,
      createdAt: event.createdAt.toISOString(),
      metadata: event.metadata,
      video: event.video ? {
        id: event.video.id,
        fileName: event.video.fileName,
        contentType: event.video.contentType,
        size: event.video.size,
        duration: event.video.duration
      } : null
    }));

    // Get total count for pagination
    const totalCount = await prisma.timelineEvent.count({
      where: { userId: user.id }
    });

    return res.status(200).json({
      timeline: formattedEvents,
      pagination: {
        total: totalCount,
        limit: parseInt(limit as string),
        offset: parseInt(offset as string),
        hasMore: parseInt(offset as string) + parseInt(limit as string) < totalCount
      }
    });

  } catch (error) {
    console.error('Timeline API error:', error);
    return res.status(500).json({ status: 500, message: 'Internal server error' });
  }
} 