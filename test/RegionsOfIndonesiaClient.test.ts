import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { hasOwnProperties, isTypeofObject } from "javascript-yesterday";

import type { CodeName } from "../src";
import { RegionsOfIndonesiaClient, log, cache } from "../src";

import { isCodeName, isCodeNameArray } from "./@shared";

const __DEV__ = true;
const getBaseURL = () => (__DEV__ ? { dynamic: "http://127.1.0.0:8000" } : {});

function isSearchResult(value: unknown): value is Record<string, CodeName[]> {
  if (isTypeofObject(value) && hasOwnProperties(value, "provinces", "districts", "subdistricts", "villages")) {
    const { provinces, districts, subdistricts, villages } = value;

    return [provinces, districts, subdistricts, villages].every(isCodeNameArray);
  }

  return false;
}

const withAbortionIn = async <T extends any>(callback: (signal: AbortSignal) => Promise<T>) => {
  const controller = new AbortController();

  setTimeout(() => {
    controller.abort();
  }, 20);

  let aborted = false;
  try {
    await callback(controller.signal);
  } catch (error) {
    aborted = true;
  }

  expect(aborted).toBeTruthy();
};

describe("Regions of Indonesia client Dynamic API", () => {
  const client = new RegionsOfIndonesiaClient({
    baseURL: getBaseURL(),
    middlewares: [
      log({
        key: true,
        url: true,
      }),
      cache({}),
    ],
    static: false,
  });

  it("Provinces", async () => {
    expect(isCodeNameArray(await client.province.find())).toBeTruthy();
  });

  it("[CACHE] Provinces", async () => {
    expect(isCodeNameArray(await client.province.find())).toBeTruthy();
  });

  it("Province by code", async () => {
    expect(isCodeName(await client.province.findByCode("11"))).toBeTruthy();
  });

  it("[CACHE] Province by code", async () => {
    expect(isCodeName(await client.province.findByCode("11"))).toBeTruthy();
  });

  it("Provinces search", async () => {
    expect(isCodeNameArray(await client.province.search("a"))).toBeTruthy();
  });

  it("[CACHE] Provinces search", async () => {
    expect(isCodeNameArray(await client.province.search("a"))).toBeTruthy();
  });

  it("Districts by province code", async () => {
    expect(isCodeNameArray(await client.district.findByProvinceCode("11"))).toBeTruthy();
  });

  it("[CACHE] Districts by province code", async () => {
    expect(isCodeNameArray(await client.district.findByProvinceCode("11"))).toBeTruthy();
  });

  it("District by code", async () => {
    expect(isCodeName(await client.district.findByCode("11.01"))).toBeTruthy();
  });

  it("[CACHE] District by code", async () => {
    expect(isCodeName(await client.district.findByCode("11.01"))).toBeTruthy();
  });

  it("Districts search", async () => {
    expect(isCodeNameArray(await client.district.search("a"))).toBeTruthy();
  });

  it("[CACHE] Districts search", async () => {
    expect(isCodeNameArray(await client.district.search("a"))).toBeTruthy();
  });

  it("Subdistricts by district code", async () => {
    expect(isCodeNameArray(await client.subdistrict.findByDistrictCode("11.01"))).toBeTruthy();
  });

  it("[CACHE] Subdistricts by district code", async () => {
    expect(isCodeNameArray(await client.subdistrict.findByDistrictCode("11.01"))).toBeTruthy();
  });

  it("Subdistrict by code", async () => {
    expect(isCodeName(await client.subdistrict.findByCode("11.01.01"))).toBeTruthy();
  });

  it("[CACHE] Subdistrict by code", async () => {
    expect(isCodeName(await client.subdistrict.findByCode("11.01.01"))).toBeTruthy();
  });

  it("Subdistricts search", async () => {
    expect(isCodeNameArray(await client.subdistrict.search("a"))).toBeTruthy();
  });

  it("[CACHE] Subdistricts search", async () => {
    expect(isCodeNameArray(await client.subdistrict.search("a"))).toBeTruthy();
  });

  it("Villages by subdistrict code", async () => {
    expect(isCodeNameArray(await client.village.findBySubdistrictCode("11.01.01"))).toBeTruthy();
  });

  it("[CACHE] Villages by subdistrict code", async () => {
    expect(isCodeNameArray(await client.village.findBySubdistrictCode("11.01.01"))).toBeTruthy();
  });

  it("Village by code", async () => {
    expect(isCodeName(await client.village.findByCode("11.01.01.2001"))).toBeTruthy();
  });

  it("[CACHE] Village by code", async () => {
    expect(isCodeName(await client.village.findByCode("11.01.01.2001"))).toBeTruthy();
  });

  it("Villages search", async () => {
    expect(isCodeNameArray(await client.village.search("a"))).toBeTruthy();
  });

  it("[CACHE] Villages search", async () => {
    expect(isCodeNameArray(await client.village.search("a"))).toBeTruthy();
  });

  it("Search", async () => {
    expect(isSearchResult(await client.search("a"))).toBeTruthy();
  });

  it("[CACHE] Search", async () => {
    expect(isSearchResult(await client.search("a"))).toBeTruthy();
  });
});

