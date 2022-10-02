import type { Middleware } from "../types";

function timing() {
  const start = new Date().getTime();
  return function () {
    const end = new Date().getTime();
    return { time: end, diff: end - start };
  };
}

type LogOptions = {
  key?: boolean;
  url?: boolean;
};

function log(options: LogOptions = {}): Middleware {
  const { key = false, url = true } = options;

  return async (context, next) => {
    const tick = timing();
    const data = await next();
    const { time, diff } = tick();

    console.log([`[${time} ${diff}ms]`, key && `[KEY ${context.key}]`, url && `[URL ${context.url}]`].filter(Boolean).join(" - "));

    return data;
  };
}

export type { LogOptions };
export { log };
