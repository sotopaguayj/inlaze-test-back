import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app/app.module";
import { Logger, ValidationPipe } from "@nestjs/common";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";

async function bootstrap(): Promise<void> {
  const logger = new Logger("Inlaze Test");
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );
  const config = new DocumentBuilder()
    .setTitle("Inlaze Test")
    .setDescription("The Inlaze jobs technical test")
    .setVersion("1.0")
    .addBearerAuth({
      type: "http",
      scheme: "bearer",
      bearerFormat: "JWT",
    })
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup("api", app, document);
  app.enableCors();

  await app.listen(process.env.APP_PORT || 3001);
  logger.log(`Server running on port ${process.env.APP_PORT}`);
}
void bootstrap();
