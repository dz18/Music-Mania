import { S3Client, PutObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3"

import { getSignedUrl } from "@aws-sdk/s3-request-presigner"

const s3 = new S3Client({
  region: process.env.AWS_REGION!,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  }
})

const acceptedTypes = [
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/gif',
] as const

type AcceptedTypes = typeof acceptedTypes[number]

export type SignedUrlResult =
  | { success: { url: string }; error?: never }
  | { error: string; success?: never }

export type DeleteResult =
  | { success: true; error?: never }
  | { error: string; success?: never }

const maxFileSize = 1024 * 1024 * 10 // 10MB

export async function getSignedURL (
  key: string, 
  type: string,
  size: number
): Promise<SignedUrlResult> {

  if (!acceptedTypes.includes(type as AcceptedTypes)) {
    return { error: `Invalid file type: ${type}`}
  }

  if (size > maxFileSize) {
    return { error: `Invalid file size. Must be under 10MB.`}
  }

  const putObjectCommand = new PutObjectCommand({
    Bucket: process.env.AWS_BUCKET_NAME,
    Key: key,
    ContentType: type,
    ContentLength: size
  })

  try {

    const signedUrl = await getSignedUrl(s3, putObjectCommand, {
      expiresIn: 60
    })

    return { success: { url: signedUrl }}
  } catch (error) {
    return { error: 'Unknown Error' }
  }
  
}

export async function deleteObject(key: string): Promise<DeleteResult> {
  console.log('deleting object now...')
  if (!key) {
    return { error: "Missing S3 object key" }
  }

  const deleteCommand = new DeleteObjectCommand({
    Bucket: process.env.AWS_BUCKET_NAME,
    Key: key,
  })

  try {
    await s3.send(deleteCommand)
    console.log(`Deleted: ${key}`);
    return { success: true }
  } catch (error) {
    console.error("S3 delete error:", error)
    return { error: "Failed to delete object" }
  }
} 