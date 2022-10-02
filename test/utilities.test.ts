import { describe, expect, it } from "vitest";

import { hasOwnProperties, isStringArray, isTypeofObject, isTypeofString } from "javascript-yesterday";

import { isCodeNameArray } from "./@shared";

import type { CodeName } from "../src";
import { code, sort } from "../src";

describe("Code", () => {
  it("Code Split", async () => {
    const splitted = code.split("11.01.01.2001");
    expect(isStringArray(splitted)).toBeTruthy();
    expect(splitted).toEqual(["11", "01", "01", "2001"]);

    const splittedUndefined = code.split();
    expect(splittedUndefined).toBeUndefined();
  });

  it("Code Join", async () => {
    const joined = code.join("11", "01", "01", "2001");
    expect(isTypeofString(joined)).toBeTruthy();
    expect(joined).toEqual("11.01.01.2001");

    const joinedEmpty = code.join();
    expect(joinedEmpty).toEqual("");
  });

  it("Code parse", async () => {
    const result = code.parse("11.01.01.2001");
    expect(isTypeofObject(result) && hasOwnProperties(result, "province", "district", "subdistrict", "village")).toBeTruthy();
    expect((result as any).province).toBeTypeOf("string");
    expect((result as any).district).toBeTypeOf("string");
    expect((result as any).subdistrict).toBeTypeOf("string");
    expect((result as any).village).toBeTypeOf("string");

    const resultUndefined = code.parse();
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

    expect(isCodeNameArray(sortedDataByCode)).toBeTruthy();
    expect(sortedDataByCode[0].code).toEqual("1.1");
    expect(sortedDataByCode[sortedDataByCode.length - 1].code).toEqual("3.6");
  });

  it("By name", async () => {
    const sortedDataByName = sort(data).byName();

    expect(isCodeNameArray(sortedDataByName)).toBeTruthy();
    expect(sortedDataByName[0].name).toEqual("AAA");
    expect(sortedDataByName[sortedDataByName.length - 1].name).toEqual("AAZ");
  });
});
