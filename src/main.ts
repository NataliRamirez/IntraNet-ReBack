import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import * as bodyParser from 'body-parser';
import * as dotenv from 'dotenv';
import { resolve, join } from 'path'; // Importamos 'join' y 'resolve'
import * as express from 'express'; // <--- IMPORTACIÓN NECESARIA
import * as path from 'path';

dotenv.config();

async function bootstrap() {
 const app = await NestFactory.create<NestExpressApplication>(AppModule);

//  CORS — permite acceso desde el frontend
//  CORS — permite acceso desde frontend local y producción
app.enableCors({
    origin: [
      'http://localhost:5173',         // Front local (React dev)
      'http://192.168.100.80:3002',   // Intranet desplegada en servidor
    ],
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    credentials: true,
  });  

 // Parseo de JSON y formularios grandes
 app.use(bodyParser.json({ limit: '10mb' }));
 app.use(bodyParser.urlencoded({ limit: '10mb', extended: true }));

 // 1.  RUTA ESTÁTICA FORZADA (Vía Express)
 // Usamos process.cwd() para obtener la ruta raíz del proyecto (IntraNet-Backend)
 // Esto es la forma más robusta de servir archivos estáticos con Express.


const uploadsPath = path.resolve(__dirname, '..', 'uploads');
app.use('/uploads', express.static(uploadsPath));

const publicPath = path.resolve(__dirname, '..', 'public');

app.use(express.static(publicPath));

app.use((req, res, next) => {
  const apiRoutes = [
    '/events',
    '/news',
    '/notifications',
    '/employes',
    '/birthday-image',
    '/uploads',
  ];

  const isApiRoute = apiRoutes.some(route =>
    req.originalUrl.startsWith(route),
  );

  if (isApiRoute) {
    return next();
  }

  res.sendFile(path.join(publicPath, 'index.html'));
});

 // Arranque del servidor
 const PORT = Number(process.env.PORT) || 3002;
 const HOST = process.env.HOST || '0.0.0.0'; // permite acceso desde otras PCs
 await app.listen(PORT, HOST);

  console.log(`Servidor corriendo en http://${HOST}:${PORT}`);
}

bootstrap();
