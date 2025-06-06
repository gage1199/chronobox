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

    // Parse query parameters for filtering
    const { 
      type,
      search,
      tags,
      limit = '20',
      offset = '0'
    } = req.query;

    // Build where clause for filtering with permissions and release dates
    const currentTime = new Date();
    let whereClause: any = {
      AND: [
        {
          OR: [
            { userId: user.id }, // Owner
            { isPublic: true }, // Public videos
            { sharedWith: { some: { id: user.id } } } // Shared with user
          ]
        },
        {
          OR: [
            { releaseAt: null }, // No release date (immediate)
            { releaseAt: { lte: currentTime } } // Release date has passed
          ]
        }
      ]
    };

    if (type && type !== 'all') {
      whereClause.AND.push({ contentType: { contains: type as string } });
    }

    if (search) {
      whereClause.AND.push({
        OR: [
          { fileName: { contains: search as string, mode: 'insensitive' } },
        ]
      });
    }

    // Fetch videos (our main content type for now)
    const memories = await prisma.video.findMany({
      where: whereClause,
      orderBy: { uploadedAt: 'desc' },
      take: parseInt(limit as string),
      skip: parseInt(offset as string),
      select: {
        id: true,
        fileName: true,
        filePath: true,
        contentType: true,
        size: true,
        duration: true,
        uploadedAt: true,
        updatedAt: true,
        releaseAt: true,
        isPublic: true,
        isEncrypted: true,
        kmsKeyId: true,
        userId: true
      }
    });

    // Transform to match our frontend interface
    const transformedMemories = memories.map(memory => ({
      id: memory.id,
      title: memory.fileName.replace(/\.[^/.]+$/, ""), // Remove file extension for title
      description: `${memory.contentType} • ${formatFileSize(memory.size)}`,
      type: getTypeFromContentType(memory.contentType),
      date: memory.uploadedAt.toISOString(),
      thumbnail: memory.filePath, // Use the file path as thumbnail
      tags: [], // TODO: Implement tags system
      isThisDay: isThisDay(memory.uploadedAt),
      duration: memory.duration,
      isEncrypted: memory.isEncrypted,
      isPublic: memory.isPublic,
      size: memory.size
    }));

    // Get total count for pagination
    const totalCount = await prisma.video.count({
      where: whereClause
    });

    return res.status(200).json({
      memories: transformedMemories,
      pagination: {
        total: totalCount,
        limit: parseInt(limit as string),
        offset: parseInt(offset as string),
        hasMore: parseInt(offset as string) + parseInt(limit as string) < totalCount
      }
    });

  } catch (error) {
    console.error('Error fetching memories:', error);
    return res.status(500).json({ status: 500, message: 'Internal server error' });
  }
}

// Helper function to check if a date is "this day" in previous years
function isThisDay(date: Date): boolean {
  const today = new Date();
  const memoryDate = new Date(date);
  
  return (
    memoryDate.getMonth() === today.getMonth() &&
    memoryDate.getDate() === today.getDate() &&
    memoryDate.getFullYear() !== today.getFullYear()
  );
}

// Helper function to format file size
function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

// Helper function to get type from content type
function getTypeFromContentType(contentType: string): string {
  if (contentType.startsWith('video/')) return 'video';
  if (contentType.startsWith('audio/')) return 'audio';
  if (contentType.startsWith('image/')) return 'photo';
  return 'document';
} 