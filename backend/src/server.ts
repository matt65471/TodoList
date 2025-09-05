// server.ts
import "dotenv/config";           // load .env (MONGO_URI, PORT)
import app from "./app";
import { connectDB } from "./config/db"; // your connect(uri) helper

const PORT = Number(process.env.PORT ?? 4000);

async function main() {
  await connectDB();
  app.listen(PORT, () => {
    console.log(`🚀 Server listening on http://localhost:${PORT}`);
  });
}

main().catch((err) => {
  console.error("Fatal startup error:", err);
  process.exit(1);
});
