import type { Middleware } from "../types";

type DelayOptions = {
  ms?: number;
};

const inner = async <T extends any>(ms: number = 1000, data?: T) => {
  return new Promise<T>((resolve) => {
    setTimeout(() => {
      resolve(data);
    }, ms);
  });
};

function delay(options: DelayOptions = {}): Middleware {
  const { ms = 1000 } = options;

  return async (_, next) => await inner(ms, await next());
}

export type { DelayOptions };
export { delay };
