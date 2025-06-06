import { NextApiRequest, NextApiResponse } from 'next'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '../../auth/[...nextauth]'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const session = await getServerSession(req, res, authOptions)
    
    if (!session?.user?.email) {
      return res.status(401).json({ error: 'Unauthorized' })
    }

    if (req.method !== 'DELETE') {
      return res.status(405).json({ error: 'Method not allowed' })
    }

    // TODO: Implement trusted contact deletion after database migration
    return res.status(200).json({ 
      message: 'Trusted contact deletion feature coming soon'
    })

  } catch (error) {
    console.error('Delete trusted contact API error:', error)
    return res.status(500).json({ error: 'Internal server error' })
  }
} 