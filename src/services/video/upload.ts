import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3'
import { KMSClient, EncryptCommand } from '@aws-sdk/client-kms'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'

const s3Client = new S3Client({
  region: process.env.AWS_REGION!,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
})

const kmsClient = new KMSClient({
  region: process.env.AWS_REGION!,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
})

export async function generateUploadUrl(fileName: string, contentType: string) {
  const key = `uploads/${Date.now()}-${fileName}`
  
  const command = new PutObjectCommand({
    Bucket: process.env.S3_BUCKET_NAME!,
    Key: key,
    ContentType: contentType,
    // Add KMS encryption for at-rest security
    ServerSideEncryption: 'aws:kms',
    SSEKMSKeyId: process.env.KMS_KEY_ID!,
  })

  const uploadUrl = await getSignedUrl(s3Client, command, { expiresIn: 3600 })
  
  return {
    uploadUrl,
    key,
    kmsKeyId: process.env.KMS_KEY_ID!
  }
}

export async function encryptVideoKey(key: string) {
  const command = new EncryptCommand({
    KeyId: process.env.KMS_KEY_ID!,
    Plaintext: Buffer.from(key),
  })

  const { CiphertextBlob } = await kmsClient.send(command)
  return CiphertextBlob ? Buffer.from(CiphertextBlob).toString('base64') : undefined
}

export async function uploadVideo(file: File, userId: string) {
  const { uploadUrl, key } = await generateUploadUrl(file.name, file.type)
  
  // Upload to S3
  await fetch(uploadUrl, {
    method: 'PUT',
    body: file,
    headers: {
      'Content-Type': file.type,
    },
  })

  // Encrypt the S3 key
  const encryptedKey = await encryptVideoKey(key)

  return {
    key,
    encryptedKey,
  }
} 