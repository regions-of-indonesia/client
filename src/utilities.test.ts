import { describe, expect, it } from "vitest";

import type { CodeName } from "./types";
import { code, sort } from "./utilities";

describe("Code", () => {
  it("Code Split", async () => {
    const splitted = code.split("11.01.01.2001");
    const splittedUndefined = code.split();

    expect(splitted).toBeInstanceOf(Array);
    expect(splitted).toEqual(["11", "01", "01", "2001"]);
    expect(splittedUndefined).toBeUndefined();
  });

  it("Code Join", async () => {
    const joined = code.join("11", "01", "01", "2001");
    const joinedEmpty = code.join();

    expect(joined).toBeTypeOf("string");
    expect(joined).toEqual("11.01.01.2001");
    expect(joinedEmpty).toEqual("");
  });

  it("Code parse", async () => {
    const result = code.parse("11.01.01.2001");
    const resultUndefined = code.parse();

    expect(result).toBeTypeOf("object");
    expect(result).haveOwnProperty("province");
    expect(result.province).toBeTypeOf("string");
    expect(result).haveOwnProperty("district");
    expect(result.district).toBeTypeOf("string");
    expect(result).haveOwnProperty("subdistrict");
    expect(result.subdistrict).toBeTypeOf("string");
    expect(result).haveOwnProperty("village");
    expect(result.village).toBeTypeOf("string");
    expect(resultUndefined).toBeUndefined();
  });
});

describe("Sort", () => {
  const data: CodeName[] = [
    {
      code: "1.2",
      name: "AAA",
    },
    {
      code: "1.1",
      name: "AAZ",
    },
    {
      code: "3.6",
      name: "AAK",
    },
  ];

  it("By code", async () => {
    const sortedDataByCode = sort(data).byCode();

    expect(sortedDataByCode).toBeInstanceOf(Array);
    expect(sortedDataByCode[0].code).toEqual("1.1");
    expect(sortedDataByCode[sortedDataByCode.length - 1].code).toEqual("3.6");
  });

  it("By name", async () => {
    const sortedDataByName = sort(data).byName();

    expect(sortedDataByName).toBeInstanceOf(Array);
    expect(sortedDataByName[0].name).toEqual("AAA");
    expect(sortedDataByName[sortedDataByName.length - 1].name).toEqual("AAZ");
  });
});
