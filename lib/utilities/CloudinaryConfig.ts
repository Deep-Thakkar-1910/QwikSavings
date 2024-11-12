// cloudinary.ts
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// this will take the image in the form of buffer and give us an image url to store in database
export const UploadStoreImage = (
  buffer: Buffer,
  folder: string,
): Promise<unknown> => {
  return new Promise(async (resolve, reject) => {
    cloudinary.uploader
      .upload_stream(
        {
          folder: folder,
          resource_type: "image",
        },
        async (err, result) => {
          if (err) {
            return reject(err.message);
          }
          resolve(result?.secure_url);
        },
      )
      .end(buffer);
  });
};
