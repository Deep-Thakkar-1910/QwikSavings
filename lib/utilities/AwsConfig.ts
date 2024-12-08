import {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
  ObjectCannedACL,
  DeleteObjectsCommand,
} from "@aws-sdk/client-s3";

// Configure S3 Client
const s3Client = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_S3_ACCESS_KEY!,
    secretAccessKey: process.env.AWS_S3_SECRET_KEY!,
  },
});

export async function uploadToS3(
  buffer: Buffer,
  folder: string,
): Promise<string> {
  const key = `${folder}/${Date.now()}`;
  const uploadParams = {
    Bucket: process.env.AWS_S3_BUCKET_NAME!,
    Key: key,
    Body: buffer,
    ACL: ObjectCannedACL.public_read,
  };

  try {
    const command = new PutObjectCommand(uploadParams);
    await s3Client.send(command);

    return key;
  } catch (error) {
    console.error("S3 Upload Error:", error);
    throw new Error("Failed to upload file to S3");
  }
}

export async function deleteFromS3(key: string): Promise<void> {
  try {
    const deleteParams = {
      Bucket: process.env.AWS_S3_BUCKET_NAME!,
      Key: key,
    };

    const command = new DeleteObjectCommand(deleteParams);
    await s3Client.send(command);
  } catch (error) {
    console.error("S3 Delete Error:", error);
    throw new Error("Failed to delete file from S3");
  }
}

export async function deleteMultipleFilesFromS3(
  keyToDeleteArray: { Key: string }[],
): Promise<void> {
  const deleteMultipleFilesCommand = new DeleteObjectsCommand({
    Bucket: process.env.AWS_S3_BUCKET_NAME,
    Delete: {
      Objects: keyToDeleteArray,
    },
  });
  await s3Client.send(deleteMultipleFilesCommand);
}

export function constructS3Url(key: string | undefined): string | undefined {
  if (!key) return;
  return `https://${process.env.NEXT_PUBLIC_AWS_S3_BUCKET_NAME}.s3.${process.env.NEXT_PUBLIC_AWS_REGION}.amazonaws.com/${key}`;
}
