import { describe, it } from "vitest";

import { create, cache } from "../src";

import { expectCodeName, expectCodeNameArray, expectRegionResult, expectSearchResult, expectCancelation } from "./@shared";

const __DEV__ = true;
const getBaseURL = () => (__DEV__ ? { dynamic: "http://127.1.0.0:8000", static: "http://127.1.0.0:8001" } : {});

describe("Dynamic API", () => {
  const client = create({
    baseURL: getBaseURL(),
    middlewares: [cache()],
    static: false,
  });

  it("Provinces", async () => {
    expectCodeNameArray(await client.province.find());
  });

  it("[CACHE] Provinces", async () => {
    expectCodeNameArray(await client.province.find());
  });

  it("Province by code", async () => {
    expectCodeName(await client.province.find.by("11"));
  });

  it("[CACHE] Province by code", async () => {
    expectCodeName(await client.province.find.by("11"));
  });

  it("Districts by province code", async () => {
    expectCodeNameArray(await client.district.find("11"));
  });

  it("[CACHE] Districts by province code", async () => {
    expectCodeNameArray(await client.district.find("11"));
  });

  it("District by code", async () => {
    expectCodeName(await client.district.find.by("11.01"));
  });

  it("[CACHE] District by code", async () => {
    expectCodeName(await client.district.find.by("11.01"));
  });

  it("Subdistricts by district code", async () => {
    expectCodeNameArray(await client.subdistrict.find("11.01"));
  });

  it("[CACHE] Subdistricts by district code", async () => {
    expectCodeNameArray(await client.subdistrict.find("11.01"));
  });

  it("Subdistrict by code", async () => {
    expectCodeName(await client.subdistrict.find.by("11.01.01"));
  });

  it("[CACHE] Subdistrict by code", async () => {
    expectCodeName(await client.subdistrict.find.by("11.01.01"));
  });

  it("Villages by subdistrict code", async () => {
    expectCodeNameArray(await client.village.find("11.01.01"));
  });

  it("[CACHE] Villages by subdistrict code", async () => {
    expectCodeNameArray(await client.village.find("11.01.01"));
  });

  it("Village by code", async () => {
    expectCodeName(await client.village.find.by("11.01.01.2001"));
  });

  it("[CACHE] Village by code", async () => {
    expectCodeName(await client.village.find.by("11.01.01.2001"));
  });

  it("Region", async () => {
    expectRegionResult(await client.region("11"));
  });

  it("[CACHE] Region", async () => {
    expectRegionResult(await client.region("11"));
  });

  it("Search", async () => {
    expectSearchResult(await client.search("a"));
  });

  it("[CACHE] Search", async () => {
    expectSearchResult(await client.search("a"));
  });

  it("Provinces search", async () => {
    expectCodeNameArray(await client.province.search("a"));
    expectCodeNameArray(await client.search.provinces("a"));
  });

  it("[CACHE] Provinces search", async () => {
    expectCodeNameArray(await client.province.search("a"));
    expectCodeNameArray(await client.search.provinces("a"));
  });

  it("Districts search", async () => {
    expectCodeNameArray(await client.district.search("a"));
    expectCodeNameArray(await client.search.districts("a"));
  });

  it("[CACHE] Districts search", async () => {
    expectCodeNameArray(await client.district.search("a"));
    expectCodeNameArray(await client.search.districts("a"));
  });

  it("Subdistricts search", async () => {
    expectCodeNameArray(await client.subdistrict.search("a"));
    expectCodeNameArray(await client.search.subdistricts("a"));
  });

  it("[CACHE] Subdistricts search", async () => {
    expectCodeNameArray(await client.subdistrict.search("a"));
    expectCodeNameArray(await client.search.subdistricts("a"));
  });

  it("Villages search", async () => {
    expectCodeNameArray(await client.village.search("a"));
    expectCodeNameArray(await client.search.villages("a"));
  });

  it("[CACHE] Villages search", async () => {
    expectCodeNameArray(await client.village.search("a"));
    expectCodeNameArray(await client.search.villages("a"));
  });
});

describe("Dynamic API with Cancelation", () => {
  const client = create({
    baseURL: getBaseURL(),
    middlewares: [cache()],
    static: false,
  });

  it("[CANCELATION] Provinces", async () => {
    await expectCancelation((signal) => client.province.find({ signal }));
  });

  it("[CANCELATION] Province by code", async () => {
    await expectCancelation((signal) => client.province.find.by("11", { signal }));
  });

  it("[CANCELATION] Districts by province code", async () => {
    await expectCancelation((signal) => client.district.find("11", { signal }));
  });

  it("[CANCELATION] District by code", async () => {
    await expectCancelation((signal) => client.district.find.by("11.01", { signal }));
  });

  it("[CANCELATION] Subdistricts by district code", async () => {
    await expectCancelation((signal) => client.subdistrict.find("11.01", { signal }));
  });

  it("[CANCELATION] Subdistrict by code", async () => {
    await expectCancelation((signal) => client.subdistrict.find.by("11.01.01", { signal }));
  });

  it("[CANCELATION] Villages by subdistrict code", async () => {
    await expectCancelation((signal) => client.village.find("11.01.01", { signal }));
  });

  it("[CANCELATION] Village by code", async () => {
    await expectCancelation((signal) => client.village.find.by("11.01.01.2001", { signal }));
  });

  it("[CANCELATION] Region", async () => {
    await expectCancelation((signal) => client.region("11", { signal }));
  });

  it("[CANCELATION] Search", async () => {
    await expectCancelation((signal) => client.search("a", { signal }));
  });

  it("[CANCELATION] Provinces search", async () => {
    await expectCancelation((signal) => client.province.search("a", { signal }));
    await expectCancelation((signal) => client.search.provinces("a", { signal }));
  });

  it("[CANCELATION] Districts search", async () => {
    await expectCancelation((signal) => client.district.search("a", { signal }));
    await expectCancelation((signal) => client.search.districts("a", { signal }));
  });

  it("[CANCELATION] Subdistricts search", async () => {
    await expectCancelation((signal) => client.subdistrict.search("a", { signal }));
    await expectCancelation((signal) => client.search.subdistricts("a", { signal }));
  });

  it("[CANCELATION] Villages search", async () => {
    await expectCancelation((signal) => client.village.search("a", { signal }));
    await expectCancelation((signal) => client.search.villages("a", { signal }));
  });
});

