import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors(); // Giúp Next.js có thể gọi API nếu cần
  
  if (process.env.VERCEL) {
    await app.init();
    return app.getHttpAdapter().getInstance();
  }
  
  await app.listen(process.env.PORT ?? 3001);
}

// Hàm Wrapper đặc biệt cho môi trường Serverless của Vercel
let cachedServer: any;
export default async function (req: any, res: any) {
  if (!cachedServer) {
    cachedServer = await bootstrap();
  }
  return cachedServer(req, res);
}
