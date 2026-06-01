import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Global validation pipe — enforces DTOs automatically
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,       // Strip unknown properties
      forbidNonWhitelisted: true,
      transform: true,       // Auto-transform request body types
    }),
  );

  // CORS — allow Next.js dev server
  app.enableCors({
    origin: process.env.NODE_ENV === 'production'
      ? ['https://your-domain.com']
      : ['http://localhost:3000'],
    credentials: true,
  });

  // Swagger UI — available at /api/docs
  const config = new DocumentBuilder()
    .setTitle('Claude Code Mastery API')
    .setDescription('NestJS + Prisma + Supabase REST API')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  const port = process.env.PORT ?? 3001;
  await app.listen(port);
  console.log(`🚀 Server running at http://localhost:${port}`);
  console.log(`📚 Swagger docs at http://localhost:${port}/api/docs`);
}

bootstrap();
