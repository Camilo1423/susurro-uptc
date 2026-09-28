export declare class ApiResponseDto<T> {
    statusCode: number;
    message: string;
    data: T;
    constructor(partial: Partial<ApiResponseDto<T>>);
}
