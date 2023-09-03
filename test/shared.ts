import { describe, expect, it } from "vitest";

import type { Region } from "@regions-of-indonesia/types";
import { isRegion, isRegions } from "@regions-of-indonesia/utils";

export const DYNAMIC_BASE_URL = "http://localhost:8000";
export const STATIC_BASE_URL = "http://localhost:8100/static";

export const expectRegion = (value: unknown) => {
  expect(isRegion(value)).toBeTruthy();
};
export const expectRegions = (value: unknown) => {
  expect(isRegions(value)).toBeTruthy();
};

export const expectAborted = async <T extends any>(callback: (options: { signal: AbortSignal }) => Promise<T>) => {
  const controller = new AbortController();
  controller.abort();
  await expect(() => callback({ signal: controller.signal })).rejects.toThrow("Aborted");
};

export const itResolveRegion = (name: string, fn: () => Promise<Region>) => {
  it(name, async () => {
    expectRegion(await fn());
  });
};
export const itResolveRegionEqual = (name: string, fn: () => Promise<Region>, equal: () => Promise<unknown>) => {
  it(name, async () => {
    expect(await fn()).toEqual(await equal());
  });
};
export const itResolveRegions = (name: string, fn: () => Promise<Region[]>) => {
  it(name, async () => {
    expectRegions(await fn());
  });
};
export const itResolveRegionsEqual = (name: string, fn: () => Promise<Region[]>, equal: () => Promise<unknown>) => {
  it(name, async () => {
    expect(await fn()).toEqual(await equal());
  });
};
export const itRejectAborted = <T>(name: string, fn: (options: { signal: AbortSignal }) => Promise<T>) => {
  it(name, async () => {
    await expectAborted(fn);
  });
};
