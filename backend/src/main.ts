import { CorsOptions } from '@nestjs/common/interfaces/external/cors-options.interface';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import cookieParser from 'cookie-parser';
import { json, urlencoded } from 'express';
import helmet from 'helmet';
import { AppModule } from './app.module';
import EnvKey from './common/configs/env';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  const configService: ConfigService = app.get(ConfigService);

  app.use(helmet());
  app.use(cookieParser());

  // Setup prefix of all routes
  app.setGlobalPrefix(configService.get(EnvKey.BASE_PATH));

  // Setup cors
  const corsOptions: CorsOptions = {
    origin: configService.get(EnvKey.CORS_WHITE_LIST),
    allowedHeaders: [
      'Content-Type',
      'Authorization',
      'accept-language',
      'X-Timezone',
      'X-Timezone-Name',
    ],
    optionsSuccessStatus: 200,
    methods: ['GET', 'POST', 'PATCH', 'DELETE', 'HEAD', 'OPTIONS'],
  };
  app.enableCors(corsOptions);

  // Setup Swagger
  const swaggerConfig = new DocumentBuilder()
    .setTitle('Document')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'JWT',
        description: 'Enter JWT token',
        in: 'header',
      },
      'JWT-auth', // This name here is important for matching up with @ApiBearerAuth() in your controller!
    )
    .build();
  const swaggerDocument = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('api', app, swaggerDocument);

  // Limit request size
  app.use(json({ limit: configService.get(EnvKey.MAX_REQUEST_SIZE) }));
  app.use(
    urlencoded({
      limit: configService.get(EnvKey.MAX_REQUEST_SIZE),
      extended: true,
    }),
  );

  await app.listen(configService.get(EnvKey.PORT));
}

bootstrap();
