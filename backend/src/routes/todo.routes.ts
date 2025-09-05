import express from "express";
import {
  listToDos,
  getTodoById,
  createToDo,
  updateToDo,
  deleteToDo,
} from "../controller/TodoController";

const router = express.Router();

router.get("/", listToDos);        // list

router.post("/", createToDo);      // create

router.get("/:id", getTodoById);   // read

router.patch("/:id", updateToDo);  // partial update (use PUT for full replace)

router.delete("/:id", deleteToDo); // delete

export default router;