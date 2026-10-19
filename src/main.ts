import { NestFactory } from '@nestjs/core';

import { AppModule } from './app.module';

import { NestExpressApplication } from '@nestjs/platform-express';

import { ValidationPipe } from '@nestjs/common';


import * as bodyParser from 'body-parser';

import * as dotenv from 'dotenv';

import * as express from 'express';

import * as path from 'path';

dotenv.config();

async function bootstrap() {

  const app =
    await NestFactory.create<NestExpressApplication>(
      AppModule,
    );


  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // =====================================================
  // CORS
  // =====================================================

  app.enableCors({

    origin: [
      'http://localhost:5173',
      'http://192.168.100.80:3002',
    ],

    methods: [
      'GET',
      'POST',
      'PUT',
      'PATCH',
      'DELETE',
      'OPTIONS',
    ],

    credentials: true,
  });


  // =====================================================
  // BODY PARSER
  // =====================================================

  app.use(
    bodyParser.json({
      limit: '10mb',
    }),
  );

  app.use(
    bodyParser.urlencoded({
      limit: '10mb',
      extended: true,
    }),
  );


  // =====================================================
  // ARCHIVOS ESTÁTICOS
  // =====================================================

  const uploadsPath =
    path.resolve(
      __dirname,
      '..',
      'uploads',
    );

  app.use(
    '/uploads',
    express.static(
      uploadsPath,
    ),
  );


  const publicPath =
    path.resolve(
      __dirname,
      '..',
      'public',
    );

  app.use(express.static(publicPath,),);


  // =====================================================
  // FALLBACK PARA REACT
  // =====================================================

  app.use(
    (req, res, next) => {

      const apiRoutes = [
        '/auth',
        '/events',
        '/news',
        '/notifications',
        '/employee',
        '/public/employees',
        '/users',
        '/birthday-image',
        '/uploads',
      ];

      const isApiRoute = apiRoutes.some((route) => req.originalUrl.startsWith(route,),);

      if (isApiRoute) {
        return next();
      }

      /*
       * Si no es una ruta de API,
       * devolvemos la aplicación React.
       */
      return res.sendFile(
        path.join(publicPath, 'index.html'),
        (error) => {
          if (error && !res.headersSent) {
            res.status(404).json({
              statusCode: 404,
              message: 'Ruta no encontrada',
            });
          }
        },
      );
    },
  );

  // =====================================================
  // SERVIDOR
  // =====================================================

  const PORT = Number(process.env.PORT,) || 3002;
  const HOST = process.env.HOST || '0.0.0.0';

  await app.listen(PORT,HOST,);

  console.log(
    `Servidor corriendo en http://${HOST}:${PORT}`,
  );
}

bootstrap();