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

    return await this.client.fetch<CodeName[]>(this.client.static ? dotjson(`${key}/${key}`) : key, options);
  }
  async findByCode(code: string, options?: Options) {
    const key = RegionsOfIndonesiaClient.pathname.province(code);

    return await this.client.fetch<CodeName>(this.client.static ? dotjson(key) : key, options);
  }
  async search(text: string, options?: Options) {
    if (this.client.static) {
      console.warn("Province search API not supported in static API");
      return [];
    }

    const key = RegionsOfIndonesiaClient.pathname.searchProvinces(text);

    return await this.client.fetch<CodeName[]>(key, options);
  }
}

class District {
  private client: RegionsOfIndonesiaClient;

  constructor(client: RegionsOfIndonesiaClient) {
    this.client = client;
  }

  async findByProvinceCode(code: string, options?: Options) {
    const key = RegionsOfIndonesiaClient.pathname.districts(code);

    return await this.client.fetch<CodeName[]>(this.client.static ? dotjson(key) : key, options);
  }

  async findByCode(code: string, options?: Options) {
    const key = RegionsOfIndonesiaClient.pathname.district(code);

    return await this.client.fetch<CodeName>(this.client.static ? dotjson(key) : key, options);
  }

  async search(text: string, options?: Options) {
    if (this.client.static) {
      console.warn("District search API not supported in static API");
      return [];
    }

    const key = RegionsOfIndonesiaClient.pathname.searchDistricts(text);

    return await this.client.fetch<CodeName[]>(key, options);
  }
}

class Subdistrict {
  private client: RegionsOfIndonesiaClient;

  constructor(client: RegionsOfIndonesiaClient) {
    this.client = client;
  }

  async findByDistrictCode(code: string, options?: Options) {
    const key = RegionsOfIndonesiaClient.pathname.subdistricts(code);

    return await this.client.fetch<CodeName[]>(this.client.static ? dotjson(key) : key, options);
  }

  async findByCode(code: string, options?: Options) {
    const key = RegionsOfIndonesiaClient.pathname.subdistrict(code);

    return await this.client.fetch<CodeName>(this.client.static ? dotjson(key) : key, options);
  }

  async search(text: string, options?: Options) {
    if (this.client.static) {
      console.warn("Subdistrict search API not supported in static API");
      return [];
    }

    const key = RegionsOfIndonesiaClient.pathname.searchSubdistricts(text);

    return await this.client.fetch<CodeName[]>(key, options);
  }
}

class Village {
  private client: RegionsOfIndonesiaClient;

  constructor(client: RegionsOfIndonesiaClient) {
    this.client = client;
  }

  async findBySubdistrictCode(code: string, options?: Options) {
    const key = RegionsOfIndonesiaClient.pathname.villages(code);

    return await this.client.fetch<CodeName[]>(this.client.static ? dotjson(key) : key, options);
  }

  async findByCode(code: string, options?: Options) {
    const key = RegionsOfIndonesiaClient.pathname.village(code);

    return await this.client.fetch<CodeName>(this.client.static ? dotjson(key) : key, options);
  }

  async search(text: string, options?: Options) {
    if (this.client.static) {
      console.warn("Village search API not supported in static API");
      return [];
    }

    const key = RegionsOfIndonesiaClient.pathname.searchVillages(text);

    return await this.client.fetch<CodeName[]>(key, options);
  }
}

interface RegionsOfIndonesiaClientOptions {
  baseURL?: string;
  static?: boolean;
  middlewares?: Middleware[];
}

class RegionsOfIndonesiaClient {
  public baseURL: string;
  public static: boolean;
  private middlewares: Middleware[];

  public province: Province;
  public district: District;
  public subdistrict: Subdistrict;
  public village: Village;

  constructor(options: RegionsOfIndonesiaClientOptions = {}) {
    this.baseURL = options.baseURL ?? "https://regions-of-indonesia-flamrdevs.koyeb.app";
    this.static = Boolean(options.static);
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

  public async fetch<T extends any>(url: string, options?: Options): Promise<T> {
    return await this.execute({ url: `${this.baseURL}/${url}` }, async ({ url }: Context) => await this.fetcher(url, options));
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
    if (this.static) {
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
    }>(key, options);
  }
}

export type { RegionsOfIndonesiaClientOptions };
export default RegionsOfIndonesiaClient;
