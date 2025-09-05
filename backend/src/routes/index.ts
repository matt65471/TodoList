// routes/index.ts
import { Router } from "express";
import todoRouter from "./todo.routes"; // adjust path/name if yours differs

const router = Router();



// Mount feature routers
router.use("/todos", todoRouter); // → /api/todos/...

export default router;
