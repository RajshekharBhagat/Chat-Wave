import {Redis} from '@upstash/redis'

if (!process.env.UPSTASH_REDIS_REST_URL || !process.env.UPSTASH_REDIS_REST_TOKEN) {
    throw new Error('Missing Upstash Redis configuration');
  }

export const db: Redis = new Redis({
    url: process.env.UPSTASH_REDIS_REST_URL || '',
    token: process.env.UPSTASH_REDIS_REST_TOKEN || '',
})
