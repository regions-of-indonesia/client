import { describe, expect, it } from "vitest";

import { RegionsOfIndonesiaClient } from "./RegionsOfIndonesiaClient";
import { log, cache } from "./middlewares";
import type { CodeName } from "./types";

function isCodeName(value: unknown): value is CodeName {
  if (typeof value === "object" && value.hasOwnProperty("code") && value.hasOwnProperty("name")) {
    const { code, name } = value as any;
    return typeof code === "string" && typeof name === "string";
  }

  return false;
}

function isCodeNameArray(value: unknown[]): value is CodeName[] {
  return value.every(isCodeName);
}

function isSearchResult(value: unknown): value is Record<string, CodeName[]> {
  if (
    typeof value === "object" &&
    value.hasOwnProperty("provinces") &&
    value.hasOwnProperty("districts") &&
    value.hasOwnProperty("subdistricts") &&
    value.hasOwnProperty("villages")
  ) {
    const { provinces, districts, subdistricts, villages } = value as any;

    return [provinces, districts, subdistricts, villages].every(isCodeNameArray);
  }

  return false;
}

describe("Regions of Indonesia client Dynamic API", () => {
  const client = new RegionsOfIndonesiaClient({
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

describe("Regions of Indonesia client Static API", () => {
  const client = new RegionsOfIndonesiaClient({
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
