const dns = require('dns');
dns.setServers(['8.8.8.8', '1.1.1.1']);
console.log('🚀 DNS forced to 8.8.8.8 and 1.1.1.1');

const express = require('express');
const cors = require('cors');
require('dotenv').config();

const connectDB = require('./config/db');
const authRoutes = require('./routes/auth');

const app = express();

app.use(cors({ origin: '*', credentials: true }));
app.use(express.json());

connectDB();

app.use('/api/auth', authRoutes);

app.get('/ping', (req, res) => res.send('pong'));
app.get('/', (req, res) => res.send('FORGE Backend is running!'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
