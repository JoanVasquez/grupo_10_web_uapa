export type User = {
  id?: string;
  email: string;
  username: string;
  password: string;
  is_active?: boolean;
};

export type Auth = {
  email: string;
  password: string;
};
