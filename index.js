const express = require('express');
require('dotenv').config();

const bodyParser = require('body-parser');
const authRoutes = require('./routes/authRoutes');
const dbConnection = require('./DB/dbConnection.js'); //Import the function
const cors = require('cors');

const PORT = process.env.PORT || 5000;
const app = express();

// app.use(bodyParser.json());

app.use(express.json());
app.use(cors());

//Routes
app.use('/api/auth', authRoutes);

// Connect to MongoDB
dbConnection();

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
