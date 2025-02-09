import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Swagger default 
  const config = new DocumentBuilder()
    .setTitle('Library Management API')
    .setDescription('Documentation for Library Management API')
    .setVersion('1.0')    
    .addBearerAuth() // Si usas autenticación JWT, si se desea mas adelante
    .build();

  const document = SwaggerModule.createDocument(app, config);

  // Agregar respuestas de error globales
  document.components.responses = {
    Unauthorized: {
      description: 'No autorizado',
    },
    Forbidden: {
      description: 'Prohibido',
    },
  };

  SwaggerModule.setup('api', app, document);

  await app.listen(process.env.PORT ?? 3000);

}
bootstrap();
