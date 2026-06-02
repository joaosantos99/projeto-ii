import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';

import env from '../env.js';

/**
 * Hetzner Object Storage is S3-compatible, so the AWS SDK talks to it directly.
 * `forcePathStyle` keeps the bucket in the path (endpoint/bucket/key) rather than
 * as a subdomain, which Hetzner expects.
 */
let client = null;

function getClient() {
  if (!env.S3_ENDPOINT || !env.S3_ACCESS_KEY || !env.S3_SECRET_KEY) {
    const error = new Error('Object storage is not configured.');
    error.statusCode = 500;
    throw error;
  }

  if (!client) {
    client = new S3Client({
      endpoint: env.S3_ENDPOINT,
      region: env.S3_REGION,
      forcePathStyle: true,
      credentials: {
        accessKeyId: env.S3_ACCESS_KEY,
        secretAccessKey: env.S3_SECRET_KEY,
      },
    });
  }

  return client;
}

/**
 * Build the public URL for a stored object.
 * @param {string} key - Object key.
 * @returns {string} Public URL.
 */
function publicUrl(key) {
  return `${env.S3_ENDPOINT.replace(/\/$/, '')}/${env.S3_BUCKET}/${key}`;
}

/**
 * Upload a buffer to the configured bucket as a public-read object.
 * @param {Object} options
 * @param {string} options.key - Object key (path within the bucket).
 * @param {Buffer} options.body - File contents.
 * @param {string} options.contentType - MIME type.
 * @returns {Promise<string>} The public URL of the uploaded object.
 */
export async function uploadObject({ key, body, contentType }) {
  await getClient().send(
    new PutObjectCommand({
      Bucket: env.S3_BUCKET,
      Key: key,
      Body: body,
      ContentType: contentType,
      ACL: 'public-read',
    }),
  );

  return publicUrl(key);
}
