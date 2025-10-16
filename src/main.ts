import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // Enable CORS for frontend communication - More permissive for development
  // app.enableCors({
  //   origin: true, // Allow all origins in development
  //   methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  //   allowedHeaders: '*',
  //   credentials: true,
  //   preflightContinue: false,
  //   optionsSuccessStatus: 204,
  // });

  app.enableCors({
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });
  // Global validation pipe - Simplified for now
  app.useGlobalPipes(new ValidationPipe({
    transform: true,
    skipMissingProperties: true,
  }));
  
  // Additional CORS middleware for edge cases
  app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    res.header('Access-Control-Allow-Headers', '*');
    res.header('Access-Control-Allow-Credentials', 'true');
    
    if (req.method === 'OPTIONS') {
      res.status(200).end();
      return;
    }
    next();
  });

  // Swagger configuration
  const config = new DocumentBuilder()
    .setTitle('WooCommerce Products Service')
    .setDescription('API for managing products from WooCommerce with filtering capabilities')
    .setVersion('1.0')
    .addTag('products', 'Product management operations')
    .addTag('segments', 'Product filtering and segmentation')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document, {
    customSiteTitle: 'WooCommerce Products API',
    customfavIcon: 'https://avatars.githubusercontent.com/u/54212428?s=200&v=4',
    customJs: [
      'https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.15.5/swagger-ui-bundle.min.js',
      'https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.15.5/swagger-ui-standalone-preset.min.js',
    ],
    customCssUrl: [
      'https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.15.5/swagger-ui.min.css',
    ],
  });

  const port = process.env.PORT ?? 8000;
  const host = process.env.HOST ?? '0.0.0.0';
  
  await app.listen(port, host);
  console.log(`Application is running on: http://${host}:${port}`);
  console.log(`Swagger documentation available at: http://${host}:${port}/api`);
}
bootstrap();
