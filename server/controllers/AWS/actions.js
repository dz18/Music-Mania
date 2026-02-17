import { S3Client, PutObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3"

import { getSignedUrl } from "@aws-sdk/s3-request-presigner"

const s3 = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  }
})

const acceptedTypes = [
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/gif',
]

const maxFileSize = 1024 * 1024 * 10 // 10MB

export async function getSignedURL (key, type, size) {

  if (!acceptedTypes.includes(type)) {
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

export async function deleteObject(key) {
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