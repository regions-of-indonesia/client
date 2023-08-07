import { describe, expect, it } from "vitest";

import type { Region } from "@regions-of-indonesia/types";
import { isRegion, isRegions } from "@regions-of-indonesia/utils";

import { create, cache, createMemoryDriver, delay } from "../src";

const __DEV__: boolean = true;

const baseURL = __DEV__
  ? { dynamic: "http://localhost:8000", static: "http://localhost:8100/static" }
  : { dynamic: "https://regions-of-indonesia.deno.dev", static: "https://regions-of-indonesia.github.io/static" };

const init = (isStatic: boolean) => {
  const driver = createMemoryDriver();
  return { cache: driver, client: create({ baseURL, middlewares: [delay({ ms: 1 }), cache({ driver })], static: isStatic }) };
};

const expectRegion = (value: unknown) => {
  expect(isRegion(value)).toBeTruthy();
};
const expectRegions = (value: unknown) => {
  expect(isRegions(value)).toBeTruthy();
};

const expectAborted = async <T extends any>(callback: (options: { signal: AbortSignal }) => Promise<T>) => {
  const controller = new AbortController();
  queueMicrotask(() => controller.abort());
  await expect(() => callback({ signal: controller.signal })).rejects.toThrow("Aborted");
};

const itResolveRegion = (name: string, fn: () => Promise<Region>) => {
  it(name, async () => {
    expectRegion(await fn());
  });
};
const itResolveRegionEqual = (name: string, fn: () => Promise<Region>, equal: () => Promise<unknown>) => {
  it(name, async () => {
    expect(await fn()).toEqual(await equal());
  });
};
const itResolveRegions = (name: string, fn: () => Promise<Region[]>) => {
  it(name, async () => {
    expectRegions(await fn());
  });
};
const itResolveRegionsEqual = (name: string, fn: () => Promise<Region[]>, equal: () => Promise<unknown>) => {
  it(name, async () => {
    expect(await fn()).toEqual(await equal());
  });
};
const itRejectAborted = <T>(name: string, fn: (options: { signal: AbortSignal }) => Promise<T>) => {
  it(name, async () => {
    await expectAborted(fn);
  });
};

