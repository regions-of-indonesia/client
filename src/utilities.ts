import type { CodeName } from "./types";

const isTypeofString = (value: unknown): value is string => typeof value === "string",
  code = {
    join: (...values: string[]) => {
      return values.filter(isTypeofString).join(".");
    },
    split: (value?: string) => {
      if (!isTypeofString(value)) return undefined;
      return isTypeofString(value) && value.split(".");
    },
    parse: (value?: string) => {
      if (!isTypeofString(value)) return undefined;
      const [province, district, subdistrict, village] = code.split(value) || [];
      return { province, district, subdistrict, village };
    },
  },
  sortFn = <T>(a: T, b: T) => (a > b ? 1 : a < b ? -1 : 0),
  sortFnByCodeAsc = (a: CodeName, b: CodeName): number => sortFn(a.code, b.code),
  sortFnByNameAsc = (a: CodeName, b: CodeName): number => sortFn(a.name, b.name),
  sort = {
    byCode(codenames: CodeName[]) {
      return [...codenames.sort(sortFnByCodeAsc)];
    },
    byName(codenames: CodeName[]) {
      return [...codenames.sort(sortFnByNameAsc)];
    },
  };

export { code, sort };
