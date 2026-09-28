import { DynamicModule } from '@nestjs/common';
export type TokenStrategy = 'access' | 'access-lenient' | 'refresh';
export interface TokensModuleOptions {
    strategies?: TokenStrategy[];
}
export declare class TokensModule {
    static forRoot(options?: TokensModuleOptions): DynamicModule;
}