describe("Dynamic", () => {
  describe("Provinces", () => {
    const { client, cache } = init(false);

    itResolveRegions("find", () => client.province.find());
    itResolveRegion("find.by", () => client.province.find.by("11"));

    describe("Cached", () => {
      itResolveRegionsEqual(
        "find",
        () => client.province.find(),
        () => cache.get("provinces")
      );
      itResolveRegionEqual(
        "find.by",
        () => client.province.find.by("12"),
        () => cache.get("provinces/12")
      );
    });

    describe("Aborted", () => {
      itRejectAborted("find", (options) => client.province.find(options));
      itRejectAborted("find.by", (options) => client.province.find.by("11", options));
    });
  });

  describe("Districts", () => {
    const { client, cache } = init(false);

    itResolveRegions("find", () => client.district.find("11"));
    itResolveRegion("find.by", () => client.district.find.by("11.01"));

    describe("Cached", () => {
      itResolveRegionsEqual(
        "find",
        () => client.district.find("11"),
        () => cache.get("provinces/11/districts")
      );
      itResolveRegionEqual(
        "find.by",
        () => client.district.find.by("11.02"),
        () => cache.get("districts/11.02")
      );
    });

    describe("Aborted", () => {
      itRejectAborted("find", (options) => client.district.find("11", options));
      itRejectAborted("find.by", (options) => client.district.find.by("11.01", options));
    });
  });

  describe("Subdistricts", () => {
    const { client, cache } = init(false);

    itResolveRegions("find", () => client.subdistrict.find("11.01"));
    itResolveRegion("find.by", () => client.subdistrict.find.by("11.01.01"));

    describe("Cached", () => {
      itResolveRegionsEqual(
        "find",
        () => client.subdistrict.find("11.01"),
        () => cache.get("districts/11.01/subdistricts")
      );
      itResolveRegionEqual(
        "find.by",
        () => client.subdistrict.find.by("11.01.02"),
        () => cache.get("subdistricts/11.01.02")
      );
    });

    describe("Aborted", () => {
      itRejectAborted("find", (options) => client.subdistrict.find("11.01", options));
      itRejectAborted("find.by", (options) => client.subdistrict.find.by("11.01.01", options));
    });
  });

  describe("Villages", () => {
    const { client, cache } = init(false);

    itResolveRegions("find", () => client.village.find("11.01.01"));
    itResolveRegion("find.by", () => client.village.find.by("11.01.01.2001"));

    describe("Cached", () => {
      itResolveRegionsEqual(
        "find",
        () => client.village.find("11.01.01"),
        () => cache.get("subdistricts/11.01.01/villages")
      );
      itResolveRegionEqual(
        "find.by",
        () => client.village.find.by("11.01.01.2002"),
        () => cache.get("villages/11.01.01.2002")
      );
    });

    describe("Aborted", () => {
      itRejectAborted("find", (options) => client.village.find("11.01.01", options));
      itRejectAborted("find.by", (options) => client.village.find.by("11.01.01.2001", options));
    });
  });

  describe("Region", () => {
    const { client, cache } = init(false);

    itResolveRegion("province", () => client.region("11"));
    itResolveRegion("district", () => client.region("11.01"));
    itResolveRegion("subdistrict", () => client.region("11.01.01"));
    itResolveRegion("village", () => client.region("11.01.01.2001"));

    describe("Cached", () => {
      itResolveRegionEqual(
        "province",
        () => client.region("12"),
        () => cache.get("region/12")
      );
      itResolveRegionEqual(
        "district",
        () => client.region("12.01"),
        () => cache.get("region/12.01")
      );
      itResolveRegionEqual(
        "subdistrict",
        () => client.region("12.01.01"),
        () => cache.get("region/12.01.01")
      );
      itResolveRegionEqual(
        "village",
        () => client.region("12.01.01.1001"),
        () => cache.get("region/12.01.01.1001")
      );
    });

    describe("Aborted", () => {
      itRejectAborted("province", (options) => client.region("11", options));
      itRejectAborted("district", (options) => client.region("11.01", options));
      itRejectAborted("subdistrict", (options) => client.region("11.01.01", options));
      itRejectAborted("village", (options) => client.region("11.01.01.2001", options));
    });
  });

  describe("Search", () => {
    const { client, cache } = init(false);

    const name = "a";

    itResolveRegions("all", () => client.search(name));
    itResolveRegions("provinces", () => client.search.provinces(name));
    itResolveRegions("districts", () => client.search.districts(name));
    itResolveRegions("subdistricts", () => client.search.subdistricts(name));
    itResolveRegions("villages", () => client.search.villages(name));

    describe("Cached", () => {
      itResolveRegionsEqual(
        "all",
        () => client.search(name),
        () => cache.get("search?name=a")
      );
      itResolveRegionsEqual(
        "provinces",
        () => client.search.provinces(name),
        () => cache.get("search/provinces?name=a")
      );
      itResolveRegionsEqual(
        "districts",
        () => client.search.districts(name),
        () => cache.get("search/districts?name=a")
      );
      itResolveRegionsEqual(
        "subdistricts",
        () => client.search.subdistricts(name),
        () => cache.get("search/subdistricts?name=a")
      );
      itResolveRegionsEqual(
        "villages",
        () => client.search.villages(name),
        () => cache.get("search/villages?name=a")
      );
    });

    describe("Aborted", () => {
      itRejectAborted("all", (options) => client.search(name, options));
      itRejectAborted("provinces", (options) => client.search.provinces(name, options));
      itRejectAborted("districts", (options) => client.search.districts(name, options));
      itRejectAborted("subdistricts", (options) => client.search.subdistricts(name, options));
      itRejectAborted("villages", (options) => client.search.villages(name, options));
    });
  });
});

