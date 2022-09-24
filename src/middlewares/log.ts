import type { Middleware } from "../types";

type LogOptions = {
  key?: boolean;
  url?: boolean;
};

const log = (options: LogOptions = {}): Middleware => {
  const { key = false, url = true } = options;

  return async (context, next) => {
    const start = new Date().getTime();
    const data = await next();
    const end = new Date().getTime();

    console.log(`[${end} ${end - start}ms] ${key ? `[KEY ${context.key}]` : ""} ${url ? `[URL ${context.url}]` : ""}`);

    return data;
  };
};

export type { LogOptions };
export { log };
