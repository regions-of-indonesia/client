import { describe, expect, it } from "vitest";

import RegionsOfIndonesiaClient from "./RegionsOfIndonesiaClient";

describe("Regions of Indonesia client API", () => {
  const client = new RegionsOfIndonesiaClient({});

  it("Provinces", async () => {
    const data = await client.province.find();

    expect(data).toBeInstanceOf(Array);
  });

  it("Province by code", async () => {
    const data = await client.province.findByCode("11");

    expect(data).toBeTypeOf("object");
  });

  it("Provinces search", async () => {
    const data = await client.province.search("a");

    expect(data).toBeInstanceOf(Array);
  });

  it("Districts by province code", async () => {
    const data = await client.district.findByProvinceCode("11");

    expect(data).toBeInstanceOf(Array);
  });

  it("District by code", async () => {
    const data = await client.district.findByCode("11.01");

    expect(data).toBeTypeOf("object");
  });

  it("Districts search", async () => {
    const data = await client.district.search("a");

    expect(data).toBeInstanceOf(Array);
  });

  it("Subdistricts by district code", async () => {
    const data = await client.subdistrict.findByDistrictCode("11.01");

    expect(data).toBeInstanceOf(Array);
  });

  it("Subdistrict by code", async () => {
    const data = await client.subdistrict.findByCode("11.01.01");

    expect(data).toBeTypeOf("object");
  });

  it("Subdistricts search", async () => {
    const data = await client.subdistrict.search("a");

    expect(data).toBeInstanceOf(Array);
  });

  it("Villages by subdistrict code", async () => {
    const data = await client.village.findBySubdistrictCode("11.01.01");

    expect(data).toBeInstanceOf(Array);
  });

  it("Village by code", async () => {
    const data = await client.village.findByCode("11.01.01.2001");

    expect(data).toBeTypeOf("object");
  });

  it("Villages search", async () => {
    const data = await client.village.search("a");

    expect(data).toBeInstanceOf(Array);
  });

  it("Search", async () => {
    const data = await client.search("a");

    expect(data).toBeTypeOf("object");
    expect(data).haveOwnProperty("provinces");
    expect(data.provinces).toBeInstanceOf(Array);
    expect(data).haveOwnProperty("districts");
    expect(data.districts).toBeInstanceOf(Array);
    expect(data).haveOwnProperty("subdistricts");
    expect(data.subdistricts).toBeInstanceOf(Array);
    expect(data).haveOwnProperty("villages");
    expect(data.villages).toBeInstanceOf(Array);
  });
});

describe("Regions of Indonesia client static API", () => {
  const client = new RegionsOfIndonesiaClient({ static: true });

  it("Provinces", async () => {
    const data = await client.province.find();

    expect(data).toBeInstanceOf(Array);
  });

  it("Province by code", async () => {
    const data = await client.province.findByCode("11");

    expect(data).toBeTypeOf("object");
  });

  it("Provinces search", async () => {
    const data = await client.province.search("a");

    expect(data).toBeInstanceOf(Array);
  });

  it("Districts by province code", async () => {
    const data = await client.district.findByProvinceCode("11");

    expect(data).toBeInstanceOf(Array);
  });

  it("District by code", async () => {
    const data = await client.district.findByCode("11.01");

    expect(data).toBeTypeOf("object");
  });

  it("Districts search", async () => {
    const data = await client.district.search("a");

    expect(data).toBeInstanceOf(Array);
  });

  it("Subdistricts by district code", async () => {
    const data = await client.subdistrict.findByDistrictCode("11.01");

    expect(data).toBeInstanceOf(Array);
  });

  it("Subdistrict by code", async () => {
    const data = await client.subdistrict.findByCode("11.01.01");

    expect(data).toBeTypeOf("object");
  });

  it("Subdistricts search", async () => {
    const data = await client.subdistrict.search("a");

    expect(data).toBeInstanceOf(Array);
  });

  it("Villages by subdistrict code", async () => {
    const data = await client.village.findBySubdistrictCode("11.01.01");

    expect(data).toBeInstanceOf(Array);
  });

  it("Village by code", async () => {
    const data = await client.village.findByCode("11.01.01.2001");

    expect(data).toBeTypeOf("object");
  });

  it("Villages search", async () => {
    const data = await client.village.search("a");

    expect(data).toBeInstanceOf(Array);
  });

  it("Search", async () => {
    const data = await client.search("a");

    expect(data).toBeTypeOf("object");
    expect(data).haveOwnProperty("provinces");
    expect(data.provinces).toBeInstanceOf(Array);
    expect(data).haveOwnProperty("districts");
    expect(data.districts).toBeInstanceOf(Array);
    expect(data).haveOwnProperty("subdistricts");
    expect(data.subdistricts).toBeInstanceOf(Array);
    expect(data).haveOwnProperty("villages");
    expect(data.villages).toBeInstanceOf(Array);
  });
});
