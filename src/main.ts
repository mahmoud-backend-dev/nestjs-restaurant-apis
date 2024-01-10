import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe, VersioningType } from '@nestjs/common';
import { ErrorHandlerExceptionFilter } from './filters/error-handler-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api');
  app.enableVersioning({ type: VersioningType.URI })
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true, // Enable automatic transformation and validation of payload data
      transformOptions: {
        strategy: "exposeAll", // Expose all properties in the metadata
      }
    }),
  );
  app.useGlobalFilters(new ErrorHandlerExceptionFilter());
  await app.listen(1812);
}
bootstrap();
