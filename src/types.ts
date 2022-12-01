type CodeName = {
  code: string;
  name: string;
};

type Context = {
  key: string;
  url: string;
};

type Options = {
  static?: boolean;
  signal?: AbortSignal;
};

type Middleware = (context: Context, next: () => Promise<any>) => Promise<any>;

export type { CodeName };
export type { Context, Options, Middleware };
