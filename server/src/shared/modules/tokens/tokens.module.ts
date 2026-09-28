import { DynamicModule, Global, Module, Provider, Type } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AccessTokenStrategy } from './strategies/access-token.strategy.js';
import { AccessTokenLenientStrategy } from './strategies/access-token-lenient.strategy.js';
import { RefreshTokenStrategy } from './strategies/refresh-token.strategy.js';
import { TokensService } from './tokens.service.js';

export type TokenStrategy = 'access' | 'access-lenient' | 'refresh';

const STRATEGY_PROVIDERS: Record<TokenStrategy, Type> = {
  access: AccessTokenStrategy,
  'access-lenient': AccessTokenLenientStrategy,
  refresh: RefreshTokenStrategy,
};

export interface TokensModuleOptions {
  /** Estrategias de Passport a registrar. Por defecto `['access', 'refresh']`. */
  strategies?: TokenStrategy[];
}

@Global()
@Module({})
export class TokensModule {
  static forRoot(options: TokensModuleOptions = {}): DynamicModule {
    const strategies = options.strategies ?? ['access', 'refresh'];
    const strategyProviders: Provider[] = strategies.map(
      (s) => STRATEGY_PROVIDERS[s],
    );

    return {
      module: TokensModule,
      imports: [
        PassportModule.register({ defaultStrategy: 'jwt' }),
        JwtModule.register({}),
      ],
      providers: [TokensService, ...strategyProviders],
      exports: [TokensService],
    };
  }
}
