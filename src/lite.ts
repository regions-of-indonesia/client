import { createMemoryDriver } from "./middlewares";

import type {
  Options,
  FindAllFn,
  FindByCodeFn,
  FindByParentCodeFn,
  RegionFn,
  SearchFn,
  FindAllObject,
  FindByCodeObject,
  SearchObject,
} from "./shared";
import {
  DEFAULT_DYNAMIC_BASE_URL,
  DEFAULT_STATIC_BASE_URL,
  pathname_provinces,
  pathname_province,
  pathname_districts,
  pathname_district,
  pathname_subdistricts,
  pathname_subdistrict,
  pathname_villages,
  pathname_village,
  pathname_region,
  pathname_search,
  pathname_search_provinces,
  pathname_search_districts,
  pathname_search_subdistricts,
  pathname_search_villages,
  fetcher,
  getDynamicURLByKey,
  getStaticURLByKey,
  acceptStringRequireCode,
  acceptStringRequireName,
} from "./shared";

const createFX = (base: string, getURLByKey: (key: string) => string) => {
  const cache = createMemoryDriver();

  return async <T extends any>(key: string, opts?: Options) => {
    if (opts?.signal?.aborted) throw new Error("Aborted");

    let item = await cache.get(key);
    if (item) return item;

    item = await fetcher<T>(`${base}/${getURLByKey(key)}`, opts);
    await cache.set(key, item);
    return item;
  };
};

type DynamicClient = {
  /**
   * province actions
   */
  province: {
    /**
     * find province actions
     *
     * @example
     *
     * province.find();
     * province.find.by("11");
     */
    find: FindAllObject;
    /**
     * provinces search function
     *
     * @example
     *
     * province.search("name-to-search");
     */
    search: SearchFn;
  };
  /**
   * district actions
   */
  district: {
    /**
     * find district actions
     *
     * @example
     *
     * district.find("11");
     * district.find.by("11.01");
     */
    find: FindByCodeObject;
    /**
     * districts search function
     *
     * @example
     *
     * district.search("name-to-search");
     */
    search: SearchFn;
  };
  /**
   * subdistrict actions
   */
  subdistrict: {
    /**
     * find subdistrict actions
     *
     * @example
     *
     * subdistrict.find("11.01");
     * subdistrict.find.by("11.01.01");
     */
    find: FindByCodeObject;
    /**
     * subdistricts search function
     *
     * @example
     *
     * subdistrict.search("name-to-search");
     */
    search: SearchFn;
  };
  /**
   * village actions
   */
  village: {
    /**
     * find village actions
     *
     * @example
     *
     * village.find("11.01.01");
     * village.find.by("11.01.01.2001");
     */
    find: FindByCodeObject;
    /**
     * villages search function
     *
     * @example
     *
     * village.search("name-to-search");
     */
    search: SearchFn;
  };
  /**
   * region function
   *
   * @example
   *
   * region("11");
   * region("11.01");
   * region("11.01.01");
   * region("11.01.01.2001");
   */
  region: RegionFn;
  /**
   * search actions function
   *
   * @example
   *
   * search("name-to-search");
   */
  search: SearchObject;
};

/**
 *
 * @param base base URL for dynamic API
 * @returns dynamic client
 */
const createDynamic = (base: string = DEFAULT_DYNAMIC_BASE_URL): DynamicClient => {
  const fx = createFX(base, getDynamicURLByKey);

  const province_find = ((opts) => fx(pathname_provinces, opts)) satisfies FindAllFn;
  const district_find = ((provinceCode, opts) =>
    fx(pathname_districts(acceptStringRequireCode(provinceCode)), opts)) satisfies FindByParentCodeFn;
  const subdistrict_find = ((districtCode, opts) =>
    fx(pathname_subdistricts(acceptStringRequireCode(districtCode)), opts)) satisfies FindByParentCodeFn;
  const village_find = ((subdistrictCode, opts) =>
    fx(pathname_villages(acceptStringRequireCode(subdistrictCode)), opts)) satisfies FindByParentCodeFn;

  (province_find as DynamicClient["province"]["find"]).by = ((code, opts) =>
    fx(pathname_province(acceptStringRequireCode(code)), opts)) satisfies FindByCodeFn;
  (district_find as DynamicClient["district"]["find"]).by = ((code, opts) =>
    fx(pathname_district(acceptStringRequireCode(code)), opts)) satisfies FindByCodeFn;
  (subdistrict_find as DynamicClient["subdistrict"]["find"]).by = ((code, opts) =>
    fx(pathname_subdistrict(acceptStringRequireCode(code)), opts)) satisfies FindByCodeFn;
  (village_find as DynamicClient["village"]["find"]).by = ((code, opts) =>
    fx(pathname_village(acceptStringRequireCode(code)), opts)) satisfies FindByCodeFn;

  const province_search = ((name, opts) => fx(pathname_search_provinces(acceptStringRequireName(name)), opts)) satisfies SearchFn;
  const district_search = ((name, opts) => fx(pathname_search_districts(acceptStringRequireName(name)), opts)) satisfies SearchFn;
  const subdistrict_search = ((name, opts) => fx(pathname_search_subdistricts(acceptStringRequireName(name)), opts)) satisfies SearchFn;
  const village_search = ((name, opts) => fx(pathname_search_villages(acceptStringRequireName(name)), opts)) satisfies SearchFn;

  const province = { find: province_find, search: province_search } as DynamicClient["province"];
  const district = { find: district_find, search: district_search } as DynamicClient["district"];
  const subdistrict = { find: subdistrict_find, search: subdistrict_search } as DynamicClient["subdistrict"];
  const village = { find: village_find, search: village_search } as DynamicClient["village"];
  const region = ((code, opts) => fx(pathname_region(acceptStringRequireCode(code)), opts)) as DynamicClient["region"];
  const search = ((name, opts) => fx(pathname_search(acceptStringRequireName(name)), opts)) satisfies SearchFn;

  (search as DynamicClient["search"]).provinces = province_search;
  (search as DynamicClient["search"]).districts = district_search;
  (search as DynamicClient["search"]).subdistricts = subdistrict_search;
  (search as DynamicClient["search"]).villages = village_search;

  return { province, district, subdistrict, village, region, search } as DynamicClient;
};

