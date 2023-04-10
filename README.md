[![cover]][site]

<p align="center">
  <a href="http://www.npmjs.com/package/@regions-of-indonesia/client"><img src="https://img.shields.io/npm/v/@regions-of-indonesia/client" /></a>
  <a href="https://bundlephobia.com/package/@regions-of-indonesia/client"><img src="https://img.shields.io/bundlephobia/minzip/@regions-of-indonesia/client" /></a>
</p>

<img src="https://hiiits.deno.dev/hit/regions-of-indonesia/client?" width="100%" heigth="10px" />

# Regions of Indonesia

Regions of Indonesia client. An API wrapper for dynamic API and static API.

## Features

- Zero dependency.
- First class Typescript support.
- Support both [Dynamic API][github:api] & [Static API][github:static-api].
- Middleware design.
- Cancelation control.
- Out of box support for data fetching libraries (swr, {react,solid,svelte,vue}-query).

## Types

```typescript
type CodeName = {
  code: string;
  name: string;
};

type RegionResult = {
  province?: CodeName;
  district?: CodeName;
  subdistrict?: CodeName;
  village?: CodeName;
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
# or
pnpm add @regions-of-indonesia/client
```

Usage

```typescript
// src/libs/client.ts

import { create } from "@regions-of-indonesia/client";

const client = create(/** options */);

await client.province.find() /** CodeName[] */;
await client.province.find.by("11") /** CodeName */;

await client.district.find("11") /** CodeName[] */;
await client.district.find.by("11.01") /** CodeName */;

await client.subdistrict.find("11.01") /** CodeName[] */;
await client.subdistrict.find.by("11.01.01") /** CodeName */;

await client.village.find("11.01.01") /** CodeName[] */;
await client.village.find.by("11.01.01.2001") /** CodeName */;

await client.region("11") /** RegionResult  */;
await client.region("11.01") /** RegionResult  */;
await client.region("11.01.01") /** RegionResult  */;
await client.region("11.01.01.2001") /** RegionResult  */;

await client.search("name") /** SearchResult */;

await client.search.provinces("name") /** CodeName[] */;
await client.province.search("name") /** CodeName[] */;

await client.search.districts("name") /** CodeName[] */;
await client.district.search("name") /** CodeName[] */;

await client.search.subdistricts("name") /** CodeName[] */;
await client.subdistrict.search("name") /** CodeName[] */;

await client.search.villages("name") /** CodeName[] */;
await client.village.search("name") /** CodeName[] */;
```

## Support

[![][support:ko-fi-button]][support:ko-fi]

[![][support:trakteer-button]][support:trakteer]

## LICENSE

GPL-3.0

<!-- exteral -->

[cover]: https://raw.githubusercontent.com/regions-of-indonesia/regions-of-indonesia/main/public/cover@2.png?sanitize=true
[logo]: https://raw.githubusercontent.com/regions-of-indonesia/regions-of-indonesia/main/public/logo@2.png?sanitize=true
[site]: https://regions-of-indonesia.netlify.app
[docs]: https://docs-regions-of-indonesia.netlify.app

<!-- github app -->

[github:api]: https://github.com/regions-of-indonesia/api
[github:static-api]: https://github.com/regions-of-indonesia/static-api
[github:site]: https://github.com/regions-of-indonesia/site
[github:docs]: https://github.com/regions-of-indonesia/docs

<!-- github client -->

[github:client]: https://github.com/regions-of-indonesia/client
[github:data]: https://github.com/regions-of-indonesia/data
[github:php-client]: https://github.com/regions-of-indonesia/php-client
[github:dart-client]: https://github.com/regions-of-indonesia/dart-client
[github:python-client]: https://github.com/regions-of-indonesia/python-client

<!-- github library -->

[github:localforage]: https://github.com/regions-of-indonesia/localforage
[github:swr]: https://github.com/regions-of-indonesia/swr
[github:react-query]: https://github.com/regions-of-indonesia/react-query
[github:solid-query]: https://github.com/regions-of-indonesia/solid-query
[github:vue-query]: https://github.com/regions-of-indonesia/vue-query
[github:svelte-query]: https://github.com/regions-of-indonesia/svelte-query

<!-- support -->

[support:ko-fi]: https://ko-fi.com/flamrdevs
[support:ko-fi-button]: https://flamrdevs.vercel.app/ko-fi.png
[support:trakteer]: https://trakteer.id/flamrdevs
[support:trakteer-button]: https://flamrdevs.vercel.app/trakteer.png
