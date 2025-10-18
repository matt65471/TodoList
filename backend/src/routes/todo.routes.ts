import express from "express";
import {
  listToDos,
  getTodoById,
  createToDo,
  updateToDo,
  deleteToDo,
  toggleTodoCompletion,
} from "../controller/TodoController.js";

const router = express.Router();

router.get("/", listToDos);        // list

router.post("/", createToDo);      // create

router.get("/:id", getTodoById);   // read

router.patch("/:id", updateToDo);  // update

router.patch("/:id/toggle", toggleTodoCompletion);  // toggle completion

router.delete("/:id", deleteToDo); // delete

export default router;