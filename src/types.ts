type CodeName = {
  code: string;
  name: string;
};

type Context = {
  url: string;
};

type Options = {
  signal?: AbortSignal;
};

type Middleware = (context: Context, next: () => Promise<any>) => Promise<any>;

export type { CodeName };
export type { Context, Options, Middleware };