describe("Regions of Indonesia client Dynamic API as Static", () => {
  const client = new RegionsOfIndonesiaClient({
    baseURL: getBaseURL(),
    middlewares: [
      log({
        key: true,
        url: true,
      }),
      cache({}),
    ],
    static: false,
  });

  it("[As Static] Provinces", async () => {
    expect(isCodeNameArray(await client.province.find({ static: true }))).toBeTruthy();
  });

  it("[As Static] [CACHE] Provinces", async () => {
    expect(isCodeNameArray(await client.province.find({ static: true }))).toBeTruthy();
  });

  it("[As Static] Province by code", async () => {
    expect(isCodeName(await client.province.findByCode("11", { static: true }))).toBeTruthy();
  });

  it("[As Static] [CACHE] Province by code", async () => {
    expect(isCodeName(await client.province.findByCode("11", { static: true }))).toBeTruthy();
  });

  it("[As Static] Provinces search", async () => {
    expect(isCodeNameArray(await client.province.search("a", { static: true }))).toBeTruthy();
  });

  it("[As Static] [CACHE] Provinces search", async () => {
    expect(isCodeNameArray(await client.province.search("a", { static: true }))).toBeTruthy();
  });

  it("[As Static] Districts by province code", async () => {
    expect(isCodeNameArray(await client.district.findByProvinceCode("11", { static: true }))).toBeTruthy();
  });

  it("[As Static] [CACHE] Districts by province code", async () => {
    expect(isCodeNameArray(await client.district.findByProvinceCode("11", { static: true }))).toBeTruthy();
  });

  it("[As Static] District by code", async () => {
    expect(isCodeName(await client.district.findByCode("11.01", { static: true }))).toBeTruthy();
  });

  it("[As Static] [CACHE] District by code", async () => {
    expect(isCodeName(await client.district.findByCode("11.01", { static: true }))).toBeTruthy();
  });

  it("[As Static] Districts search", async () => {
    expect(isCodeNameArray(await client.district.search("a", { static: true }))).toBeTruthy();
  });

  it("[As Static] [CACHE] Districts search", async () => {
    expect(isCodeNameArray(await client.district.search("a", { static: true }))).toBeTruthy();
  });

  it("[As Static] Subdistricts by district code", async () => {
    expect(isCodeNameArray(await client.subdistrict.findByDistrictCode("11.01", { static: true }))).toBeTruthy();
  });

  it("[As Static] [CACHE] Subdistricts by district code", async () => {
    expect(isCodeNameArray(await client.subdistrict.findByDistrictCode("11.01", { static: true }))).toBeTruthy();
  });

  it("[As Static] Subdistrict by code", async () => {
    expect(isCodeName(await client.subdistrict.findByCode("11.01.01", { static: true }))).toBeTruthy();
  });

  it("[As Static] [CACHE] Subdistrict by code", async () => {
    expect(isCodeName(await client.subdistrict.findByCode("11.01.01", { static: true }))).toBeTruthy();
  });

  it("[As Static] Subdistricts search", async () => {
    expect(isCodeNameArray(await client.subdistrict.search("a", { static: true }))).toBeTruthy();
  });

  it("[As Static] [CACHE] Subdistricts search", async () => {
    expect(isCodeNameArray(await client.subdistrict.search("a", { static: true }))).toBeTruthy();
  });

  it("[As Static] Villages by subdistrict code", async () => {
    expect(isCodeNameArray(await client.village.findBySubdistrictCode("11.01.01", { static: true }))).toBeTruthy();
  });

  it("[As Static] [CACHE] Villages by subdistrict code", async () => {
    expect(isCodeNameArray(await client.village.findBySubdistrictCode("11.01.01", { static: true }))).toBeTruthy();
  });

  it("[As Static] Village by code", async () => {
    expect(isCodeName(await client.village.findByCode("11.01.01.2001", { static: true }))).toBeTruthy();
  });

  it("[As Static] [CACHE] Village by code", async () => {
    expect(isCodeName(await client.village.findByCode("11.01.01.2001", { static: true }))).toBeTruthy();
  });

  it("[As Static] Villages search", async () => {
    expect(isCodeNameArray(await client.village.search("a", { static: true }))).toBeTruthy();
  });

  it("[As Static] [CACHE] Villages search", async () => {
    expect(isCodeNameArray(await client.village.search("a", { static: true }))).toBeTruthy();
  });

  it("[As Static] Search", async () => {
    expect(isSearchResult(await client.search("a", { static: true }))).toBeTruthy();
  });

  it("[As Static] [CACHE] Search", async () => {
    expect(isSearchResult(await client.search("a", { static: true }))).toBeTruthy();
  });
});

