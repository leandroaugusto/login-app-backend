import mongoose from "mongoose";

const connectDB = async () => {
  const databaseURI = process.env.DB_URI as string;

  try {
    if (!databaseURI)
      throw new Error(
        "You must provide a valid environment variable `DB_URI` in .env file",
      );

    await mongoose.connect(databaseURI, {});

    console.log("MongoDB connected");
  } catch (err) {
    if (err instanceof Error) {
      console.error(err.message);
    } else {
      console.error("Unknow error", err);
    }
    process.exit(1);
  }
};

export default connectDB;
