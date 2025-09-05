import mongoose from "mongoose";

export async function connect(uri: string): Promise<void> {
  try {
    mongoose.set("strictQuery", true);
    await mongoose.connect(uri);
    console.log("✅ Mongo connected");
  } catch (err) {
    console.error("❌ Mongo connection error:", err);
    process.exit(1); // now recognized by TS
  }
}