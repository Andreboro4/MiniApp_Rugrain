const Minio = require('minio');

const minioClient = new Minio.Client({
  endPoint: process.env.MINIO_ENDPOINT || 'localhost',
  port: parseInt(process.env.MINIO_PORT) || 9000,
  useSSL: false,
  accessKey: process.env.MINIO_ACCESS_KEY || 'rugrain',
  secretKey: process.env.MINIO_SECRET_KEY || 'rugrainminio123',
});

const BUCKET = process.env.MINIO_BUCKET || 'rugrain-uploads';

async function initBucket() {
  const exists = await minioClient.bucketExists(BUCKET);
  if (!exists) {
    await minioClient.makeBucket(BUCKET);
  }
}

async function uploadFile(fileName, buffer, metaData) {
  await minioClient.putObject(BUCKET, fileName, buffer, metaData);
  return `${process.env.MINIO_ENDPOINT}:${process.env.MINIO_PORT}/${BUCKET}/${fileName}`;
}

module.exports = { minioClient, initBucket, uploadFile };