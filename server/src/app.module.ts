import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { configuration } from './shared/config/configuration.js';
import { BucketModule } from './shared/modules/bucket/index.js';
import { PrismaModule } from './shared/modules/prisma/index.js';
import { RedisModule } from './shared/modules/redis/index.js';
import { TokensModule } from './shared/modules/tokens/index.js';
import { PresenceModule } from './shared/providers/presence/index.js';
import { CookieToBearerMiddleware } from './shared/middleware/cookie-to-bearer.middleware.js';
import { AccountModule } from './account/account.module.js';
import { AuthModule } from './auth/auth.module.js';
import { AvatarsModule } from './avatars/avatars.module.js';
import { ConversationsModule } from './conversations/conversations.module.js';
import { DocumentTypesModule } from './document-types/document-types.module.js';
import { HealthModule } from './health/health.module.js';
import { SocketModule } from './socket/socket.module.js';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, load: [configuration] }),
    EventEmitterModule.forRoot(),

    // Infraestructura (global)
    PrismaModule,
    RedisModule,
    BucketModule,
    PresenceModule,
    TokensModule.forRoot({
      strategies: ['access', 'access-lenient', 'refresh'],
    }),

    // Módulos de dominio
    HealthModule,
    AuthModule,
    AccountModule,
    AvatarsModule,
    ConversationsModule,
    DocumentTypesModule,
    SocketModule,
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    // Copia el token de cookies httpOnly al header Authorization para que las
    // estrategias de Passport funcionen con cookies (?rf=true → refresh).
    consumer.apply(CookieToBearerMiddleware).forRoutes('*');
  }
}
