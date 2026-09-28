import { Type } from '@nestjs/common';
export declare function ApiStandardResponse<T>(model?: Type<T> | null, status?: number, description?: string, isArray?: boolean): <TFunction extends Function, Y>(target: TFunction | object, propertyKey?: string | symbol, descriptor?: TypedPropertyDescriptor<Y>) => void;
