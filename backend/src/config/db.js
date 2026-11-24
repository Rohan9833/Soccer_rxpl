import mongoose from 'mongoose';

export async function connectDB(uri) {
  if (!uri) {
    throw new Error('MONGODB_URI is not set. Copy .env.example to .env and add your MongoDB connection string.');
  }
  mongoose.set('strictQuery', true);
  await mongoose.connect(uri, { serverSelectionTimeoutMS: 10000 });
  console.log(`[db] connected to MongoDB (${mongoose.connection.name})`);

  mongoose.connection.on('error', (err) => console.error('[db] connection error:', err.message));
  mongoose.connection.on('disconnected', () => console.warn('[db] disconnected'));
  return mongoose.connection;
}

export const isDbReady = () => mongoose.connection.readyState === 1;
