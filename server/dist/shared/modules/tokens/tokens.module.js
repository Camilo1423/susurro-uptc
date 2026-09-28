var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var TokensModule_1;
import { Global, Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AccessTokenStrategy } from './strategies/access-token.strategy.js';
import { AccessTokenLenientStrategy } from './strategies/access-token-lenient.strategy.js';
import { RefreshTokenStrategy } from './strategies/refresh-token.strategy.js';
import { TokensService } from './tokens.service.js';
const STRATEGY_PROVIDERS = {
    access: AccessTokenStrategy,
    'access-lenient': AccessTokenLenientStrategy,
    refresh: RefreshTokenStrategy,
};
let TokensModule = TokensModule_1 = class TokensModule {
    static forRoot(options = {}) {
        const strategies = options.strategies ?? ['access', 'refresh'];
        const strategyProviders = strategies.map((s) => STRATEGY_PROVIDERS[s]);
        return {
            module: TokensModule_1,
            imports: [
                PassportModule.register({ defaultStrategy: 'jwt' }),
                JwtModule.register({}),
            ],
            providers: [TokensService, ...strategyProviders],
            exports: [TokensService],
        };
    }
};
TokensModule = TokensModule_1 = __decorate([
    Global(),
    Module({})
], TokensModule);
export { TokensModule };
//# sourceMappingURL=tokens.module.js.map