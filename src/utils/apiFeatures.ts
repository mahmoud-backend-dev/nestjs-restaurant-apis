import { JwtService } from "@nestjs/jwt";
import { S3 } from "aws-sdk";
import { v4 as uuid } from "uuid";

export class ApiFeatures {
  // Static method to upload files in AWS S3
  static async uploadFiles(files: Express.Multer.File[]): Promise<any> {
    return new Promise((resolve, reject) => {
      const s3 = new S3({
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      });
      const images = [];
      files.forEach(async (file) => {
        const params = {
          Bucket: `${process.env.AWS_S3_BUCKET_NAME}/restaurant`,
          Key: `${uuid()}-${file.originalname}`,
          Body: file.buffer,
        };
        const uploadedFile = await s3.upload(params).promise();
        images.push(uploadedFile);
        if (images.length === files.length) {
          resolve(images);
        }
      })
    })
  };

  // Static method to delete files in AWS S3
  static async deleteFiles(files: object[]): Promise<any> {
    return new Promise((resolve, reject) => {
      const s3 = new S3({
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      });
      files.forEach(async (file) => {
        const params = {
          Bucket: `${process.env.AWS_S3_BUCKET_NAME}`,
          Key: file['Key'],
        };
        s3.deleteObject(params, (err, data) => {
          if (err) {
            reject(false);
          }
          resolve(true);
        });
      })
    })
  };

  // static method to assign token to response
  static assignTokenToAuthorization(
    id: string,
    jwtService:JwtService
  ): string {
    return jwtService.sign({ id });
  };
}