import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api/v1');
  await app.listen(Number(process.env.PORT) || 3003, '0.0.0.0');
  console.log(`🚀 http://localhost:${process.env.PORT || 3003}/api/v1`);
}
bootstrap();
