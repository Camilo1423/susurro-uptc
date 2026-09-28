var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { Module } from '@nestjs/common';
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
let AppModule = class AppModule {
    configure(consumer) {
        consumer.apply(CookieToBearerMiddleware).forRoutes('*');
    }
};
AppModule = __decorate([
    Module({
        imports: [
            ConfigModule.forRoot({ isGlobal: true, load: [configuration] }),
            EventEmitterModule.forRoot(),
            PrismaModule,
            RedisModule,
            BucketModule,
            PresenceModule,
            TokensModule.forRoot({
                strategies: ['access', 'access-lenient', 'refresh'],
            }),
            HealthModule,
            AuthModule,
            AccountModule,
            AvatarsModule,
            ConversationsModule,
            DocumentTypesModule,
            SocketModule,
        ],
    })
], AppModule);
export { AppModule };
//# sourceMappingURL=app.module.js.map