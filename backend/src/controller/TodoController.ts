import {Request, Response} from "express";
import {ToDo} from "../models/Todo"
import {Types} from "mongoose"

// Gets all the ToDos
// ToDo: Add filter for 
export async function listToDos(req: Request, res: Response): Promise<void> {
  try {
    const filters = req.query;
    const todos = await ToDo.find(filters).lean();
    res.status(200).json(todos);
  } catch (error) {
    res.status(500).json({ message: "Error fetching todos", error });
  }
}

// Gets ToDos by id
export async function getTodoById(req: Request, res: Response): Promise<void> {
  try {
    const { id } = req.params;

    // 1) Validate ObjectId
    if (!Types.ObjectId.isValid(id)) {
      res.status(400).json({ success: false, message: "Invalid id format" });
      return;
    }

    // 2) Query
    const todo = await ToDo.findById(id).lean(); // .lean() returns plain objects (faster)

    // 3) Not found
    if (!todo) {
      res.status(404).json({ success: false, message: "Task not found" });
      return;
    }

    // 4) Success — return the document
    res.status(200).json({
      success: true,
      data: todo,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: `Error fetching ToDo task with id: ${req.params.id}`,
    });
  }
}

// Create a new ToDo
export async function createToDo(req: Request, res: Response): Promise<void>{
  try{
    const {nameTask, importanceValue, taskGroup, dueDate} = req.body;

    if (!nameTask || typeof nameTask !== "string") {
      res.status(400).json({ success: false, message: "nameTask is required" });
      return;
    }

    const created = await ToDo.create({
      nameTask,
      importanceValue,
      taskGroup,
      dueDate
    });
    res.status(201).json({
      success: true,
      message: `Created todo with id`,
      id: `${created._id}`
    })
  }
  catch(error){
    res.status(500).json({
      success: false,
      message: `Failed creating a todo`
    })
  }
}

// Update an existing todo
export async function updateToDo(req: Request, res: Response): Promise<void>{
  try{
    const {id} = req.params;
    const updates = req.body;

    if (!Types.ObjectId.isValid(id)) {
      res.status(400).json({ success: false, message: "Invalid todo id" });
      return;
    }

    const updated = await ToDo.findByIdAndUpdate(id, updates, {
      new: true,
      runValidators: true, 
    })

    if (!updated) {
      res.status(404).json({ success: false, message: "Task not found" });
      return;
    }

    res.status(200).json({ success: true, data: updated });

  }
  catch(Error){
    res.status(500).json({
      success: false,
      message: `Failed updating todo with ${req.params}`
    })
  }
}

// Delete an existing ToDo
export async function deleteToDo(req: Request, res: Response): Promise<void>{
  try{
    const {id} = req.params;
    if (!Types.ObjectId.isValid(id)) {
      res.status(400).json({ success: false, message: "Invalid todo id" });
      return;
    }
    const deleted = await ToDo.findByIdAndDelete(id)
    if (!deleted){
      res.status(404).json({success: false, mesage: "Task not found while deleting"});
    }
    res.status(200).json({success: true, message: `${id} todo has been deleted`})
  }
  catch(Error){
    res.status(500).json({
      success: false,
      message: `Failed updating todo with id ${req.params}`
    })
  }
}