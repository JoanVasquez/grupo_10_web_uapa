export type ApiErrorData = {
  _message?: string;
};

export type Login = {
  _timeStamp: string;
  _statusCode: number;
  _status: string;
  _data: {
    token: string;
  };
};

export type Response<TData = unknown> = {
  _timeStamp: string;
  _statusCode: number;
  _status: string;
  _message?: string;
  _data: TData;
};

export type ApiMutationError = {
  status?: number;
  data?: ApiErrorData;
};
