import { JwtService } from "@nestjs/jwt";
import { S3 } from "aws-sdk";
import { v4 as uuid } from "uuid";

export class ApiFeatures {
  // Static method to upload files in AWS S3
  static async uploadFiles(files: Express.Multer.File[]): Promise<any> {
    const s3 = new S3({
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    });
    const images = [];
    for (const file of files) {
      const params = {
        Bucket: `${process.env.AWS_S3_BUCKET_NAME}/restaurant`,
        Key: `${uuid()}-${file.originalname}`,
        Body: file.buffer,
      };
      const uploadedFile = await s3.upload(params).promise();
      images.push(uploadedFile);
    }
    return images;
  }

  // Static method to delete files in AWS S3
  static async deleteFiles(files: { Key: string }[]): Promise<boolean> {
    const s3 = new S3({
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    });

    try {
      for (const file of files) {
        const params = {
          Bucket: process.env.AWS_S3_BUCKET_NAME!,
          Key: file.Key,
        };
        await s3.deleteObject(params).promise();
      }
      return true;
    } catch (error) {
      console.error(error);
      return false;
    }
  }

  // static method to assign token to response
  static assignTokenToAuthorization(
    id: string,
    jwtService: JwtService,
  ): string {
    return jwtService.sign({ id });
  }
}
