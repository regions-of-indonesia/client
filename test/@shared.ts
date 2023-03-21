import { hasOwnProperties, isArray, isTypeofObject, isTypeofString } from "javascript-yesterday";

import type { CodeName } from "../src";

const isCodeName = (value: unknown): value is CodeName =>
  isTypeofObject(value) && hasOwnProperties(value, "code", "name") ? isTypeofString(value.code) && isTypeofString(value.name) : false;

const isCodeNameArray = (value: unknown): value is CodeName[] => isArray(value) && value.every(isCodeName);

export { isCodeName, isCodeNameArray };
