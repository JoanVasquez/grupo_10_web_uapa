export type User = {
  id?: number;
  email: string;
  username: string;
  password: string;
  is_active?: boolean;
  [key: string]: string | number | boolean | undefined;
};

export type Auth = {
  email: string;
  password: string;
  [key: string]: string | number | boolean | undefined;
};
