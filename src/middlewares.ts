import type { Middleware } from "./shared";

type CacheDriver<T = any> = {
  /**
   *
   * @param key cache key
   * @returns cache value
   */
  get: (key: string) => Promise<T>;
  /**
   *
   * @param key cache key
   * @param value cache value
   * @returns void
   */
  set: (key: string, value: T) => Promise<void>;
  /**
   *
   * @param key cache key
   * @returns void
   */
  del: (key: string) => Promise<void>;
};

/**
 *
 * @returns cache driver
 */
const createMemoryDriver = (): CacheDriver => {
  const map: Map<string, any> = new Map();

  return {
    get: async (key) => {
      return map.get(key);
    },
    set: async (key, value) => {
      map.set(key, value);
    },
    del: async (key) => {
      map.delete(key);
    },
  };
};

/**
 *
 * @param options options
 * @returns cache middleware
 */
const cache = (options?: { driver?: CacheDriver }): Middleware => {
  const driver = options?.driver ?? createMemoryDriver();

  return async (context, next) => {
    let cached = await driver.get(context.key);
    if (cached) return cached;
    cached = await next();
    await driver.set(context.key, cached);
    return cached;
  };
};

/**
 *
 * @param options options
 * @returns delay middleware
 */
const delay = (options?: { ms?: number }): Middleware => {
  const wait = async () => new Promise<void>((resolve) => setTimeout(resolve, options?.ms ?? 100));

  return async (_, next) => {
    await wait();
    return await next();
  };
};

export type { CacheDriver };
export { cache, createMemoryDriver, delay };
