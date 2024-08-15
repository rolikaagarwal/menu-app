require('dotenv').config();
import express from 'express';
import mongoose from 'mongoose';
import categoryController from './controller/categoryController';
import subCategoryController from './controller/subCategoryController'
import itemsController from './controller/itemsController'
import bodyParser from 'body-parser';
import cors from 'cors';

const app = express();
const PORT = process.env.PORT || 3000;
const source = process.env.MONGO_URI || "";
const allowedOrigins = ['http://localhost:3000', 'https://menu-app-frontend.vercel.app'];

app.use(cors({
  origin: function (origin, callback) {
    if (allowedOrigins.indexOf(origin || "") !== -1 || !origin) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
}));


app.use(bodyParser.json());

mongoose.connect(source)
  .then(() => {
    console.log('DB connected');
  })
  .catch((err) => {
    console.error('Error connecting to DB:', err);
  });

app.use('/api', categoryController);
app.use('/api', subCategoryController);
app.use('/api', itemsController)

app.get('/', (req, res) => {
  res.send('Hello, welcome to hotel menu');
});

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});