import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";


const hasRedis =
  !!process.env.UPSTASH_REDIS_REST_URL &&
  !!process.env.UPSTASH_REDIS_REST_TOKEN;

let redis: Redis | null = null;
if (hasRedis) {
  redis = new Redis({
    url: process.env.UPSTASH_REDIS_REST_URL!,
    token: process.env.UPSTASH_REDIS_REST_TOKEN!,
  });
}


const inMemoryCache = new Map<string, { count: number; resetTime: number }>();

export interface RateLimitResult {
  success: boolean;
  limit: number;
  remaining: number;
  reset: number;
}

export async function rateLimit(
  key: string,
  limit: number,
  durationWindowMs: number
): Promise<RateLimitResult> {
  if (redis) {
    try {
      const ratelimit = new Ratelimit({
        redis: redis,
        limiter: Ratelimit.slidingWindow(limit, `${durationWindowMs} ms`),
        analytics: true,
      });

      const { success, limit: max, remaining, reset } = await ratelimit.limit(key);
      return { success, limit: max, remaining, reset };
    } catch (error) {
      console.error("Upstash Redis connection error, falling back to memory:", error);
    }
  }

  
  const now = Date.now();
  const cached = inMemoryCache.get(key);

  if (!cached || now > cached.resetTime) {
    const resetTime = now + durationWindowMs;
    inMemoryCache.set(key, { count: 1, resetTime });
    return {
      success: true,
      limit,
      remaining: limit - 1,
      reset: resetTime,
    };
  }

  if (cached.count >= limit) {
    return {
      success: false,
      limit,
      remaining: 0,
      reset: cached.resetTime,
    };
  }

  cached.count += 1;
  return {
    success: true,
    limit,
    remaining: limit - cached.count,
    reset: cached.resetTime,
  };
}
