import type { Middleware } from "../types";

type Driver = {
  get: (key: string) => Promise<any>;
  set: (key: string, value: any) => Promise<any>;
  delete: (key: string) => Promise<any>;
};

const createDefaultDriver = (): Driver => {
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

const cache = (driver: Driver = createDefaultDriver()): Middleware => {
  return async (context, next) => {
    const key = context.url;

    const cached = await driver.get(key);
    if (cached) return cached;

    const data = await next();
    await driver.set(key, data);

    return data;
  };
};

export { cache };
