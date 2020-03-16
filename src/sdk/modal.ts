export type CommonResult<T> = OkResult<T>|ErrResult;

export interface OkResult<T>  {
    ok: true
    status: number
    data: T
}

export interface ErrResult {
    ok: false
    status: number
    data: string
}
