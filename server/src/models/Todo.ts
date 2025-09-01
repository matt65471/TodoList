import mongoose from "mongoose";

const { Schema, Document, Model } = mongoose;

export interface IToDo extends Document {
    nameTask: string;
    importanceValue: number;
    taskGroup: string;
    dueDate: Date;
}
