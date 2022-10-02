import type { CodeName } from "./types";

function isTypeofString(value: unknown): value is string {
  return typeof value === "string";
}

const code = {
  join: (...values: string[]) => {
    return values.filter(isTypeofString).join(".");
  },
  split: (value?: string) => {
    if (!isTypeofString(value)) return undefined;
    return isTypeofString(value) && value.split(".");
  },
  parse: (value?: string) => {
    if (!isTypeofString(value)) return undefined;
    const [province, district, subdistrict, village] = code.split(value);
    return { province, district, subdistrict, village };
  },
};

function sortFnByCodeAsc(a: CodeName, b: CodeName): number {
  if (a.code > b.code) return 1;
  if (a.code < b.code) return -1;
  return 0;
}

function sortFnByNameAsc(a: CodeName, b: CodeName): number {
  if (a.name > b.name) return 1;
  if (a.name < b.name) return -1;
  return 0;
}

function sort(codenames: CodeName[]) {
  return {
    byCode() {
      return [...codenames.sort(sortFnByCodeAsc)];
    },
    byName() {
      return [...codenames.sort(sortFnByNameAsc)];
    },
  };
}

export { code, sort };
