export type Code = string & {
  __sixDigits: true;
};

export type StoredCode = {
  value: Code;
  __newCode: boolean;
};

export type User = {
  email: string;
  username: string;
};

export type UsersConfig = {
  users: User[];
};
