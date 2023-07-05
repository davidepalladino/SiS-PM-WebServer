import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { AppInterceptor } from "./app.interceptor";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalInterceptors(new AppInterceptor());

  const config = new DocumentBuilder()
    .setTitle("SiS-PM WebServer")
    .setDescription(
      "This WebServer application provides an useful way to manage a USB controlled powerstrips produced by GEMBIRD LTD."
    )
    .setVersion("1.0")
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup("api/docs", app, document);

  await app.listen(3000);
}
bootstrap();