type StaticClient = {
  /**
   * province actions
   */
  province: {
    /**
     * find province actions
     *
     * @example
     *
     * province.find();
     * province.find.by("11");
     */
    find: FindAllObject;
  };
  /**
   * district actions
   */
  district: {
    /**
     * find district actions
     *
     * @example
     *
     * district.find("11");
     * district.find.by("11.01");
     */
    find: FindByCodeObject;
  };
  /**
   * subdistrict actions
   */
  subdistrict: {
    /**
     * find subdistrict actions
     *
     * @example
     *
     * subdistrict.find("11.01");
     * subdistrict.find.by("11.01.01");
     */
    find: FindByCodeObject;
  };
  /**
   * village actions
   */
  village: {
    /**
     * find village actions
     *
     * @example
     *
     * village.find("11.01.01");
     * village.find.by("11.01.01.2001");
     */
    find: FindByCodeObject;
  };
  /**
   * region function
   *
   * @example
   *
   * region("11");
   * region("11.01");
   * region("11.01.01");
   * region("11.01.01.2001");
   */
  region: RegionFn;
};

/**
 *
 * @param base base URL for static API
 * @returns static client
 */
const createStatic = (base: string = DEFAULT_STATIC_BASE_URL): StaticClient => {
  const fx = createFX(base, getStaticURLByKey);

  const province_find = ((opts) => fx(pathname_provinces, opts)) satisfies FindAllFn;
  const district_find = ((provinceCode, opts) =>
    fx(pathname_districts(acceptStringRequireCode(provinceCode)), opts)) satisfies FindByParentCodeFn;
  const subdistrict_find = ((districtCode, opts) =>
    fx(pathname_subdistricts(acceptStringRequireCode(districtCode)), opts)) satisfies FindByParentCodeFn;
  const village_find = ((subdistrictCode, opts) =>
    fx(pathname_villages(acceptStringRequireCode(subdistrictCode)), opts)) satisfies FindByParentCodeFn;

  (province_find as StaticClient["province"]["find"]).by = ((code, opts) =>
    fx(pathname_province(acceptStringRequireCode(code)), opts)) satisfies FindByCodeFn;
  (district_find as StaticClient["district"]["find"]).by = ((code, opts) =>
    fx(pathname_district(acceptStringRequireCode(code)), opts)) satisfies FindByCodeFn;
  (subdistrict_find as StaticClient["subdistrict"]["find"]).by = ((code, opts) =>
    fx(pathname_subdistrict(acceptStringRequireCode(code)), opts)) satisfies FindByCodeFn;
  (village_find as StaticClient["village"]["find"]).by = ((code, opts) =>
    fx(pathname_village(acceptStringRequireCode(code)), opts)) satisfies FindByCodeFn;

  const province = { find: province_find } as StaticClient["province"];
  const district = { find: district_find } as StaticClient["district"];
  const subdistrict = { find: subdistrict_find } as StaticClient["subdistrict"];
  const village = { find: village_find } as StaticClient["village"];

  const region = ((code, opts) => fx(pathname_region(acceptStringRequireCode(code)), opts)) as StaticClient["region"];

  return { province, district, subdistrict, village, region } as StaticClient;
};

export type { DynamicClient, StaticClient };
export { createDynamic, createStatic };
