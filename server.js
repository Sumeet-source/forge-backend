const dns = require('dns');
try {
    // Only force DNS if we are NOT on Railway
    if (!process.env.RAILWAY_ENVIRONMENT) {
        dns.setServers(['8.8.8.8', '1.1.1.1']);
        console.log('🚀 Local DNS forced to 8.8.8.8');
    }
} catch (err) {
    // If Railway blocks it, the app won't crash! It will just log this.
    console.log('ℹ️ DNS override skipped (running on Railway or blocked)');
}

const express = require('express');
const cors = require('cors');
require('dotenv').config();

const connectDB = require('./config/db');
const authRoutes = require('./routes/auth');

const app = express();

app.use(cors({ origin: '*', credentials: true }));
app.use(express.json());

console.log('🔥 Server is about to connect to DB...'); // <-- Added this so Railway shows a log!
connectDB();

app.use('/api/auth', authRoutes);

app.get('/ping', (req, res) => res.send('pong'));
app.get('/', (req, res) => res.send('FORGE Backend is running!'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
