export const mongoConfig = {
  uri: process.env.MONGODB_URI || 'mongodb://localhost:27017/japasea',
  options: {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    maxPoolSize: 10,
    serverSelectionTimeoutMS: 5000,
  }
};