describe("Static", () => {
  describe("Provinces", () => {
    const { client, cache } = init(true);

    itResolveRegions("find", () => client.province.find());
    itResolveRegion("find.by", () => client.province.find.by("11"));

    describe("Cached", () => {
      itResolveRegionsEqual(
        "find",
        () => client.province.find(),
        () => cache.get("provinces")
      );
      itResolveRegionEqual(
        "find.by",
        () => client.province.find.by("12"),
        () => cache.get("provinces/12")
      );
    });

    describe("Aborted", () => {
      itRejectAborted("find", (options) => client.province.find(options));
      itRejectAborted("find.by", (options) => client.province.find.by("11", options));
    });
  });

  describe("Districts", () => {
    const { client, cache } = init(true);

    itResolveRegions("find", () => client.district.find("11"));
    itResolveRegion("find.by", () => client.district.find.by("11.01"));

    describe("Cached", () => {
      itResolveRegionsEqual(
        "find",
        () => client.district.find("11"),
        () => cache.get("provinces/11/districts")
      );
      itResolveRegionEqual(
        "find.by",
        () => client.district.find.by("11.02"),
        () => cache.get("districts/11.02")
      );
    });

    describe("Aborted", () => {
      itRejectAborted("find", (options) => client.district.find("11", options));
      itRejectAborted("find.by", (options) => client.district.find.by("11.01", options));
    });
  });

  describe("Subdistricts", () => {
    const { client, cache } = init(true);

    itResolveRegions("find", () => client.subdistrict.find("11.01"));
    itResolveRegion("find.by", () => client.subdistrict.find.by("11.01.01"));

    describe("Cached", () => {
      itResolveRegionsEqual(
        "find",
        () => client.subdistrict.find("11.01"),
        () => cache.get("districts/11.01/subdistricts")
      );
      itResolveRegionEqual(
        "find.by",
        () => client.subdistrict.find.by("11.01.02"),
        () => cache.get("subdistricts/11.01.02")
      );
    });

    describe("Aborted", () => {
      itRejectAborted("find", (options) => client.subdistrict.find("11.01", options));
      itRejectAborted("find.by", (options) => client.subdistrict.find.by("11.01.01", options));
    });
  });

  describe("Villages", () => {
    const { client, cache } = init(true);

    itResolveRegions("find", () => client.village.find("11.01.01"));
    itResolveRegion("find.by", () => client.village.find.by("11.01.01.2001"));

    describe("Cached", () => {
      itResolveRegionsEqual(
        "find",
        () => client.village.find("11.01.01"),
        () => cache.get("subdistricts/11.01.01/villages")
      );
      itResolveRegionEqual(
        "find.by",
        () => client.village.find.by("11.01.01.2002"),
        () => cache.get("villages/11.01.01.2002")
      );
    });

    describe("Aborted", () => {
      itRejectAborted("find", (options) => client.village.find("11.01.01", options));
      itRejectAborted("find.by", (options) => client.village.find.by("11.01.01.2001", options));
    });
  });

  describe("Region", () => {
    const { client, cache } = init(true);

    itResolveRegion("province", () => client.region("11"));
    itResolveRegion("district", () => client.region("11.01"));
    itResolveRegion("subdistrict", () => client.region("11.01.01"));
    itResolveRegion("village", () => client.region("11.01.01.2001"));

    describe("Cached", () => {
      itResolveRegionEqual(
        "province",
        () => client.region("12"),
        () => cache.get("region/12")
      );
      itResolveRegionEqual(
        "district",
        () => client.region("12.01"),
        () => cache.get("region/12.01")
      );
      itResolveRegionEqual(
        "subdistrict",
        () => client.region("12.01.01"),
        () => cache.get("region/12.01.01")
      );
      itResolveRegionEqual(
        "village",
        () => client.region("12.01.01.1001"),
        () => cache.get("region/12.01.01.1001")
      );
    });

    describe("Aborted", () => {
      itRejectAborted("province", (options) => client.region("11", options));
      itRejectAborted("district", (options) => client.region("11.01", options));
      itRejectAborted("subdistrict", (options) => client.region("11.01.01", options));
      itRejectAborted("village", (options) => client.region("11.01.01.2001", options));
    });
  });

  describe("Search", () => {
    const { client, cache } = init(true);

    const name = "a";

    itResolveRegionsEqual(
      "all",
      () => client.search(name),
      () => Promise.resolve([])
    );
    itResolveRegionsEqual(
      "provinces",
      () => client.search.provinces(name),
      () => Promise.resolve([])
    );
    itResolveRegionsEqual(
      "districts",
      () => client.search.districts(name),
      () => Promise.resolve([])
    );
    itResolveRegionsEqual(
      "subdistricts",
      () => client.search.subdistricts(name),
      () => Promise.resolve([])
    );
    itResolveRegionsEqual(
      "villages",
      () => client.search.villages(name),
      () => Promise.resolve([])
    );
  });
});
