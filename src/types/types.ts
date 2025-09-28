export type Code = string & {
  __sixDigits: true;
};

export type StoredCode = {
  value: Code;
  __newCode: boolean;
};
