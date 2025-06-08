import mongoose from 'mongoose';

import 'dotenv/config';


const mongoURL = process.env.MONGO_URL;

mongoose.connect(mongoURL, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

const db = mongoose.connection;

db.on('connected', async () => {
    console.log('Connected to MongoDB server');

});

db.on('error', (err) => {
    console.error('Connection error to MongoDB server:', err);
});

db.on('disconnected', () => {
    console.log('Disconnected from MongoDB server');
});

export default db;
