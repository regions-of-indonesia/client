import type { CodeName, Context, Options, Middleware } from "./types";

import { cache, log } from "./middlewares";

const dotjson = (key: string) => `${key}.json`,
  isStaticOptions = (options?: Options, client?: RegionsOfIndonesiaClient) => Boolean(options?.static ?? client?.static);

class Province {
  constructor(private client: RegionsOfIndonesiaClient) {}

  async find(options: Options = {}) {
    const key = RegionsOfIndonesiaClient.pathname.provinces(),
      url = isStaticOptions(options, this.client) ? dotjson(key) : key;
    return await this.client.fetch<CodeName[]>(key, url, options);
  }

  async findByCode(code: string, options: Options = {}) {
    const key = RegionsOfIndonesiaClient.pathname.province(code),
      url = isStaticOptions(options, this.client) ? dotjson(key) : key;
    return await this.client.fetch<CodeName>(key, url, options);
  }

  async search(name: string, options: Options = {}) {
    if (isStaticOptions(options, this.client)) {
      console.warn("Province search API not supported in static API");
      return [];
    }

    const key = RegionsOfIndonesiaClient.pathname.searchProvinces(name);
    return await this.client.fetch<CodeName[]>(key, key, options);
  }
}

class District {
  constructor(private client: RegionsOfIndonesiaClient) {}

  async findByProvinceCode(code: string, options: Options = {}) {
    const key = RegionsOfIndonesiaClient.pathname.districts(code),
      url = isStaticOptions(options, this.client) ? dotjson(key) : key;
    return await this.client.fetch<CodeName[]>(key, url, options);
  }

  async findByCode(code: string, options: Options = {}) {
    const key = RegionsOfIndonesiaClient.pathname.district(code),
      url = isStaticOptions(options, this.client) ? dotjson(key) : key;
    return await this.client.fetch<CodeName>(key, url, options);
  }

  async search(name: string, options: Options = {}) {
    if (isStaticOptions(options, this.client)) {
      console.warn("District search API not supported in static API");
      return [];
    }

    const key = RegionsOfIndonesiaClient.pathname.searchDistricts(name);
    return await this.client.fetch<CodeName[]>(key, key, options);
  }
}

class Subdistrict {
  constructor(private client: RegionsOfIndonesiaClient) {}

  async findByDistrictCode(code: string, options: Options = {}) {
    const key = RegionsOfIndonesiaClient.pathname.subdistricts(code),
      url = isStaticOptions(options, this.client) ? dotjson(key) : key;
    return await this.client.fetch<CodeName[]>(key, url, options);
  }

  async findByCode(code: string, options: Options = {}) {
    const key = RegionsOfIndonesiaClient.pathname.subdistrict(code),
      url = isStaticOptions(options, this.client) ? dotjson(key) : key;
    return await this.client.fetch<CodeName>(key, url, options);
  }

  async search(name: string, options: Options = {}) {
    if (isStaticOptions(options, this.client)) {
      console.warn("Subdistrict search API not supported in static API");
      return [];
    }

    const key = RegionsOfIndonesiaClient.pathname.searchSubdistricts(name);
    return await this.client.fetch<CodeName[]>(key, key, options);
  }
}

class Village {
  constructor(private client: RegionsOfIndonesiaClient) {}

  async findBySubdistrictCode(code: string, options: Options = {}) {
    const key = RegionsOfIndonesiaClient.pathname.villages(code),
      url = isStaticOptions(options, this.client) ? dotjson(key) : key;
    return await this.client.fetch<CodeName[]>(key, url, options);
  }

  async findByCode(code: string, options: Options = {}) {
    const key = RegionsOfIndonesiaClient.pathname.village(code),
      url = isStaticOptions(options, this.client) ? dotjson(key) : key;
    return await this.client.fetch<CodeName>(key, url, options);
  }

  async search(name: string, options: Options = {}) {
    if (isStaticOptions(options, this.client)) {
      console.warn("Village search API not supported in static API");
      return [];
    }

    const key = RegionsOfIndonesiaClient.pathname.searchVillages(name);
    return await this.client.fetch<CodeName[]>(key, key, options);
  }
}

interface RegionsOfIndonesiaClientOptions {
  baseURL?: string | { dynamic?: string; static?: string };
  static?: boolean;
  middlewares?: Middleware[];
}

class RegionsOfIndonesiaClient {
  private _baseURL: string;
  private _static: boolean;
  private middlewares: Middleware[];

  public province: Province;
  public district: District;
  public subdistrict: Subdistrict;
  public village: Village;

