import { hasOwnProperties, isArray, isTypeofObject, isTypeofString } from "javascript-yesterday";

import type { CodeName } from "../src";

function isCodeName(value: unknown): value is CodeName {
  if (isTypeofObject(value) && hasOwnProperties(value, "code", "name")) {
    const { code, name } = value;
    return isTypeofString(code) && isTypeofString(name);
  }

  return false;
}

function isCodeNameArray(value: unknown): value is CodeName[] {
  return isArray(value) && value.every(isCodeName);
}

export { isCodeName, isCodeNameArray };
