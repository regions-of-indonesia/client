import type { CodeName, Context, Options, Middleware } from "./types";

import { cache, log } from "./middlewares";

import { dotjson } from "./utilities";

class Province {
  private client: RegionsOfIndonesiaClient;

  constructor(client: RegionsOfIndonesiaClient) {
    this.client = client;
  }

  async find(options?: Options) {
    const key = RegionsOfIndonesiaClient.pathname.provinces();
    const url = this.client.static ? dotjson(key) : key;
    return await this.client.fetch<CodeName[]>(key, url, options);
  }

  async findByCode(code: string, options?: Options) {
    const key = RegionsOfIndonesiaClient.pathname.province(code);
    const url = this.client.static ? dotjson(key) : key;
    return await this.client.fetch<CodeName>(key, url, options);
  }

  async search(text: string, options?: Options) {
    if (this.client.static) {
      console.warn("Province search API not supported in static API");
      return [];
    }

    const key = RegionsOfIndonesiaClient.pathname.searchProvinces(text);
    return await this.client.fetch<CodeName[]>(key, key, options);
  }
}

class District {
  private client: RegionsOfIndonesiaClient;

  constructor(client: RegionsOfIndonesiaClient) {
    this.client = client;
  }

  async findByProvinceCode(code: string, options?: Options) {
    const key = RegionsOfIndonesiaClient.pathname.districts(code);
    const url = this.client.static ? dotjson(key) : key;
    return await this.client.fetch<CodeName[]>(key, url, options);
  }

  async findByCode(code: string, options?: Options) {
    const key = RegionsOfIndonesiaClient.pathname.district(code);
    const url = this.client.static ? dotjson(key) : key;
    return await this.client.fetch<CodeName>(key, url, options);
  }

  async search(text: string, options?: Options) {
    if (this.client.static) {
      console.warn("District search API not supported in static API");
      return [];
    }

    const key = RegionsOfIndonesiaClient.pathname.searchDistricts(text);
    return await this.client.fetch<CodeName[]>(key, key, options);
  }
}

class Subdistrict {
  private client: RegionsOfIndonesiaClient;

  constructor(client: RegionsOfIndonesiaClient) {
    this.client = client;
  }

  async findByDistrictCode(code: string, options?: Options) {
    const key = RegionsOfIndonesiaClient.pathname.subdistricts(code);
    const url = this.client.static ? dotjson(key) : key;
    return await this.client.fetch<CodeName[]>(key, url, options);
  }

  async findByCode(code: string, options?: Options) {
    const key = RegionsOfIndonesiaClient.pathname.subdistrict(code);
    const url = this.client.static ? dotjson(key) : key;
    return await this.client.fetch<CodeName>(key, url, options);
  }

  async search(text: string, options?: Options) {
    if (this.client.static) {
      console.warn("Subdistrict search API not supported in static API");
      return [];
    }

    const key = RegionsOfIndonesiaClient.pathname.searchSubdistricts(text);
    return await this.client.fetch<CodeName[]>(key, key, options);
  }
}

class Village {
  private client: RegionsOfIndonesiaClient;

  constructor(client: RegionsOfIndonesiaClient) {
    this.client = client;
  }

  async findBySubdistrictCode(code: string, options?: Options) {
    const key = RegionsOfIndonesiaClient.pathname.villages(code);
    const url = this.client.static ? dotjson(key) : key;
    return await this.client.fetch<CodeName[]>(key, url, options);
  }

  async findByCode(code: string, options?: Options) {
    const key = RegionsOfIndonesiaClient.pathname.village(code);
    const url = this.client.static ? dotjson(key) : key;
    return await this.client.fetch<CodeName>(key, url, options);
  }

  async search(text: string, options?: Options) {
    if (this.client.static) {
      console.warn("Village search API not supported in static API");
      return [];
    }

    const key = RegionsOfIndonesiaClient.pathname.searchVillages(text);
    return await this.client.fetch<CodeName[]>(key, key, options);
  }
}

interface RegionsOfIndonesiaClientOptions {
  baseURL?: string;
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

  public get baseURL() {
    return this._baseURL;
  }

  public get static() {
    return this._static;
  }

  constructor(options: RegionsOfIndonesiaClientOptions = {}) {
    this._static = Boolean(options.static);

    const fallbackBaseURL = this._static
      ? "https://regions-of-indonesia.github.io/static-api"
      : "https://regions-of-indonesia-flamrdevs.koyeb.app";

    this._baseURL = options.baseURL ?? fallbackBaseURL;
    this.middlewares = options.middlewares ?? [log(), cache()];

    this.province = new Province(this);
    this.district = new District(this);
    this.subdistrict = new Subdistrict(this);
    this.village = new Village(this);
  }

  private async execute(context: Context, fallback: (context: Context) => Promise<any>): Promise<any> {
    async function runner(middlewares: Middleware[]): Promise<any> {
      const [middleware, ..._middlewares] = middlewares;

      if (middleware instanceof Function) {
        return await middleware(context, async () => await runner(_middlewares));
      } else {
        return await fallback(context);
      }
    }

    return await runner(this.middlewares);
  }

  private async fetcher<T extends any>(url: string, options?: Options): Promise<T> {
    const response = await fetch(url, options);
    return await response.json();
  }

  public async fetch<T extends any>(key: string, url: string, options?: Options): Promise<T> {
    return await this.execute({ key, url: `${this._baseURL}/${url}` }, async ({ url }: Context) => await this.fetcher(url, options));
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
    search: (text: string) => `search?text=${text}`,
    searchProvinces: (text: string) => `search/provinces?text=${text}`,
    searchDistricts: (text: string) => `search/districts?text=${text}`,
    searchSubdistricts: (text: string) => `search/subdistricts?text=${text}`,
    searchVillages: (text: string) => `search/villages?text=${text}`,
  };

  public async search(text: string, options?: Options) {
    if (this._static) {
      console.warn("Search API not supported in static API");
      return {
        provinces: [],
        districts: [],
        subdistricts: [],
        villages: [],
      };
    }

    const key = RegionsOfIndonesiaClient.pathname.search(text);
    return await this.fetch<{
      provinces: CodeName[];
      districts: CodeName[];
      subdistricts: CodeName[];
      villages: CodeName[];
    }>(key, key, options);
  }
}

export type { RegionsOfIndonesiaClientOptions };
export default RegionsOfIndonesiaClient;
