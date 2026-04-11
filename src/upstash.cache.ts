import { Redis } from '@upstash/redis';

export class UpstashRedisCache {
  private redis: Redis;

  constructor() {
    this.redis = new Redis({
      url: process.env.UPSTASH_REDIS_REST_URL || '',
      token: process.env.UPSTASH_REDIS_REST_TOKEN || '',
    });
  }

  async get(key: string): Promise<string | undefined> {
    try {
      const value = await this.redis.get<string | object | null>(key);
      if (!value) return undefined;
      // Trả về chuỗi raw content hoặc JSON parsed cho Apollo
      return typeof value === 'object' ? JSON.stringify(value) : String(value);
    } catch (e) {
      console.warn('[UpstashCache] get error:', e);
      return undefined;
    }
  }

  async set(key: string, value: string, options?: { ttl?: number | null }): Promise<void> {
    try {
      if (options?.ttl) {
        await this.redis.set(key, value, { ex: options.ttl });
      } else {
        await this.redis.set(key, value);
      }
    } catch (e) {
      console.warn('[UpstashCache] set error:', e);
    }
  }

  async delete(key: string): Promise<boolean | void> {
    try {
      await this.redis.del(key);
      return true;
    } catch (e) {
      console.warn('[UpstashCache] delete error:', e);
      return false;
    }
  }
}
