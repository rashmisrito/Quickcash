const mongoose = require('mongoose');

// This is used for connection database

const connectDB = async () => {
 try {
  const connectionInstance = await mongoose.connect(`${process.env.MONGO_DB_URI}`)
  console.log(`\n MongoDB connected !! DB HOST: ${connectionInstance.connection.host}`);
 } catch (error) {
  console.log("MONGODB connection FAILED ", error);
  process.exit(1)
 }
}

module.exports  = connectDB;
