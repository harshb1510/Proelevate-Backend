export interface IError {
    data: String | Object[] | String[] | undefined,
    message: String,
    meta: {
        error: boolean
    }
}