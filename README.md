[![cover]][site]

<p align="center">
  <a href="http://www.npmjs.com/package/@regions-of-indonesia/client"><img src="https://img.shields.io/npm/v/@regions-of-indonesia/client" /></a>
  <a href="https://bundlephobia.com/package/@regions-of-indonesia/client"><img src="https://img.shields.io/bundlephobia/minzip/@regions-of-indonesia/client" /></a>
  <a href="https://indonesia-api.netlify.app/regions-of-indonesia"><img src="https://raw.githubusercontent.com/indonesia-api/indonesia-api/main/public/Badge.svg?sanitize=true" /></a>
</p>

<img src="https://hiiits.deta.dev/hit/regions-of-indonesia/client?" width="100%" heigth="10px" />

# Regions of Indonesia

Regions of Indonesia

## Features

- Support both [Dynamic API][github:api] & [Static API][github:static-api]
- Search API for Dynamic API
- [Javascript client][github:client]
- [Documented][docs] with in-app [demo][site]

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

## Package

Install

```bash
npm install @regions-of-indonesia/client
# or
yarn add @regions-of-indonesia/client
```

Usage

```typescript
// src/libs/client.ts

import { RegionsOfIndonesia } from "@regions-of-indonesia/client";

const client = new RegionsOfIndonesia({
  // baseURL?: string | { dynamic?: string; static?: string };
  // static?: boolean;
  // middlewares?: Middleware[];
});

/**
 * baseURL is optional and default value is object:
 *    {
 *       dynamic: "https://regions-of-indonesia.deta.dev",
 *       static: "https://regions-of-indonesia.github.io/static-api",
 *    }
 * static is optional and no default value which means client will use dynamic api
 * middlewares is optional and default value is array:
 *    [
 *      log(),
 *      cache(),
 *    ]
 */

// Async Await
async function getProvinces() {
  const provinces = await client.province.find(); /** provinces is CodeName[] */
}
// Promise
client.province.findByCode("11").then((province) => {
  console.log(province); /** province is CodeName */
});
client.search("some-text").then((result) => {
  console.log(result); /** result is SearchResult */
});
```

## Examples

- [react][github:example-react-ts]
- [solid][github:example-solid-ts]

## Support

[![][support:ko-fi-button]][support:ko-fi]

[![][support:trakteer-button]][support:trakteer]

## LICENSE

GPL-3.0

[cover]: https://raw.githubusercontent.com/regions-of-indonesia/regions-of-indonesia/main/public/Cover.png?sanitize=true
[site]: https://regions-of-indonesia.netlify.app
[docs]: https://regions-of-indonesia-docs.netlify.app
[github:api]: https://github.com/regions-of-indonesia/api
[github:static-api]: https://github.com/regions-of-indonesia/static-api
[github:site]: https://github.com/regions-of-indonesia/site
[github:docs]: https://github.com/regions-of-indonesia/docs
[github:client]: https://github.com/regions-of-indonesia/client
[github:data]: https://github.com/regions-of-indonesia/data
[github:php-client]: https://github.com/regions-of-indonesia/php-client
[github:dart-client]: https://github.com/regions-of-indonesia/dart-client
[github:python-client]: https://github.com/regions-of-indonesia/python-client
[github:swr]: https://github.com/regions-of-indonesia/swr
[github:react-query]: https://github.com/regions-of-indonesia/react-query
[github:solid-query]: https://github.com/regions-of-indonesia/solid-query
[github:example-react-ts]: https://github.com/regions-of-indonesia/example-react-ts
[github:example-react-ts-swr]: https://github.com/regions-of-indonesia/example-react-ts-swr
[github:example-react-ts-query]: https://github.com/regions-of-indonesia/example-react-ts-query
[github:example-solid-ts]: https://github.com/regions-of-indonesia/example-solid-ts
[github:example-solid-ts-query]: https://github.com/regions-of-indonesia/example-solid-ts-query
[support:ko-fi]: https://ko-fi.com/flamrdevs
[support:ko-fi-button]: https://flamrdevs.vercel.app/ko-fi.png
[support:trakteer]: https://trakteer.id/flamrdevs
[support:trakteer-button]: https://flamrdevs.vercel.app/trakteer.png
