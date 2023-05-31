type Context = {
  key: string;
  url: string;
};

type Options = {
  signal?: AbortSignal;
};

type Middleware = (context: Context, next: () => Promise<any>) => Promise<any>;

export type { Context, Options, Middleware };
