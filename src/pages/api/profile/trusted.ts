import { NextApiRequest, NextApiResponse } from 'next'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '../auth/[...nextauth]'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const session = await getServerSession(req, res, authOptions)
    
    if (!session?.user?.email) {
      return res.status(401).json({ error: 'Unauthorized' })
    }

    if (req.method === 'POST') {
      // TODO: Implement trusted contacts after database migration
      return res.status(200).json({ 
        message: 'Trusted contacts feature coming soon',
        trustedContacts: []
      })
    }

    return res.status(405).json({ error: 'Method not allowed' })
  } catch (error) {
    console.error('Trusted contacts API error:', error)
    return res.status(500).json({ error: 'Internal server error' })
  }
} 