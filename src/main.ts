import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors(); // Giúp Next.js có thể gọi API nếu cần
  await app.listen(process.env.PORT ?? 3001); // Đổi thành 3001 để tránh trùng với Next.js (3000)
}
bootstrap();
