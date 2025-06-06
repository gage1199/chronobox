import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { token } = req.query;

    if (!token || typeof token !== 'string') {
      return res.status(400).json({ message: 'Invalid token' });
    }

    // TODO: Implement shared link functionality after database migration
    return res.status(404).json({ 
      message: 'Shared link feature coming soon' 
    });

  } catch (error) {
    console.error('Shared link error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
} 