describe("Regions of Indonesia client Dynamic API with Abortion", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });
  afterEach(() => {
    vi.restoreAllMocks();
  });

  const client = new RegionsOfIndonesiaClient({
    baseURL: getBaseURL(),
    middlewares: [
      log({
        key: true,
        url: true,
      }),
      cache({}),
    ],
    static: false,
  });

  it("[Abortion] Provinces", async () => {
    await expect(withAbortionIn((signal) => client.province.find({ signal }))).rejects.toThrow();
  });

  it("[Abortion] Province by code", async () => {
    await expect(withAbortionIn((signal) => client.province.findByCode("11", { signal }))).rejects.toThrow();
  });

  it("[Abortion] Provinces search", async () => {
    await expect(withAbortionIn((signal) => client.province.search("a", { signal }))).rejects.toThrow();
  });

  it("[Abortion] Districts by province code", async () => {
    await expect(withAbortionIn((signal) => client.district.findByProvinceCode("11", { signal }))).rejects.toThrow();
  });

  it("[Abortion] District by code", async () => {
    await expect(withAbortionIn((signal) => client.district.findByCode("11.01", { signal }))).rejects.toThrow();
  });

  it("[Abortion] Districts search", async () => {
    await expect(withAbortionIn((signal) => client.district.search("a", { signal }))).rejects.toThrow();
  });

  it("[Abortion] Subdistricts by district code", async () => {
    await expect(withAbortionIn((signal) => client.subdistrict.findByDistrictCode("11.01", { signal }))).rejects.toThrow();
  });

  it("[Abortion] Subdistrict by code", async () => {
    await expect(withAbortionIn((signal) => client.subdistrict.findByCode("11.01.01", { signal }))).rejects.toThrow();
  });

  it("[Abortion] Subdistricts search", async () => {
    await expect(withAbortionIn((signal) => client.subdistrict.search("a", { signal }))).rejects.toThrow();
  });

  it("[Abortion] Villages by subdistrict code", async () => {
    await expect(withAbortionIn((signal) => client.village.findBySubdistrictCode("11.01.01", { signal }))).rejects.toThrow();
  });

  it("[Abortion] Village by code", async () => {
    await expect(withAbortionIn((signal) => client.village.findByCode("11.01.01.2001", { signal }))).rejects.toThrow();
  });

  it("[Abortion] Villages search", async () => {
    await expect(withAbortionIn((signal) => client.village.search("a", { signal }))).rejects.toThrow();
  });

  it("[Abortion] Search", async () => {
    await expect(withAbortionIn((signal) => client.search("a", { signal }))).rejects.toThrow();
  });
});

