import type { Region } from "@regions-of-indonesia/types";

import type { Context, Options, Middleware } from "./types";

interface BaseURLObject {
  dynamic: string;
  static: string;
}

interface CreateOptions {
  baseURL?: Partial<BaseURLObject>;
  static?: boolean;
  middlewares?: Middleware[];
  logger?: boolean;
}

const DEFAULT_BASE_URL: BaseURLObject = {
    dynamic: "https://regions-of-indonesia.deno.dev",
    static: "https://regions-of-indonesia.github.io/static-api",
  },
  DEFAULT_MIDDLEWARES: Middleware[] = [],
  DEFAULT_STATIC: boolean = true,
  DEFAULT_LOGGER: boolean = true;

const resolveBaseURL = (value?: CreateOptions["baseURL"]): BaseURLObject => ({
    ...DEFAULT_BASE_URL,
    ...(typeof value === "object" && value !== null ? value : {}),
  }),
  resolveMiddlewares = (value?: CreateOptions["middlewares"]): Middleware[] => (Array.isArray(value) ? value : DEFAULT_MIDDLEWARES),
  resolveStatic = (value?: CreateOptions["static"]): boolean => (typeof value === "boolean" ? value : DEFAULT_STATIC),
  resolveLogger = (value?: CreateOptions["logger"]): boolean => (typeof value === "boolean" ? value : DEFAULT_LOGGER);

const getDynamicURLByKey = (key: string) => key;
const getStaticURLByKey = (key: string) => `${key}.json`;

const STR = ["provinces", "districts", "subdistricts", "villages", "region", "search", "code", "name"] as const;

const PATHNAME = {
  ps: () => STR[0],
  p: (code: string) => `${STR[0]}/${code}`,
  ds: (code: string) => `${STR[0]}/${code}/${STR[1]}`,
  d: (code: string) => `${STR[1]}/${code}`,
  sds: (code: string) => `${STR[1]}/${code}/${STR[2]}`,
  sd: (code: string) => `${STR[2]}/${code}`,
  vs: (code: string) => `${STR[2]}/${code}/${STR[3]}`,
  v: (code: string) => `${STR[3]}/${code}`,
  r: (code: string) => `${STR[4]}/${code}`,
  f: (name: string) => `${STR[5]}?${STR[7]}=${name}`,
  fps: (name: string) => `${STR[5]}/${STR[0]}?${STR[7]}=${name}`,
  fds: (name: string) => `${STR[5]}/${STR[1]}?${STR[7]}=${name}`,
  fsds: (name: string) => `${STR[5]}/${STR[2]}?${STR[7]}=${name}`,
  fvs: (name: string) => `${STR[5]}/${STR[3]}?${STR[7]}=${name}`,
};

type TypeofPATHNAME = typeof PATHNAME;

const acceptString = (value: unknown, message: string): string => {
    if (typeof value !== "string") throw new Error(message);
    return value;
  },
  acceptStringRequireCode = (value: unknown) => acceptString(value, `Require ${STR[6]}`),
  acceptStringRequireName = (value: unknown) => acceptString(value, `Require ${STR[7]}`);

const warnNotSupportStaticAPI = <T>(enable: boolean, name: string, value: T): T => {
    if (enable) console.warn(`${name} API is not supported on static API`);
    return value;
  },
  warnSearchAPI = <T>(enable: boolean, value: T): T => warnNotSupportStaticAPI(enable, "Search", value);

const fetcher = async <T extends any>(url: string, opts?: Options): Promise<T> => {
  const response = await fetch(url, opts);
  if (response?.ok) return await response.json();
  throw new Error("Oops");
};

const betterdiff = (diff: number) =>
  diff >= 10000 ? "10+s" : diff >= 100 ? `${(diff / 1000).toFixed(1)}s` : `${" ".repeat(diff < 10 ? 1 : 0)}${diff}ms`;

type Client = {
  province: {
    find: {
      (opts?: Options): Promise<Region[]>;
      by: (code?: string, opts?: Options) => Promise<Region>;
    };
    search: (name?: string, opts?: Options) => Promise<Region[]>;
  };
  district: {
    find: {
      (code?: string, opts?: Options): Promise<Region[]>;
      by: (code?: string, opts?: Options) => Promise<Region>;
    };
    search: (name?: string, opts?: Options) => Promise<Region[]>;
  };
  subdistrict: {
    find: {
      (code?: string, opts?: Options): Promise<Region[]>;
      by: (code?: string, opts?: Options) => Promise<Region>;
    };
    search: (name?: string, opts?: Options) => Promise<Region[]>;
  };
  village: {
    find: {
      (code?: string, opts?: Options): Promise<Region[]>;
      by: (code?: string, opts?: Options) => Promise<Region>;
    };
    search: (name?: string, opts?: Options) => Promise<Region[]>;
  };
  region: (code?: string, opts?: Options) => Promise<Region>;
  search: {
    (name?: string, opts?: Options): Promise<Region[]>;
    provinces: Client["province"]["search"];
    districts: Client["district"]["search"];
    subdistricts: Client["subdistrict"]["search"];
    villages: Client["village"]["search"];
  };
};

