import mongoose, { Schema, Document, Types } from "mongoose";

export interface IToDoBase {
  nameTask: string;
  importanceValue?: number;
  taskGroup?: string;
  dueDate?: Date;
}

export interface IToDoDoc extends IToDoBase, Document {
  _id: Types.ObjectId;
}

const todoSchema = new Schema<IToDoDoc>({
  nameTask: { type: String, required: true, trim: true },
  importanceValue: Number,
  taskGroup: String,
  dueDate: Date,
}, { timestamps: true });

export const ToDo = mongoose.model<IToDoDoc>("IndividualTask", todoSchema);