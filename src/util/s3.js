const {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
} = require('@aws-sdk/client-s3')
const fs = require('fs')

class S3 {
  constructor() {
    this.s3 = new S3Client({
      region: process.env.S3_REGION,
      endpoint: process.env.S3_ENDPOINT,
    })
  }

  async uploadFile(key, file) {
    const { path, type } = file
    const body = fs.createReadStream(path)

    const uploadParams = {
      Bucket: process.env.S3_BUCKET,
      Key: key,
      ContentType: type,
      Body: body,
    }

    await this.s3.send(new PutObjectCommand(uploadParams))
  }

  async downloadFile(key) {
    const downloadParams = {
      Bucket: process.env.S3_BUCKET,
      Key: key,
    }

    return await this.s3.send(new GetObjectCommand(downloadParams))
  }
}

module.exports = S3