describe("Regions of Indonesia client Static API", () => {
  const client = new RegionsOfIndonesiaClient({
    baseURL: getBaseURL(),
    middlewares: [
      log({
        key: true,
        url: true,
      }),
      cache({}),
    ],
    static: true,
  });

  it("Provinces", async () => {
    expect(isCodeNameArray(await client.province.find())).toBeTruthy();
  });

  it("[CACHE] Provinces", async () => {
    expect(isCodeNameArray(await client.province.find())).toBeTruthy();
  });

  it("Province by code", async () => {
    expect(isCodeName(await client.province.findByCode("11"))).toBeTruthy();
  });

  it("[CACHE] Province by code", async () => {
    expect(isCodeName(await client.province.findByCode("11"))).toBeTruthy();
  });

  it("Provinces search", async () => {
    expect(isCodeNameArray(await client.province.search("a"))).toBeTruthy();
  });

  it("[CACHE] Provinces search", async () => {
    expect(isCodeNameArray(await client.province.search("a"))).toBeTruthy();
  });

  it("Districts by province code", async () => {
    expect(isCodeNameArray(await client.district.findByProvinceCode("11"))).toBeTruthy();
  });

  it("[CACHE] Districts by province code", async () => {
    expect(isCodeNameArray(await client.district.findByProvinceCode("11"))).toBeTruthy();
  });

  it("District by code", async () => {
    expect(isCodeName(await client.district.findByCode("11.01"))).toBeTruthy();
  });

  it("[CACHE] District by code", async () => {
    expect(isCodeName(await client.district.findByCode("11.01"))).toBeTruthy();
  });

  it("Districts search", async () => {
    expect(isCodeNameArray(await client.district.search("a"))).toBeTruthy();
  });

  it("[CACHE] Districts search", async () => {
    expect(isCodeNameArray(await client.district.search("a"))).toBeTruthy();
  });

  it("Subdistricts by district code", async () => {
    expect(isCodeNameArray(await client.subdistrict.findByDistrictCode("11.01"))).toBeTruthy();
  });

  it("[CACHE] Subdistricts by district code", async () => {
    expect(isCodeNameArray(await client.subdistrict.findByDistrictCode("11.01"))).toBeTruthy();
  });

  it("Subdistrict by code", async () => {
    expect(isCodeName(await client.subdistrict.findByCode("11.01.01"))).toBeTruthy();
  });

  it("[CACHE] Subdistrict by code", async () => {
    expect(isCodeName(await client.subdistrict.findByCode("11.01.01"))).toBeTruthy();
  });

  it("Subdistricts search", async () => {
    expect(isCodeNameArray(await client.subdistrict.search("a"))).toBeTruthy();
  });

  it("[CACHE] Subdistricts search", async () => {
    expect(isCodeNameArray(await client.subdistrict.search("a"))).toBeTruthy();
  });

  it("Villages by subdistrict code", async () => {
    expect(isCodeNameArray(await client.village.findBySubdistrictCode("11.01.01"))).toBeTruthy();
  });

  it("[CACHE] Villages by subdistrict code", async () => {
    expect(isCodeNameArray(await client.village.findBySubdistrictCode("11.01.01"))).toBeTruthy();
  });

  it("Village by code", async () => {
    expect(isCodeName(await client.village.findByCode("11.01.01.2001"))).toBeTruthy();
  });

  it("[CACHE] Village by code", async () => {
    expect(isCodeName(await client.village.findByCode("11.01.01.2001"))).toBeTruthy();
  });

  it("Villages search", async () => {
    expect(isCodeNameArray(await client.village.search("a"))).toBeTruthy();
  });

  it("[CACHE] Villages search", async () => {
    expect(isCodeNameArray(await client.village.search("a"))).toBeTruthy();
  });

  it("Search", async () => {
    expect(isSearchResult(await client.search("a"))).toBeTruthy();
  });

  it("[CACHE] Search", async () => {
    expect(isSearchResult(await client.search("a"))).toBeTruthy();
  });
});

