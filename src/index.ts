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
    static: "https://regions-of-indonesia.github.io/static",
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

const pathname_provinces = "provinces";
const pathname_province = (code: string) => `provinces/${code}`;
const pathname_districts = (code: string) => `provinces/${code}/districts`;
const pathname_district = (code: string) => `districts/${code}`;
const pathname_subdistricts = (code: string) => `districts/${code}/subdistricts`;
const pathname_subdistrict = (code: string) => `subdistricts/${code}`;
const pathname_villages = (code: string) => `subdistricts/${code}/villages`;
const pathname_village = (code: string) => `villages/${code}`;
const pathname_region = (code: string) => `region/${code}`;
const pathname_search = (name: string) => `search?name=${name}`;
const pathname_search_provinces = (name: string) => `search/provinces?name=${name}`;
const pathname_search_districts = (name: string) => `search/districts?name=${name}`;
const pathname_search_subdistricts = (name: string) => `search/subdistricts?name=${name}`;
const pathname_search_villages = (name: string) => `search/villages?name=${name}`;

const acceptString = (value: unknown, message: string): string => {
    if (typeof value === "string") return value;
    throw new Error(message);
  },
  acceptStringRequireCode = (value: unknown) => acceptString(value, `Require code`),
  acceptStringRequireName = (value: unknown) => acceptString(value, `Require name`);

const warnNotSupportStaticAPI = <T>(name: string, value: T): T => {
    console.warn(`${name} API is not supported on static API`);
    return value;
  },
  warnSearchAPI = () => warnNotSupportStaticAPI<Region[]>("Search", []);

const defaultStaticSearchFn = async (_name?: string, _opts?: Options) => warnSearchAPI();

const fetcher = async <T extends any>(url: string, opts?: Options): Promise<T> => {
  const response = await fetch(url, opts);
  if (response?.ok) return await response.json();
  throw new Error("Oops");
};

const betterdiff = (diff: number) =>
  diff >= 10000 ? "10+s" : diff >= 100 ? `${(diff / 1000).toFixed(1)}s` : `${" ".repeat(diff < 10 ? 1 : 0)}${diff}ms`;

type FindAllFn = (opts?: Options) => Promise<Region[]>;
type FindByCodeFn = (code?: string, opts?: Options) => Promise<Region>;
type FindByParentCodeFn = (code?: string, opts?: Options) => Promise<Region[]>;
type RegionFn = (code?: string, opts?: Options) => Promise<Region>;
type SearchFn = (name?: string, opts?: Options) => Promise<Region[]>;

type Client = {
  province: {
    find: {
      (opts?: Options): Promise<Region[]>;
      by: FindByCodeFn;
    };
    search: SearchFn;
  };
  district: {
    find: {
      (code?: string, opts?: Options): Promise<Region[]>;
      by: FindByCodeFn;
    };
    search: SearchFn;
  };
  subdistrict: {
    find: {
      (code?: string, opts?: Options): Promise<Region[]>;
      by: FindByCodeFn;
    };
    search: SearchFn;
  };
  village: {
    find: {
      (code?: string, opts?: Options): Promise<Region[]>;
      by: FindByCodeFn;
    };
    search: SearchFn;
  };
  region: RegionFn;
  search: {
    (name?: string, opts?: Options): Promise<Region[]>;
    provinces: SearchFn;
    districts: SearchFn;
    subdistricts: SearchFn;
    villages: SearchFn;
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
      if (typeof opts?.signal !== "undefined") opts.signal.onabort = () => reject(new Error("Aborted"));
      resolve(await runner(MIDDLEWARES));
    });
  };

  const urlfx = async <T extends any>(key: string, url: string, opts?: Options): Promise<T> => {
    url = `${FINAL_BASE_URL}/${url}`;

    const start = Date.now();
    const log = <T>(value: T) => {
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

  const fx = <T extends any>(key: string, opts?: Options) => urlfx<T>(key, getURLByKey(key), opts);

  const province_find = ((opts) => fx(pathname_provinces, opts)) satisfies FindAllFn;
  const district_find = ((provinceCode, opts) =>
    fx(pathname_districts(acceptStringRequireCode(provinceCode)), opts)) satisfies FindByParentCodeFn;
  const subdistrict_find = ((districtCode, opts) =>
    fx(pathname_subdistricts(acceptStringRequireCode(districtCode)), opts)) satisfies FindByParentCodeFn;
  const village_find = ((subdistrictCode, opts) =>
    fx(pathname_villages(acceptStringRequireCode(subdistrictCode)), opts)) satisfies FindByParentCodeFn;

  (province_find as Client["province"]["find"]).by = ((code, opts) =>
    fx(pathname_province(acceptStringRequireCode(code)), opts)) satisfies FindByCodeFn;
  (district_find as Client["district"]["find"]).by = ((code, opts) =>
    fx(pathname_district(acceptStringRequireCode(code)), opts)) satisfies FindByCodeFn;
  (subdistrict_find as Client["subdistrict"]["find"]).by = ((code, opts) =>
    fx(pathname_subdistrict(acceptStringRequireCode(code)), opts)) satisfies FindByCodeFn;
  (village_find as Client["village"]["find"]).by = ((code, opts) =>
    fx(pathname_village(acceptStringRequireCode(code)), opts)) satisfies FindByCodeFn;

  const province_search = (
    STATIC ? defaultStaticSearchFn : (name, opts) => fx(pathname_search_provinces(acceptStringRequireName(name)), opts)
  ) satisfies SearchFn;
  const district_search = (
    STATIC ? defaultStaticSearchFn : (name, opts) => fx(pathname_search_districts(acceptStringRequireName(name)), opts)
  ) satisfies SearchFn;
  const subdistrict_search = (
    STATIC ? defaultStaticSearchFn : (name, opts) => fx(pathname_search_subdistricts(acceptStringRequireName(name)), opts)
  ) satisfies SearchFn;
  const village_search = (
    STATIC ? defaultStaticSearchFn : (name, opts) => fx(pathname_search_villages(acceptStringRequireName(name)), opts)
  ) satisfies SearchFn;

  const province = { find: province_find, search: province_search } as Client["province"];
  const district = { find: district_find, search: district_search } as Client["district"];
  const subdistrict = { find: subdistrict_find, search: subdistrict_search } as Client["subdistrict"];
  const village = { find: village_find, search: village_search } as Client["village"];
  const region = ((code, opts) => fx(pathname_region(acceptStringRequireCode(code)), opts)) as Client["region"];
  const search = (
    STATIC ? defaultStaticSearchFn : (name, opts) => fx(pathname_search(acceptStringRequireName(name)), opts)
  ) satisfies SearchFn;

  (search as Client["search"]).provinces = province_search;
  (search as Client["search"]).districts = district_search;
  (search as Client["search"]).subdistricts = subdistrict_search;
  (search as Client["search"]).villages = village_search;

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

export type { CreateOptions, Client };
export { create };
