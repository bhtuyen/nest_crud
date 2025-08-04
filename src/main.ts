import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { ClassSerializerInterceptor, UnprocessableEntityException, ValidationPipe } from '@nestjs/common';
import { LoggingInterceptor } from '@shared/interceptors/logging.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Tự động loại bỏ các trường không được khai báo Decorator
      forbidNonWhitelisted: true, // Nếu có trường không được khai báo Decorator thì trả về lỗi 422
      transform: true, // Tự động chuyển đổi dữ liệu vào class
      transformOptions: {
        enableImplicitConversion: true // Tự động chuyển đổi dữ liệu vào class
      },
      exceptionFactory: (errors) => {
        return new UnprocessableEntityException(
          errors.map(({ constraints, property }) => ({
            field: property,
            errors: Object.values(constraints!)
          }))
        );
      }
    })
  );
  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)), new LoggingInterceptor());
  await app.listen(process.env.PORT ?? 3000);
}

bootstrap().catch((err) => {
  console.error(err);
  process.exit(1);
});