const create = (options?: CreateOptions) => {
  const BASE_URL: BaseURLObject = resolveBaseURL(options?.baseURL);
  const MIDDLEWARES: Middleware[] = resolveMiddlewares(options?.middlewares);
  const STATIC: boolean = resolveStatic(options?.static);
  const LOGGER: boolean = resolveLogger(options?.logger);

  const FINAL_BASE_URL = STATIC ? BASE_URL.static : BASE_URL.dynamic;

  const getURLByKey = STATIC ? getStaticURLByKey : getDynamicURLByKey;

  const execute = async (ctx: Context, fallback: (ctx: Context) => Promise<any>, opts?: Options): Promise<any> => {
    if (opts?.signal?.aborted) throw new Error("Aborted");

    const runner = (middlewares: Middleware[]): Promise<any> => {
      const [middleware, ..._middlewares] = middlewares;
      return typeof middleware === "function" ? middleware(ctx, () => runner(_middlewares)) : fallback(ctx);
    };

    return new Promise(async (resolve, reject) => {
      if (typeof opts?.signal !== "undefined") {
        opts.signal.onabort = () => {
          reject(new Error("Aborted"));
        };
      }

      resolve(await runner(MIDDLEWARES));
    });
  };

  const urlfeetch = async <T extends any>(key: string, url: string, opts?: Options): Promise<T> => {
    url = `${FINAL_BASE_URL}/${url}`;

    const start = Date.now(),
      log = <T>(value: T) => {
        if (LOGGER) {
          const end = Date.now();
          console.log([`[${end}]`, `[${betterdiff(end - start)}]`, `[KEY ${key}]`, `[URL ${url}]`].filter(Boolean).join("  |  "));
        }
        return value;
      };

    if (opts?.signal?.aborted) throw new Error("Aborted");

    if (MIDDLEWARES.length === 0) return log(await fetcher<T>(url, opts));
    return log(await execute({ key, url }, async (ctx: Context) => await fetcher(ctx.url, opts), opts));
  };

  const feetch = <T extends any>(key: string, opts?: Options) => urlfeetch<T>(key, getURLByKey(key), opts);

  const createFindByFn = (keyofPATHNAME: keyof TypeofPATHNAME) => (code?: string, opts?: Options) =>
      feetch<Region>(PATHNAME[keyofPATHNAME](acceptStringRequireCode(code)), opts),
    createSearchFn = (keyofPATHNAME: keyof TypeofPATHNAME) =>
      STATIC
        ? async (_name?: string, _opts?: Options) => warnSearchAPI<Region[]>(LOGGER, [])
        : (name?: string, opts?: Options) => feetch<Region[]>(PATHNAME[keyofPATHNAME](acceptStringRequireName(name)), opts);

  const province_find = (opts?: Options) => feetch<Region[]>(PATHNAME.ps(), opts),
    province_search = createSearchFn("fps"),
    district_find = (provinceCode?: string, opts?: Options) => feetch<Region[]>(PATHNAME.ds(acceptStringRequireCode(provinceCode)), opts),
    district_search = createSearchFn("fds"),
    subdistrict_find = (districtCode?: string, opts?: Options) =>
      feetch<Region[]>(PATHNAME.sds(acceptStringRequireCode(districtCode)), opts),
    subdistrict_search = createSearchFn("fsds"),
    village_find = (subdistrictCode?: string, opts?: Options) =>
      feetch<Region[]>(PATHNAME.vs(acceptStringRequireCode(subdistrictCode)), opts),
    village_search = createSearchFn("fvs");

  province_find.by = createFindByFn("p");
  district_find.by = createFindByFn("d");
  subdistrict_find.by = createFindByFn("sd");
  village_find.by = createFindByFn("v");

  const province = { find: province_find, search: province_search } as Client["province"],
    district = { find: district_find, search: district_search } as Client["district"],
    subdistrict = { find: subdistrict_find, search: subdistrict_search } as Client["subdistrict"],
    village = { find: village_find, search: village_search } as Client["village"],
    region = ((code?, opts?) => feetch<Region>(PATHNAME.r(acceptStringRequireCode(code)), opts)) as Client["region"],
    search = (
      STATIC
        ? async (_name?: string, _opts?: Options) => warnSearchAPI<Region[]>(LOGGER, [])
        : (name?: string, opts?: Options) => feetch<Region[]>(PATHNAME.f(acceptStringRequireName(name)), opts)
    ) as Client["search"];

  search.provinces = province_search;
  search.districts = district_search;
  search.subdistricts = subdistrict_search;
  search.villages = village_search;

  return {
    province,
    district,
    subdistrict,
    village,
    region,
    search,
  } as Client;
};

export type { CacheDriver } from "./middlewares";
export { cache, createMemoryDriver, delay } from "./middlewares";

export type { CreateOptions };
export { create };
