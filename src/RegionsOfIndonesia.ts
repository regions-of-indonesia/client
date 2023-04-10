import type { CodeName, Context, Options, Middleware, RegionResult, SearchResult } from "./types";

const dotjson = (key: string) => `${key}.json`;

interface BaseURLObject {
  dynamic: string;
  static: string;
}

interface CreateOptions {
  baseURL?: Partial<BaseURLObject>;
  static?: boolean;
  middlewares?: Middleware[];
}

const DEFAULT_BASE_URL: BaseURLObject = {
    dynamic: "https://regions-of-indonesia.deno.dev",
    static: "https://regions-of-indonesia.github.io/static-api",
  },
  DEFAULT_MIDDLEWARES: Middleware[] = [],
  DEFAULT_STATIC: boolean = true;

const resolveBaseURL = (value?: CreateOptions["baseURL"]): BaseURLObject => ({
    ...DEFAULT_BASE_URL,
    ...(typeof value === "object" && value !== null ? value : {}),
  }),
  resolveMiddlewares = (value?: CreateOptions["middlewares"]): Middleware[] => (Array.isArray(value) ? value : DEFAULT_MIDDLEWARES),
  resolveStatic = (value?: CreateOptions["static"]): boolean => (typeof value === "boolean" ? value : DEFAULT_STATIC);

const PATHNAME = {
  ps: () => `provinces`,
  p: (code: string) => `province/${code}`,
  ds: (provinceCode: string) => `districts/${provinceCode}`,
  d: (code: string) => `district/${code}`,
  ds_p: (code: string) => `province/${code}/districts`,
  sds: (districtCode: string) => `subdistricts/${districtCode}`,
  sd: (code: string) => `subdistrict/${code}`,
  sds_d: (code: string) => `district/${code}/subdistricts`,
  vs: (subdistrictCode: string) => `villages/${subdistrictCode}`,
  v: (code: string) => `village/${code}`,
  vs_sd: (code: string) => `subdistrict/${code}/villages`,
  r: (code: string) => `region/${code}`,
  f: (name: string) => `search?name=${name}`,
  fps: (name: string) => `search/provinces?name=${name}`,
  fds: (name: string) => `search/districts?name=${name}`,
  fsds: (name: string) => `search/subdistricts?name=${name}`,
  fvs: (name: string) => `search/villages?name=${name}`,
};

const acceptString = (value: unknown, message: string): string => {
    if (typeof value !== "string") throw new Error(message);
    return value;
  },
  acceptStringRequireCode = (value: unknown) => acceptString(value, "Require code"),
  acceptStringRequireName = (value: unknown) => acceptString(value, "Require name");

const NotSupportStaticAPI = <T>(name: string, value: T): T => {
    console.warn(`${name} API is not supported on static API`);
    return value;
  },
  RegionAPIWarning = <T>(value: T): T => NotSupportStaticAPI("Region", value),
  SearchAPIWarning = <T>(value: T): T => NotSupportStaticAPI("Search", value);

const fetcher = async <T extends any>(url: string, opts?: Options): Promise<T> => {
  const response = await fetch(url, opts);
  if (!response.ok) throw new Error("Oops");
  return await response.json();
};

const create = (options?: CreateOptions) => {
  const BASE_URL: BaseURLObject = resolveBaseURL(options?.baseURL);
  const MIDDLEWARES: Middleware[] = resolveMiddlewares(options?.middlewares);
  const STATIC: boolean = resolveStatic(options?.static);

  const getURLByKey = (key: string) => (STATIC ? dotjson(key) : key);

  const execute = async (ctx: Context, fallback: (ctx: Context) => Promise<any>, opts?: Options): Promise<any> => {
    if (opts?.signal?.aborted) throw new Error("Aborted");

    async function runner(middlewares: Middleware[]): Promise<any> {
      const [middleware, ..._middlewares] = middlewares;
      return typeof middleware === "function" ? await middleware(ctx, async () => await runner(_middlewares)) : await fallback(ctx);
    }

    return new Promise(async (resolve, reject) => {
      if (!opts?.signal?.aborted) {
        if (typeof opts?.signal !== "undefined") {
          opts.signal.onabort = () => {
            reject(new Error("Aborted"));
            return;
          };
        }
      }

      resolve(await runner(MIDDLEWARES));
    });
  };

  const urlfeetch = async <T extends any>(key: string, url: string, opts?: Options): Promise<T> => {
    if (opts?.signal?.aborted) throw new Error("Aborted");

    const finalURL = `${STATIC ? BASE_URL.static : BASE_URL.dynamic}/${url}`;

    if (MIDDLEWARES.length === 0) return await fetcher(finalURL, opts);
    return await execute({ key, url: finalURL }, async (ctx: Context) => await fetcher(ctx.url, opts), opts);
  };

  const feetch = <T extends any>(key: string, opts?: Options) => urlfeetch<T>(key, getURLByKey(key), opts);

  const createFindByFn = (keyofPATHNAME: keyof typeof PATHNAME) => (code?: string, opts?: Options) =>
      feetch<CodeName>(PATHNAME[keyofPATHNAME](acceptStringRequireCode(code)), opts),
    createSearchForCodeNamesFn = (keyofPATHNAME: keyof typeof PATHNAME) => async (name?: string, opts?: Options) =>
      STATIC ? SearchAPIWarning<CodeName[]>([]) : await feetch<CodeName[]>(PATHNAME[keyofPATHNAME](acceptStringRequireName(name)), opts);

  const province_find = async (opts?: Options) => await feetch<CodeName[]>(PATHNAME.ps(), opts),
    province_search = createSearchForCodeNamesFn("fps"),
    district_find = (provinceCode?: string, opts?: Options) => feetch<CodeName[]>(PATHNAME.ds(acceptStringRequireCode(provinceCode)), opts),
    district_search = createSearchForCodeNamesFn("fds"),
    subdistrict_find = (districtCode?: string, opts?: Options) =>
      feetch<CodeName[]>(PATHNAME.sds(acceptStringRequireCode(districtCode)), opts),
    subdistrict_search = createSearchForCodeNamesFn("fsds"),
    village_find = (subdistrictCode?: string, opts?: Options) =>
      feetch<CodeName[]>(PATHNAME.vs(acceptStringRequireCode(subdistrictCode)), opts),
    village_search = createSearchForCodeNamesFn("fvs");

  province_find.by = createFindByFn("p");
  district_find.by = createFindByFn("d");
  subdistrict_find.by = createFindByFn("sd");
  village_find.by = createFindByFn("v");

  const province = { find: province_find, search: province_search },
    district = { find: district_find, search: district_search },
    subdistrict = { find: subdistrict_find, search: subdistrict_search },
    village = { find: village_find, search: village_search },
    region = async (code?: string, opts?: Options) =>
      STATIC ? RegionAPIWarning<RegionResult>({}) : await feetch<RegionResult>(PATHNAME.r(acceptStringRequireCode(code)), opts),
    search = async (name?: string, opts?: Options) =>
      STATIC
        ? SearchAPIWarning<SearchResult>({ provinces: [], districts: [], subdistricts: [], villages: [] })
        : await feetch<SearchResult>(PATHNAME.f(acceptStringRequireName(name)), opts);

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
  };
};

export { create };
