import { describe } from "vitest";

import { create, cache, createMemoryDriver, delay } from "./../dist/index";

import {
  DYNAMIC_BASE_URL,
  STATIC_BASE_URL,
  itResolveRegion,
  itResolveRegionEqual,
  itResolveRegions,
  itResolveRegionsEqual,
  itRejectAborted,
} from "./shared";

const init = (isStatic: boolean) => {
  const driver = createMemoryDriver();
  return {
    cache: driver,
    client: create({
      baseURL: { dynamic: DYNAMIC_BASE_URL, static: STATIC_BASE_URL },
      middlewares: [delay({ ms: 1 }), cache({ driver })],
      static: isStatic,
    }),
  };
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
