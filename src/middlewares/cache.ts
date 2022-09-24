import type { Middleware } from "../types";

type CacheDriver = {
  get: (key: string) => Promise<any>;
  set: (key: string, value: any) => Promise<any>;
  delete: (key: string) => Promise<any>;
};

const createDefaultDriver = (): CacheDriver => {
  const map: Map<string, any> = new Map();

  return {
    get: async (key) => {
      return map.get(key);
    },
    set: async (key, value) => {
      return map.set(key, value);
    },
    delete: async (key) => {
      return map.delete(key);
    },
  };
};

type CacheOptions = {
  driver?: CacheDriver;
};

const cache = (options: CacheOptions = {}): Middleware => {
  const { driver = createDefaultDriver() } = options;

  return async (context, next) => {
    const key = context.key;

    const cached = await driver.get(key);
    if (cached) return cached;

    const data = await next();
    await driver.set(key, data);

    return data;
  };
};

export type { CacheDriver, CacheOptions };
export { createDefaultDriver };
export { cache };
