require('dotenv').config();
const express = require('express');
const connectDB = require('./config/db');
const cors = require('cors');

const PORT = process.env.PORT || 5000;
const app = express();

connectDB();

app.use(cors({ origin: '*' }));
app.use(express.json({ extended: false }));

app.get('/', (req, res) => {
  res.send('hnbg');
});

/* Define routes */
app.use('/api/articles', require('./routes/api/articles'));
app.use('/api/users', require('./routes/api/users'));
app.use('/api/auth', require('./routes/api/auth'));
app.use('/api/profile', require('./routes/api/profile'));

app.listen(PORT, () => console.log(`App is running at port: ${PORT}`));
