// app.ts
import express, { NextFunction, Request, Response } from "express";
import routes from "./routes"; // ← routes/index.ts

const app = express();

// Parse JSON bodies
app.use(express.json());

// Mount all API routes at /api
app.use("/api", routes);

// 404 (must be after routes)
app.use((req, res) => {
  res.status(404).json({ message: "Not Found" });
});

// Centralized error handler (must have 4 args)
app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
  console.error(err);
  // You can branch on known errors here (ValidationError, CastError, etc.)
  res.status(500).json({ message: "Internal Server Error" });
});

export default app;
