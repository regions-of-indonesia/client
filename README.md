[![](./public/Cover.png)](https://regions-of-indonesia.netlify.app)

# Regions of Indonesia

Regions of Indonesia

## Features

- Support both [Dynamic API](https://github.com/regions-of-indonesia/api) & [Static API](https://github.com/regions-of-indonesia/static-api)
- Search API for Dynamic API
- [Javascript client SDK](https://github.com/regions-of-indonesia/client)
- Documented with in-app [DEMO](https://regions-of-indonesia.netlify.app)

## Types

```typescript
type CodeName = {
  code: string;
  name: string;
};

type SearchResult = {
  provinces: CodeName[];
  districts: CodeName[];
  subdistricts: CodeName[];
  villages: CodeName[];
};
```

## Javascript Client SDK

Install

```bash
npm install @regions-of-indonesia/client
```

Usage

```typescript
// src/libs/client.ts

import { RegionsOfIndonesia } from "@regions-of-indonesia/client";

const client = new RegionsOfIndonesia({
  // baseURL: string, // optional, default is "https://regions-of-indonesia-flamrdevs.koyeb.app"
  // middlewares: Middleware[] // optional, default is log and (in-memory) cache
  // static: boolean, optional, default is false, only set to true if use static API
});

// Async Await
async function getProvinces() {
  const provinces = await client.province.find(/**options?: { signal?: AbortSignal }*/);
}
// Promise
await client.province.findByCode("11" /**options?: { signal?: AbortSignal }*/).then((province) => {
  console.log(province);
});

await client.search("some-text").then((result) => {
  console.log(result); /** result is SearchResult */
});
```

Other usage

```typescript
import { RegionsOfIndonesia, log, cache } from "@regions-of-indonesia/client";

const localStorageDriver /** or any */ = {
  async get(key: string) {
    return JSON.parse(localStorage.getItem(key));
  },
  async set(key: string, value: any) {
    localStorage.setItem(key, JSON.stringify(value));
  },
  async delete(key: string) {
    localStorage.removeItem(key);
  },
};

const client = new RegionsOfIndonesia({
  baseURL: "https://regions-of-indonesia.github.io/static-api",
  middlewares: [log(), cache(localStorageDriver)]
  static: true
});

// then use as dynamic API or static API rules
```

## Support

- Donate [Ko-Fi](https://ko-fi.com/flamrdevs) or [Trakteer](https://trakteer.id/flamrdevs)

## LICENSE

GPL-3.0
