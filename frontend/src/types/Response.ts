export type Login = {
    _timeStamp: string;
    _statusCode: number;
    _status: string;
    _data: {
        token: string;
    }
}

export type Response = {
     _timeStamp: string;
    _statusCode: number;
    _status: string;
    _data: unknown;
}
