export type User = {
  id?: number;
  email: string;
  username: string;
  password: string;
  is_active?: boolean;
};

export type Auth = {
  email: string;
  password: string;
};
