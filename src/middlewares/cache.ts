import type { Middleware } from "../types";

type CacheDriver<T = any> = {
  get: (key: string) => Promise<T>;
  set: (key: string, value: T) => Promise<void>;
  delete: (key: string) => Promise<void>;
};

const createDefaultDriver = (): CacheDriver => {
  const map: Map<string, any> = new Map();

  return {
    get: async (key) => {
      return map.get(key);
    },
    set: async (key, value) => {
      map.set(key, value);
    },
    delete: async (key) => {
      map.delete(key);
    },
  };
};

type CacheOptions = {
  driver?: CacheDriver;
};

function cache(options?: CacheOptions): Middleware {
  const driver = options?.driver ?? createDefaultDriver();

  return async (context, next) => {
    const key = context.key;

    let cached = await driver.get(key);
    if (cached) return cached;

    cached = await next();
    await driver.set(key, cached);

    return cached;
  };
}

export type { CacheDriver, CacheOptions };
export { createDefaultDriver };
export { cache };
