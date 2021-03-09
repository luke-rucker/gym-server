const {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
} = require('@aws-sdk/client-s3')
const fs = require('fs')

async function uploadFile(key, file) {
  const s3 = new S3Client({
    region: process.env.S3_REGION,
    endpoint: process.env.S3_ENDPOINT,
  })

  const { path, type } = file
  const body = fs.createReadStream(path)

  const uploadParams = {
    Bucket: process.env.S3_BUCKET,
    Key: key,
    ContentType: type,
    Body: body,
  }

  await s3.send(new PutObjectCommand(uploadParams))
}

async function downloadFile(key) {
  const s3 = new S3Client({
    region: process.env.S3_REGION,
    endpoint: process.env.S3_ENDPOINT,
  })

  const downloadParams = {
    Bucket: process.env.S3_BUCKET,
    Key: key,
  }

  return await s3.send(new GetObjectCommand(downloadParams))
}

async function uploadMemberProfileImage(fileName, image) {
  await uploadFile(`members/${fileName}`, image)
}

async function downloadMemberProfileImage(fileName) {
  return await downloadFile(`members/${fileName}`)
}

module.exports = { uploadMemberProfileImage, downloadMemberProfileImage }
