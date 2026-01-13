import express from 'express';
const app = express();
const port = 3000;
import connectDB from './db.js';
import authRoutes from './Routes/authRoutes.js';
connectDB();
app.use(express.json());
app.use('/api', authRoutes);
app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});