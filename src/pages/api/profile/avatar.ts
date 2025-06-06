import { NextApiRequest, NextApiResponse } from 'next'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '../auth/[...nextauth]'
import AWS from 'aws-sdk'
import { v4 as uuidv4 } from 'uuid'

// Configure AWS
const s3 = new AWS.S3({
  region: process.env.AWS_REGION,
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  signatureVersion: 'v4'
})

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const session = await getServerSession(req, res, authOptions)
    
    if (!session?.user?.email) {
      return res.status(401).json({ error: 'Unauthorized' })
    }

    if (req.method !== 'POST') {
      return res.status(405).json({ error: 'Method not allowed' })
    }

    const { fileName, fileType, fileSize } = req.body

    // Validation
    if (!fileName || !fileType || !fileSize) {
      return res.status(400).json({ error: 'Missing required fields: fileName, fileType, fileSize' })
    }

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png']
    if (!allowedTypes.includes(fileType)) {
      return res.status(400).json({ error: 'Only JPEG and PNG files are allowed' })
    }

    // Validate file size (5MB limit)
    const maxSize = 5 * 1024 * 1024 // 5MB in bytes
    if (fileSize > maxSize) {
      return res.status(400).json({ error: 'File size must be less than 5MB' })
    }

    // Generate unique file key
    const fileExtension = fileType === 'image/jpeg' ? 'jpg' : 'png'
    const uniqueId = uuidv4()
    const key = `avatars/${session.user.email}/${uniqueId}.${fileExtension}`

    // Generate presigned URL with SSE-KMS
    const presignedParams = {
      Bucket: process.env.S3_BUCKET_NAME!,
      Key: key,
      Expires: 300, // 5 minutes
      ContentType: fileType,
      ServerSideEncryption: 'aws:kms',
      SSEKMSKeyId: process.env.KMS_KEY_ID,
      Metadata: {
        'user-email': session.user.email,
        'upload-type': 'avatar'
      }
    }

    const uploadUrl = s3.getSignedUrl('putObject', presignedParams)

    // Generate the final S3 URL for the uploaded file
    const finalUrl = `https://${process.env.S3_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`

    return res.status(200).json({ 
      uploadUrl,
      key,
      finalUrl,
      expires: new Date(Date.now() + 300000).toISOString() // 5 minutes from now
    })

  } catch (error) {
    console.error('Avatar upload API error:', error)
    return res.status(500).json({ error: 'Internal server error' })
  }
} 