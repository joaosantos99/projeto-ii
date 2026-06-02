import Redis from 'ioredis';
import env from './env.js';

let dragonfly = null;

if (env.CACHE_URL || env.CACHE_HOST) {
  const options = {
    lazyConnect: true,
    maxRetriesPerRequest: 1,
    enableOfflineQueue: false,
    retryStrategy: (times) => Math.min(times * 200, 2000),
  };

  dragonfly = env.CACHE_URL
    ? new Redis(env.CACHE_URL, options)
    : new Redis({ host: env.CACHE_HOST, port: env.CACHE_PORT, ...options });

  dragonfly.on('error', (error) => {
    console.error('[dragonfly] connection error:', error.message);
  });

  dragonfly.connect().catch((error) => {
    console.error('[dragonfly] initial connect failed:', error.message);
  });
}

export const dragonflyEnabled = dragonfly !== null;

export default dragonfly;
