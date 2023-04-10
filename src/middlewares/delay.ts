import type { Middleware } from "../types";

type DelayOptions = {
  ms?: number;
};

const inner = async <T extends any>(ms: number = 1000, data?: T) => {
  return new Promise<T | undefined>((resolve) => {
    setTimeout(() => {
      resolve(data);
    }, ms);
  });
};

function delay(options?: DelayOptions): Middleware {
  return async (_, next) => await inner(options?.ms, await next());
}

export type { DelayOptions };
export { delay };
