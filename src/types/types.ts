export type Code = string & {
  __sixDigits: true;
};

export type StoredCode = {
  value: Code;
  __newCode: boolean;
};

export interface SignUpUserConfig {
	email: string;
	username?: string;
	birthday?: { day: number; month: number; year: number };
	password?: string;
}