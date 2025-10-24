import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { VersioningType } from '@nestjs/common';
import * as bodyParser from 'body-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // ✅ Manual OPTIONS preflight handling (ensures Render/Nest handles it)
app.use((req, res, next) => {
  const allowedOrigins = [
    'https://health-tech-ui.vercel.app',
    'http://localhost:3000', // add more origins here
  ];

  const origin = req.headers.origin;
  if (origin && allowedOrigins.includes(origin)) {
    res.header('Access-Control-Allow-Origin', origin);
  }

  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Credentials', 'true');

  if (req.method === 'OPTIONS') {
    return res.sendStatus(204);
  }
  next();
});

  // ✅ Enable CORS dynamically
app.enableCors({
  origin: (origin, callback) => {
    const allowedOrigins = [
      'https://health-tech-ui.vercel.app',
      'http://localhost:3000', // new origin
    ];

    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
  preflightContinue: false,
  optionsSuccessStatus: 204,
});

  // ✅ Enable API versioning
  app.enableVersioning({
    type: VersioningType.URI, // /v1/...
    defaultVersion: '1',
  });

  // ✅ Start server
  const port = process.env.PORT ?? 8000;
   app.use(
    '/api/webhook',
    bodyParser.raw({ type: 'application/json' }),
  );


  await app.listen(port, '0.0.0.0');

  
  console.log(`Server running on port ${port}`);
}


bootstrap();
