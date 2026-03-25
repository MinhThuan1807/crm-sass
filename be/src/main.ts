import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import envConfig from './common/config';

import  cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(cookieParser());
  app.enableCors({
    origin: envConfig.FRONTEND_URL || 'http://localhost:3000',
    credentials: true,
  });
  await app.listen(process.env.PORT ??' https://crm-sass-production.up.railway.app/');

}
bootstrap();
