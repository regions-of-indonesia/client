import type { Middleware } from "./shared";

type CacheDriver<T = any> = {
  get: (key: string) => Promise<T>;
  set: (key: string, value: T) => Promise<void>;
  del: (key: string) => Promise<void>;
};

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

const delay = (options?: { ms?: number }): Middleware => {
  const wait = async () => new Promise<void>((resolve) => setTimeout(resolve, options?.ms ?? 100));

  return async (_, next) => {
    await wait();
    return await next();
  };
};

export type { CacheDriver };
export { cache, createMemoryDriver, delay };