  private options: RegionsOfIndonesiaClientOptions;

  private defaultBaseURL = {
    dynamic: "https://regions-of-indonesia.deno.dev",
    static: "https://regions-of-indonesia.github.io/static-api",
  };

  public get baseURL() {
    return this._baseURL;
  }

  public get static() {
    return this._static;
  }

  constructor(options: RegionsOfIndonesiaClientOptions = {}) {
    this.options = options;

    this._static = this.getStaticByOptions();
    this._baseURL = this.getBaseURLByOptions();
    this.middlewares = this.getMiddlewaresByOptions();

    this.province = new Province(this);
    this.district = new District(this);
    this.subdistrict = new Subdistrict(this);
    this.village = new Village(this);
  }

  private getStaticByOptions() {
    return Boolean(this.options?.static);
  }

  private getBaseURLByOptions(options: { static: boolean } = { static: this._static }) {
    if (typeof this.options.baseURL === "object" && this.options.baseURL != null) {
      if (options?.static) {
        return this.options.baseURL.static ?? this.defaultBaseURL.static;
      } else {
        return this.options.baseURL.dynamic ?? this.defaultBaseURL.dynamic;
      }
    } else if (typeof this.options.baseURL === "string") {
      return this.options.baseURL;
    } else {
      return options?.static ? this.defaultBaseURL.static : this.defaultBaseURL.dynamic;
    }
  }

  private getMiddlewaresByOptions() {
    return this.options.middlewares ?? [log(), cache()];
  }

  private async execute(context: Context, fallback: (context: Context) => Promise<any>, options: Options = {}): Promise<any> {
    if (typeof options.signal !== "undefined" && options.signal.aborted) throw new Error("Aborted");

    async function runner(middlewares: Middleware[]): Promise<any> {
      const [middleware, ..._middlewares] = middlewares;
      return middleware instanceof Function ? await middleware(context, async () => await runner(_middlewares)) : await fallback(context);
    }

    return new Promise(async (resolve, reject) => {
      if (typeof options.signal !== "undefined") {
        options.signal.onabort = () => {
          reject(new Error("Aborted"));
          return;
        };
      }

      resolve(await runner(this.middlewares));
    });
  }

  private async fetcher<T extends any>(url: string, options: Options = {}): Promise<T> {
    return await (await fetch(url, options)).json();
  }

  public async fetch<T extends any>(key: string, url: string, options: Options = {}): Promise<T> {
    if (typeof options.signal !== "undefined" && options.signal.aborted) throw new Error("Aborted");

    return await this.execute(
      {
        key,
        url: `${typeof options?.static === "boolean" ? this.getBaseURLByOptions({ static: options?.static }) : this._baseURL}/${url}`,
      },
      async ({ url }: Context) => await this.fetcher(url, options),
      options
    );
  }

  static pathname = {
    provinces: () => `provinces`,
    province: (code: string) => `province/${code}`,
    districts: (provinceCode: string) => `districts/${provinceCode}`,
    district: (code: string) => `district/${code}`,
    districtsInProvince: (code: string) => `province/${code}/districts`,
    subdistricts: (districtCode: string) => `subdistricts/${districtCode}`,
    subdistrict: (code: string) => `subdistrict/${code}`,
    subdistrictsInDistrict: (code: string) => `district/${code}/subdistricts`,
    villages: (subdistrictCode: string) => `villages/${subdistrictCode}`,
    village: (code: string) => `village/${code}`,
    villagesInSubdistrict: (code: string) => `subdistrict/${code}/villages`,
    search: (name: string) => `search?name=${name}`,
    searchProvinces: (name: string) => `search/provinces?name=${name}`,
    searchDistricts: (name: string) => `search/districts?name=${name}`,
    searchSubdistricts: (name: string) => `search/subdistricts?name=${name}`,
    searchVillages: (name: string) => `search/villages?name=${name}`,
  };

  public async search(name: string, options: Options = {}) {
    if (Boolean(options?.static ?? this._static)) {
      console.warn("Search API not supported in static API");
      return { provinces: [], districts: [], subdistricts: [], villages: [] };
    }

    const key = RegionsOfIndonesiaClient.pathname.search(name);
    return await this.fetch<{ provinces: CodeName[]; districts: CodeName[]; subdistricts: CodeName[]; villages: CodeName[] }>(
      key,
      key,
      options
    );
  }
}

export type { RegionsOfIndonesiaClientOptions };
export { RegionsOfIndonesiaClient };
