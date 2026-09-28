import { Logger, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import cookieParser from 'cookie-parser';
import { AppModule } from './app.module.js';
function setupSwagger(app, urlSwagger) {
    const config = new DocumentBuilder()
        .setTitle('anomChat — API')
        .setDescription('API de anomChat: autenticación (sign-in, refresh, who-am-i, sign-out), ' +
        'sesiones, usuarios y tipos de documento.')
        .setVersion('1.0')
        .addBearerAuth({ type: 'http', scheme: 'bearer', bearerFormat: 'JWT' }, 'access-token')
        .addBearerAuth({ type: 'http', scheme: 'bearer', bearerFormat: 'JWT' }, 'refresh-token')
        .build();
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup(urlSwagger, app, document, {
        jsonDocumentUrl: `${urlSwagger}.json`,
    });
}
async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    const configService = app.get(ConfigService);
    app.setGlobalPrefix('api');
    app.use(cookieParser());
    app.useGlobalPipes(new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
    }));
    app.enableCors({
        origin: configService.getOrThrow('corsOrigins'),
        credentials: true,
        methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
        allowedHeaders: ['Content-Type', 'Authorization'],
    });
    const env = configService.getOrThrow('env');
    const urlSwagger = configService.getOrThrow('urlSwagger');
    if (env === 'development')
        setupSwagger(app, urlSwagger);
    const port = configService.getOrThrow('port');
    await app.listen(port, '0.0.0.0');
    new Logger('Bootstrap').log(`anomChat API running on port ${port} [${env}]`);
}
await bootstrap();
//# sourceMappingURL=main.js.map