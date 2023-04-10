type CodeName = {
  code: string;
  name: string;
};

type RegionResult = {
  province?: CodeName;
  district?: CodeName;
  subdistrict?: CodeName;
  village?: CodeName;
};

type SearchResult = {
  provinces: CodeName[];
  districts: CodeName[];
  subdistricts: CodeName[];
  villages: CodeName[];
};

type Options = {
  signal?: AbortSignal;
};

type Context = {
  key: string;
  url: string;
};

type Middleware = (context: Context, next: () => Promise<any>) => Promise<any>;

export type { CodeName, RegionResult, SearchResult };
export type { Options, Context, Middleware };
