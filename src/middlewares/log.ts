import type { Middleware } from "../types";

const log = (): Middleware => async (context, next) => {
  const start = new Date().getTime();
  const data = await next();
  const end = new Date().getTime();

  console.log(`[${end} | ${end - start}ms] GET ${context.url}`);

  return data;
};

export { log };
