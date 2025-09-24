import 'dotenv/config';
import { S3Client, PutObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3';
import fs from 'fs';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

const filePath = 'src/public/princess star butterfly.jpeg';
const fileStream = fs.createReadStream(filePath);

const s3Client = new S3Client({
  region: process.env.AWS_S3_REGION ?? '',
  credentials: {
    accessKeyId: process.env.AWS_S3_ACCESS_KEY_ID ?? '',
    secretAccessKey: process.env.AWS_S3_SECRET_KEY_ID ?? '',
  },
});

const params = {
  Bucket: process.env.AWS_S3_BUCKET,
  Key: 'sample images/princess star butterfly.jpeg',
  Body: fileStream,
  ContentType: 'image/jpeg',
};

const command = new PutObjectCommand(params);

const uploadObject = () => {
  s3Client
    .send(command)
    .then((data) => {
      console.log(`✅ Object successfully uploaded: `, data);
    })
    .catch((error) => {
      console.log(`❌ Object upload failed: `, error?.message || error);
    });
};

const getPresignedUrl = async (key: string, expiresInSeconds = 3600) => {
  const command = new GetObjectCommand({
    Bucket: params.Bucket,
    Key: key,
  });

  const url = await getSignedUrl(s3Client, command, { expiresIn: expiresInSeconds });
  return url;
};

const url = await getPresignedUrl(params.Key);
console.log(url);

uploadObject();

export default {};
