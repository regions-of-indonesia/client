import { describe } from "vitest";

import type { DynamicClient, StaticClient } from "./../dist/lite";
import { createDynamic, createStatic } from "./../dist/lite";

import { DYNAMIC_BASE_URL, STATIC_BASE_URL, itResolveRegion, itResolveRegions, itRejectAborted } from "./shared";

const init = <T extends boolean>(isStatic: T): T extends true ? StaticClient : DynamicClient =>
  (isStatic ? createStatic(STATIC_BASE_URL) : createDynamic(DYNAMIC_BASE_URL)) as any;

describe("Dynamic", () => {
  describe("Provinces", () => {
    const client = init(false);

    itResolveRegions("find", () => client.province.find());
    itResolveRegion("find.by", () => client.province.find.by("11"));

    describe("Aborted", () => {
      itRejectAborted("find", (options) => client.province.find(options));
      itRejectAborted("find.by", (options) => client.province.find.by("11", options));
    });
  });

  describe("Districts", () => {
    const client = init(false);

    itResolveRegions("find", () => client.district.find("11"));
    itResolveRegion("find.by", () => client.district.find.by("11.01"));

    describe("Aborted", () => {
      itRejectAborted("find", (options) => client.district.find("11", options));
      itRejectAborted("find.by", (options) => client.district.find.by("11.01", options));
    });
  });

  describe("Subdistricts", () => {
    const client = init(false);

    itResolveRegions("find", () => client.subdistrict.find("11.01"));
    itResolveRegion("find.by", () => client.subdistrict.find.by("11.01.01"));

    describe("Aborted", () => {
      itRejectAborted("find", (options) => client.subdistrict.find("11.01", options));
      itRejectAborted("find.by", (options) => client.subdistrict.find.by("11.01.01", options));
    });
  });

  describe("Villages", () => {
    const client = init(false);

    itResolveRegions("find", () => client.village.find("11.01.01"));
    itResolveRegion("find.by", () => client.village.find.by("11.01.01.2001"));

    describe("Aborted", () => {
      itRejectAborted("find", (options) => client.village.find("11.01.01", options));
      itRejectAborted("find.by", (options) => client.village.find.by("11.01.01.2001", options));
    });
  });

  describe("Region", () => {
    const client = init(false);

    itResolveRegion("province", () => client.region("11"));
    itResolveRegion("district", () => client.region("11.01"));
    itResolveRegion("subdistrict", () => client.region("11.01.01"));
    itResolveRegion("village", () => client.region("11.01.01.2001"));

    describe("Aborted", () => {
      itRejectAborted("province", (options) => client.region("11", options));
      itRejectAborted("district", (options) => client.region("11.01", options));
      itRejectAborted("subdistrict", (options) => client.region("11.01.01", options));
      itRejectAborted("village", (options) => client.region("11.01.01.2001", options));
    });
  });

  describe("Search", () => {
    const client = init(false);

    const name = "a";

    itResolveRegions("all", () => client.search(name));
    itResolveRegions("provinces", () => client.search.provinces(name));
    itResolveRegions("districts", () => client.search.districts(name));
    itResolveRegions("subdistricts", () => client.search.subdistricts(name));
    itResolveRegions("villages", () => client.search.villages(name));

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
    const client = init(true);

    itResolveRegions("find", () => client.province.find());
    itResolveRegion("find.by", () => client.province.find.by("11"));

    describe("Aborted", () => {
      itRejectAborted("find", (options) => client.province.find(options));
      itRejectAborted("find.by", (options) => client.province.find.by("11", options));
    });
  });

  describe("Districts", () => {
    const client = init(true);

    itResolveRegions("find", () => client.district.find("11"));
    itResolveRegion("find.by", () => client.district.find.by("11.01"));

    describe("Aborted", () => {
      itRejectAborted("find", (options) => client.district.find("11", options));
      itRejectAborted("find.by", (options) => client.district.find.by("11.01", options));
    });
  });

  describe("Subdistricts", () => {
    const client = init(true);

    itResolveRegions("find", () => client.subdistrict.find("11.01"));
    itResolveRegion("find.by", () => client.subdistrict.find.by("11.01.01"));

    describe("Aborted", () => {
      itRejectAborted("find", (options) => client.subdistrict.find("11.01", options));
      itRejectAborted("find.by", (options) => client.subdistrict.find.by("11.01.01", options));
    });
  });

  describe("Villages", () => {
    const client = init(true);

    itResolveRegions("find", () => client.village.find("11.01.01"));
    itResolveRegion("find.by", () => client.village.find.by("11.01.01.2001"));

    describe("Aborted", () => {
      itRejectAborted("find", (options) => client.village.find("11.01.01", options));
      itRejectAborted("find.by", (options) => client.village.find.by("11.01.01.2001", options));
    });
  });

  describe("Region", () => {
    const client = init(true);

    itResolveRegion("province", () => client.region("11"));
    itResolveRegion("district", () => client.region("11.01"));
    itResolveRegion("subdistrict", () => client.region("11.01.01"));
    itResolveRegion("village", () => client.region("11.01.01.2001"));

    describe("Aborted", () => {
      itRejectAborted("province", (options) => client.region("11", options));
      itRejectAborted("district", (options) => client.region("11.01", options));
      itRejectAborted("subdistrict", (options) => client.region("11.01.01", options));
      itRejectAborted("village", (options) => client.region("11.01.01.2001", options));
    });
  });
});