describe("Regions of Indonesia client Static API as Dynamic", () => {
  const client = new RegionsOfIndonesiaClient({
    baseURL: getBaseURL(),
    middlewares: [
      log({
        key: true,
        url: true,
      }),
      cache({}),
    ],
    static: true,
  });

  it("[As Dynamic] Provinces", async () => {
    expect(isCodeNameArray(await client.province.find({ static: false }))).toBeTruthy();
  });

  it("[As Dynamic] [CACHE] Provinces", async () => {
    expect(isCodeNameArray(await client.province.find({ static: false }))).toBeTruthy();
  });

  it("[As Dynamic] Province by code", async () => {
    expect(isCodeName(await client.province.findByCode("11", { static: false }))).toBeTruthy();
  });

  it("[As Dynamic] [CACHE] Province by code", async () => {
    expect(isCodeName(await client.province.findByCode("11", { static: false }))).toBeTruthy();
  });

  it("[As Dynamic] Provinces search", async () => {
    expect(isCodeNameArray(await client.province.search("a", { static: false }))).toBeTruthy();
  });

  it("[As Dynamic] [CACHE] Provinces search", async () => {
    expect(isCodeNameArray(await client.province.search("a", { static: false }))).toBeTruthy();
  });

  it("[As Dynamic] Districts by province code", async () => {
    expect(isCodeNameArray(await client.district.findByProvinceCode("11", { static: false }))).toBeTruthy();
  });

  it("[As Dynamic] [CACHE] Districts by province code", async () => {
    expect(isCodeNameArray(await client.district.findByProvinceCode("11", { static: false }))).toBeTruthy();
  });

  it("[As Dynamic] District by code", async () => {
    expect(isCodeName(await client.district.findByCode("11.01", { static: false }))).toBeTruthy();
  });

  it("[As Dynamic] [CACHE] District by code", async () => {
    expect(isCodeName(await client.district.findByCode("11.01", { static: false }))).toBeTruthy();
  });

  it("[As Dynamic] Districts search", async () => {
    expect(isCodeNameArray(await client.district.search("a", { static: false }))).toBeTruthy();
  });

  it("[As Dynamic] [CACHE] Districts search", async () => {
    expect(isCodeNameArray(await client.district.search("a", { static: false }))).toBeTruthy();
  });

  it("[As Dynamic] Subdistricts by district code", async () => {
    expect(isCodeNameArray(await client.subdistrict.findByDistrictCode("11.01", { static: false }))).toBeTruthy();
  });

  it("[As Dynamic] [CACHE] Subdistricts by district code", async () => {
    expect(isCodeNameArray(await client.subdistrict.findByDistrictCode("11.01", { static: false }))).toBeTruthy();
  });

  it("[As Dynamic] Subdistrict by code", async () => {
    expect(isCodeName(await client.subdistrict.findByCode("11.01.01", { static: false }))).toBeTruthy();
  });

  it("[As Dynamic] [CACHE] Subdistrict by code", async () => {
    expect(isCodeName(await client.subdistrict.findByCode("11.01.01", { static: false }))).toBeTruthy();
  });

  it("[As Dynamic] Subdistricts search", async () => {
    expect(isCodeNameArray(await client.subdistrict.search("a", { static: false }))).toBeTruthy();
  });

  it("[As Dynamic] [CACHE] Subdistricts search", async () => {
    expect(isCodeNameArray(await client.subdistrict.search("a", { static: false }))).toBeTruthy();
  });

  it("[As Dynamic] Villages by subdistrict code", async () => {
    expect(isCodeNameArray(await client.village.findBySubdistrictCode("11.01.01", { static: false }))).toBeTruthy();
  });

  it("[As Dynamic] [CACHE] Villages by subdistrict code", async () => {
    expect(isCodeNameArray(await client.village.findBySubdistrictCode("11.01.01", { static: false }))).toBeTruthy();
  });

  it("[As Dynamic] Village by code", async () => {
    expect(isCodeName(await client.village.findByCode("11.01.01.2001", { static: false }))).toBeTruthy();
  });

  it("[As Dynamic] [CACHE] Village by code", async () => {
    expect(isCodeName(await client.village.findByCode("11.01.01.2001", { static: false }))).toBeTruthy();
  });

  it("[As Dynamic] Villages search", async () => {
    expect(isCodeNameArray(await client.village.search("a", { static: false }))).toBeTruthy();
  });

  it("[As Dynamic] [CACHE] Villages search", async () => {
    expect(isCodeNameArray(await client.village.search("a", { static: false }))).toBeTruthy();
  });

  it("[As Dynamic] Search", async () => {
    expect(isSearchResult(await client.search("a", { static: false }))).toBeTruthy();
  });

  it("[As Dynamic] [CACHE] Search", async () => {
    expect(isSearchResult(await client.search("a", { static: false }))).toBeTruthy();
  });
});

