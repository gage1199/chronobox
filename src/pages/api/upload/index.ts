import { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]';
import { generateUploadUrl } from '../../../services/video/upload';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const session = await getServerSession(req, res, authOptions);
    
    if (!session?.user?.email) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const { fileName, contentType, fileSize } = req.body;

    if (!fileName || !contentType) {
      return res.status(400).json({ message: 'fileName and contentType are required' });
    }

    // Validate file size (max 500MB for videos, 50MB for images/audio)
    const maxSize = contentType.startsWith('video/') ? 500 * 1024 * 1024 : 50 * 1024 * 1024;
    if (fileSize && fileSize > maxSize) {
      return res.status(400).json({ 
        message: `File too large. Max size: ${maxSize / (1024 * 1024)}MB` 
      });
    }

    // Validate content type
    const allowedTypes = [
      'video/mp4', 'video/webm', 'video/mov', 'video/avi',
      'audio/mp3', 'audio/wav', 'audio/m4a', 'audio/aac',
      'image/jpeg', 'image/png', 'image/gif', 'image/webp'
    ];

    if (!allowedTypes.includes(contentType)) {
      return res.status(400).json({ message: 'Unsupported file type' });
    }

    // Generate upload URL
    const { uploadUrl, key } = await generateUploadUrl(fileName, contentType);

    return res.status(200).json({
      uploadUrl,
      key,
      message: 'Upload URL generated successfully'
    });

  } catch (error) {
    console.error('Error generating upload URL:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
} 