describe("Static API", () => {
  const client = create({
    baseURL: getBaseURL(),
    middlewares: [cache()],
    static: true,
  });

  it("Provinces", async () => {
    expectCodeNameArray(await client.province.find());
  });

  it("[CACHE] Provinces", async () => {
    expectCodeNameArray(await client.province.find());
  });

  it("Province by code", async () => {
    expectCodeName(await client.province.find.by("11"));
  });

  it("[CACHE] Province by code", async () => {
    expectCodeName(await client.province.find.by("11"));
  });

  it("Districts by province code", async () => {
    expectCodeNameArray(await client.district.find("11"));
  });

  it("[CACHE] Districts by province code", async () => {
    expectCodeNameArray(await client.district.find("11"));
  });

  it("District by code", async () => {
    expectCodeName(await client.district.find.by("11.01"));
  });

  it("[CACHE] District by code", async () => {
    expectCodeName(await client.district.find.by("11.01"));
  });

  it("Subdistricts by district code", async () => {
    expectCodeNameArray(await client.subdistrict.find("11.01"));
  });

  it("[CACHE] Subdistricts by district code", async () => {
    expectCodeNameArray(await client.subdistrict.find("11.01"));
  });

  it("Subdistrict by code", async () => {
    expectCodeName(await client.subdistrict.find.by("11.01.01"));
  });

  it("[CACHE] Subdistrict by code", async () => {
    expectCodeName(await client.subdistrict.find.by("11.01.01"));
  });

  it("Villages by subdistrict code", async () => {
    expectCodeNameArray(await client.village.find("11.01.01"));
  });

  it("[CACHE] Villages by subdistrict code", async () => {
    expectCodeNameArray(await client.village.find("11.01.01"));
  });

  it("Village by code", async () => {
    expectCodeName(await client.village.find.by("11.01.01.2001"));
  });

  it("[CACHE] Village by code", async () => {
    expectCodeName(await client.village.find.by("11.01.01.2001"));
  });

  it("Region", async () => {
    expectRegionResult(await client.region("a"));
  });

  it("[CACHE] Region", async () => {
    expectRegionResult(await client.region("11"));
  });

  it("Search", async () => {
    expectSearchResult(await client.search("a"));
  });

  it("[CACHE] Search", async () => {
    expectSearchResult(await client.search("a"));
  });

  it("Provinces search", async () => {
    expectCodeNameArray(await client.province.search("a"));
    expectCodeNameArray(await client.search.provinces("a"));
  });

  it("[CACHE] Provinces search", async () => {
    expectCodeNameArray(await client.province.search("a"));
    expectCodeNameArray(await client.search.provinces("a"));
  });

  it("Districts search", async () => {
    expectCodeNameArray(await client.district.search("a"));
    expectCodeNameArray(await client.search.districts("a"));
  });

  it("[CACHE] Districts search", async () => {
    expectCodeNameArray(await client.district.search("a"));
    expectCodeNameArray(await client.search.districts("a"));
  });

  it("Subdistricts search", async () => {
    expectCodeNameArray(await client.subdistrict.search("a"));
    expectCodeNameArray(await client.search.subdistricts("a"));
  });

  it("[CACHE] Subdistricts search", async () => {
    expectCodeNameArray(await client.subdistrict.search("a"));
    expectCodeNameArray(await client.search.subdistricts("a"));
  });

  it("Villages search", async () => {
    expectCodeNameArray(await client.village.search("a"));
    expectCodeNameArray(await client.search.villages("a"));
  });

  it("[CACHE] Villages search", async () => {
    expectCodeNameArray(await client.village.search("a"));
    expectCodeNameArray(await client.search.villages("a"));
  });
});

describe("Static API with Cancelation", () => {
  const client = create({
    baseURL: getBaseURL(),
    middlewares: [cache()],
    static: true,
  });

  it("[CANCELATION] Provinces", async () => {
    await expectCancelation((signal) => client.province.find({ signal }));
  });

  it("[CANCELATION] Province by code", async () => {
    await expectCancelation((signal) => client.province.find.by("11", { signal }));
  });

  it("[CANCELATION] Districts by province code", async () => {
    await expectCancelation((signal) => client.district.find("11", { signal }));
  });

  it("[CANCELATION] District by code", async () => {
    await expectCancelation((signal) => client.district.find.by("11.01", { signal }));
  });

  it("[CANCELATION] Subdistricts by district code", async () => {
    await expectCancelation((signal) => client.subdistrict.find("11.01", { signal }));
  });

  it("[CANCELATION] Subdistrict by code", async () => {
    await expectCancelation((signal) => client.subdistrict.find.by("11.01.01", { signal }));
  });

  it("[CANCELATION] Villages by subdistrict code", async () => {
    await expectCancelation((signal) => client.village.find("11.01.01", { signal }));
  });

  it("[CANCELATION] Village by code", async () => {
    await expectCancelation((signal) => client.village.find.by("11.01.01.2001", { signal }));
  });
});
