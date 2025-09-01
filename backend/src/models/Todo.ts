import mongoose, { Document, Schema } from "mongoose";

export interface IToDo extends Document {
  nameTask: string;
  importanceValue?: number;
  taskGroup?: string;
  dueDate?: Date;
}

const todoSchema: Schema<IToDo> = new Schema({
  nameTask: { type: String, required: true, trim: true },
  importanceValue: { type: Number },
  taskGroup: { type: String },
  dueDate: { type: Date }
});

export const ToDo = mongoose.model<IToDo>("IndividualTask", todoSchema);