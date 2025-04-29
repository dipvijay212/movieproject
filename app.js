const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');
const cookieParser = require('cookie-parser'); 

const authRoutes = require('./routes/authRoutes');
const movieRoutes = require('./routes/movieRoutes');

dotenv.config();
connectDB();

const app = express();

app.use(cors({
    origin: 'http://localhost:5173', // your frontend URL
    credentials: true, // ✅ allow cookies
  }));
app.use(express.json());
app.use(cookieParser()); 

app.use('/auth', authRoutes);
app.use('/movies', movieRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
