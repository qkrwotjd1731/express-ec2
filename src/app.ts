import express from 'express';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import morgan from 'morgan';

import _s3 from './s3.js';
import prisma from './config/prisma-client.js';

const app = express();
app.use(helmet());
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    origin: process.env.CORS_ORIGIN?.split(','),
    credentials: true,
  })
);

if (process.env.NODE_ENV === 'production') {
  app.use(morgan('combined'));
} else {
  app.use(morgan('dev'));
}

const addCustomer = () => {
  return prisma.customer.create({
    data: {
      // id: 4,
      name: 'Kim Code',
      email: 'kimcode@example.com',
    },
  });
};

const customer = await addCustomer();
console.log(customer);

app.get('/health', (req, res) => {
  res.status(200).send({ message: 'OK' });
});

app.get('/hello', (req, res) => {
  res.json({ message: 'success' });
});

app.listen(process.env.PORT, () => console.log('Server Started'));
