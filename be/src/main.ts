import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import envConfig from './common/config';

import  cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(cookieParser());
  app.enableCors({
    // origin: envConfig.FRONTEND_URL || 'http://localhost:3000',
    origin: true,
    credentials: true,
  });
  const port = envConfig.PORT  || 3001;
  await app.listen(port);
  console.log("Server running on port:", port);
}
bootstrap();
