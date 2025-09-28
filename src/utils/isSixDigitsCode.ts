import { Code } from "../types/types.js";

export function isSixDigitsCode(s: string): Code {
  if (!/^\d{6}$/.test(s)) throw new Error("Not a 6-digit string, got: " + s);
  return s as Code;
}
