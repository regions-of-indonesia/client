import type { Region } from "@regions-of-indonesia/types";

export type Context = {
  key: string;
  url: string;
};

export type Options = {
  signal?: AbortSignal;
};

export type Middleware = (context: Context, next: () => Promise<any>) => Promise<any>;

export type FindAllFn = (opts?: Options) => Promise<Region[]>;
export type FindByCodeFn = (code?: string, opts?: Options) => Promise<Region>;
export type FindByParentCodeFn = (code?: string, opts?: Options) => Promise<Region[]>;
export type RegionFn = (code?: string, opts?: Options) => Promise<Region>;
export type SearchFn = (name?: string, opts?: Options) => Promise<Region[]>;

export type FindAllObject = {
  (opts?: Options): Promise<Region[]>;
  by: FindByCodeFn;
};
export type FindByCodeObject = {
  (code?: string, opts?: Options): Promise<Region[]>;
  by: FindByCodeFn;
};
export type SearchObject = {
  (name?: string, opts?: Options): Promise<Region[]>;
  provinces: SearchFn;
  districts: SearchFn;
  subdistricts: SearchFn;
  villages: SearchFn;
};

export const DEFAULT_DYNAMIC_BASE_URL = "https://regions-of-indonesia.deno.dev";
export const DEFAULT_STATIC_BASE_URL = "https://regions-of-indonesia.github.io/static";

export const pathname_provinces = "provinces";
export const pathname_province = (code: string) => `provinces/${code}`;
export const pathname_districts = (code: string) => `provinces/${code}/districts`;
export const pathname_district = (code: string) => `districts/${code}`;
export const pathname_subdistricts = (code: string) => `districts/${code}/subdistricts`;
export const pathname_subdistrict = (code: string) => `subdistricts/${code}`;
export const pathname_villages = (code: string) => `subdistricts/${code}/villages`;
export const pathname_village = (code: string) => `villages/${code}`;
export const pathname_region = (code: string) => `region/${code}`;
export const pathname_search = (name: string) => `search?name=${name}`;
export const pathname_search_provinces = (name: string) => `search/provinces?name=${name}`;
export const pathname_search_districts = (name: string) => `search/districts?name=${name}`;
export const pathname_search_subdistricts = (name: string) => `search/subdistricts?name=${name}`;
export const pathname_search_villages = (name: string) => `search/villages?name=${name}`;

export const fetcher = async <T extends any>(url: string, opts?: Options): Promise<T> => {
  const response = await fetch(url, opts);
  if (response.ok) return await response.json();
  throw new Error("Oops");
};

export const getDynamicURLByKey = (key: string) => key;
export const getStaticURLByKey = (key: string) => `${key}.json`;

export const acceptString = (value: unknown, message: string): string => {
  if (typeof value === "string") return value;
  throw new Error(message);
};
export const acceptStringRequireCode = (value: unknown) => acceptString(value, `Require code`);
export const acceptStringRequireName = (value: unknown) => acceptString(value, `Require name`);
