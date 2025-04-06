import mongoose from "mongoose";

const MONGO_URI = process.env.MONGODB_URI;

const dbConnect = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("Connection successfull to database");
  } catch (error) {
    console.error("Database connection unsuccessfull", error);
  }
};

export default dbConnect;
