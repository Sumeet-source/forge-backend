const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const app = express();

app.options('*', cors({ origin: '*', credentials: true }));
app.use(cors({ origin: '*', credentials: true }));
app.use(express.json());

// --- DATABASE CONNECTION ---
const MONGO_URI = process.env.MONGO_URI || 'mongodb://dhakad458669_db_user:f1xRo9VUjGwPtsu@cluster0-shard-00-00.alwcqf.mongodb.net:27017,cluster0-shard-00-01.alwcqf.mongodb.net:27017,cluster0-shard-00-02.alwcqf.mongodb.net:27017/forge_db?ssl=true&authSource=admin&retryWrites=true&w=majority&connectTimeoutMS=30000';

const connectDB = async () => {
    try {
        const options = { family: 4, serverSelectionTimeoutMS: 30000 };
        await mongoose.connect(MONGO_URI, options);
        console.log('✅ MongoDB Connected Successfully');
    } catch (error) {
        console.error('❌ MongoDB connection error:', error);
        process.exit(1);
    }
};
connectDB();

// --- USER SCHEMA ---
const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  isAdmin: { type: Boolean, default: false }
}, { timestamps: true });

const User = mongoose.model('User', UserSchema);

// --- SIGNUP ROUTE ---
app.post('/api/auth/signup', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: 'User already exists' });

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({ name, email, password: hashedPassword });
    await newUser.save();

    const token = jwt.sign(
      { id: newUser._id, isAdmin: newUser.isAdmin },
      'super_secret_key_for_forge',
      { expiresIn: '1d' }
    );

    res.status(201).json({ message: 'User created!', token, user: { id: newUser._id, name, email } });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// --- LOGIN ROUTE ---
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'Invalid credentials' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

    const token = jwt.sign(
      { id: user._id, isAdmin: user.isAdmin },
      'super_secret_key_for_forge',
      { expiresIn: '1d' }
    );

    res.json({ token, user: { id: user._id, name: user.name, email, isAdmin: user.isAdmin } });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// --- KEEP-ALIVE ROUTE ---
app.get('/ping', (req, res) => res.send('pong'));

app.get('/', (req, res) => res.send('FORGE Backend is running!'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));