import type { Middleware } from "../types";

function timing() {
  const start = new Date().getTime();
  return function () {
    const endDate = new Date();
    return [endDate, endDate.getTime() - start] as const;
  };
}

type LogOptions = {
  key?: boolean;
  url?: boolean;
  format?: boolean;
  type?: "log" | "warn" | "info";
};

const betterdiff = (diff: number) => {
  if (diff >= 10000) return "10+s";
  if (diff >= 100) return `${(diff / 1000).toFixed(1)}s`;
  return `${" ".repeat(diff < 10 ? 1 : 0)}${diff}ms`;
};

function log(options?: LogOptions): Middleware {
  return async (context, next) => {
    const tick = timing(),
      data = await next(),
      [endDate, diff] = tick(),
      type = options?.type ?? "log";

    if (type in console) {
      console[type](
        [
          `[${options?.format ?? true ? endDate.toLocaleString() : endDate.getTime()}]`,
          `[${betterdiff(diff)}]`,
          (options?.key ?? true) && `[KEY ${context.key}]`,
          (options?.url ?? true) && `[URL ${context.url}]`,
        ]
          .filter(Boolean)
          .join("  |  ")
      );
    }

    return data;
  };
}

export type { LogOptions };
export { log };
