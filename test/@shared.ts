import { expect } from "vitest";

import { delay, hasOwnProperties, isArray, isTypeofObject, isTypeofString } from "javascript-yesterday";

import type { CodeName, RegionResult, SearchResult } from "../src";

const isCodeName = (value: unknown): value is CodeName =>
  isTypeofObject(value) && hasOwnProperties(value, "code", "name") && isTypeofString(value.code) && isTypeofString(value.name);

const isCodeNameArray = (value: unknown): value is CodeName[] => isArray(value) && value.every(isCodeName);

const isRegionResult = (value: unknown): value is RegionResult => {
  if (isTypeofObject(value)) {
    if (
      (hasOwnProperties(value, "province") && !isCodeName(value.province)) ||
      (hasOwnProperties(value, "district") && !isCodeName(value.district)) ||
      (hasOwnProperties(value, "subdistrict") && !isCodeName(value.subdistrict)) ||
      (hasOwnProperties(value, "village") && !isCodeName(value.village))
    ) {
      return false;
    } else {
      return true;
    }
  }
  return false;
};

const isSearchResult = (value: unknown): value is SearchResult => {
  if (isTypeofObject(value) && hasOwnProperties(value, "provinces", "districts", "subdistricts", "villages")) {
    const { provinces, districts, subdistricts, villages } = value;
    return [provinces, districts, subdistricts, villages].every(isCodeNameArray);
  }
  return false;
};

const expectCodeName = (value: unknown) => {
  expect(isCodeName(value)).toBeTruthy();
};

const expectCodeNameArray = (value: unknown) => {
  expect(isCodeNameArray(value)).toBeTruthy();
};

const expectRegionResult = (value: unknown) => {
  expect(isRegionResult(value)).toBeTruthy();
};

const expectSearchResult = (value: unknown) => {
  expect(isSearchResult(value)).toBeTruthy();
};

const withCancelation = async <T extends any>(callback: (signal: AbortSignal) => Promise<T>) => {
  const controller = new AbortController();

  setTimeout(() => {
    console.log(`controller.abort()`);
    controller.abort();
  }, 100);

  console.log(`callback(controller.signal)`);
  await delay(200);
  await callback(controller.signal);
};

const expectCancelation = async <T extends any>(callback: (signal: AbortSignal) => Promise<T>) => {
  await expect(withCancelation(callback)).rejects.toThrow("Aborted");
};

export { isCodeName, isCodeNameArray, isRegionResult, isSearchResult, withCancelation };
export { expectCodeName, expectCodeNameArray, expectRegionResult, expectSearchResult, expectCancelation };
