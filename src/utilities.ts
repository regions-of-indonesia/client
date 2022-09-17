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

function dotjson(key: string) {
  return `${key}.json`;
}

export { code, dotjson };
