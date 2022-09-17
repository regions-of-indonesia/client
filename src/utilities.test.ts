import { describe, expect, it } from "vitest";

import { code } from "./utilities";

describe("Utilities", () => {
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