describe("Regions of Indonesia client Static API with Abortion", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });
  afterEach(() => {
    vi.restoreAllMocks();
  });

  const client = new RegionsOfIndonesiaClient({
    baseURL: getBaseURL(),
    middlewares: [
      log({
        key: true,
        url: true,
      }),
      cache({}),
    ],
    static: true,
  });

  it("Provinces", async () => {
    await expect(withAbortionIn((signal) => client.province.find({ signal }))).rejects.toThrow();
  });

  it("[CACHE] Provinces", async () => {
    await expect(withAbortionIn((signal) => client.province.find({ signal }))).rejects.toThrow();
  });

  it("Province by code", async () => {
    await expect(withAbortionIn((signal) => client.province.findByCode("11", { signal }))).rejects.toThrow();
  });

  it("[CACHE] Province by code", async () => {
    await expect(withAbortionIn((signal) => client.province.findByCode("11", { signal }))).rejects.toThrow();
  });

  it("Districts by province code", async () => {
    await expect(withAbortionIn((signal) => client.district.findByProvinceCode("11", { signal }))).rejects.toThrow();
  });

  it("[CACHE] Districts by province code", async () => {
    await expect(withAbortionIn((signal) => client.district.findByProvinceCode("11", { signal }))).rejects.toThrow();
  });

  it("District by code", async () => {
    await expect(withAbortionIn((signal) => client.district.findByCode("11.01", { signal }))).rejects.toThrow();
  });

  it("[CACHE] District by code", async () => {
    await expect(withAbortionIn((signal) => client.district.findByCode("11.01", { signal }))).rejects.toThrow();
  });

  it("Subdistricts by district code", async () => {
    await expect(withAbortionIn((signal) => client.subdistrict.findByDistrictCode("11.01", { signal }))).rejects.toThrow();
  });

  it("[CACHE] Subdistricts by district code", async () => {
    await expect(withAbortionIn((signal) => client.subdistrict.findByDistrictCode("11.01", { signal }))).rejects.toThrow();
  });

  it("Subdistrict by code", async () => {
    await expect(withAbortionIn((signal) => client.subdistrict.findByCode("11.01.01", { signal }))).rejects.toThrow();
  });

  it("[CACHE] Subdistrict by code", async () => {
    await expect(withAbortionIn((signal) => client.subdistrict.findByCode("11.01.01", { signal }))).rejects.toThrow();
  });

  it("Villages by subdistrict code", async () => {
    await expect(withAbortionIn((signal) => client.village.findBySubdistrictCode("11.01.01", { signal }))).rejects.toThrow();
  });

  it("[CACHE] Villages by subdistrict code", async () => {
    await expect(withAbortionIn((signal) => client.village.findBySubdistrictCode("11.01.01", { signal }))).rejects.toThrow();
  });

  it("Village by code", async () => {
    await expect(withAbortionIn((signal) => client.village.findByCode("11.01.01.2001", { signal }))).rejects.toThrow();
  });

  it("[CACHE] Village by code", async () => {
    await expect(withAbortionIn((signal) => client.village.findByCode("11.01.01.2001", { signal }))).rejects.toThrow();
  });
});
