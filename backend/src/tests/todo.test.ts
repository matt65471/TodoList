import request from "supertest";
import app from "../app";
import mongoose from "mongoose";
import {ToDo} from "../models/Todo";
import { stringify } from "querystring";

const ToDoData1 = {
    nameTask: "Test Task",
    importanceValue: 5,
    taskGroup: "Test Group",
    dueDate: new Date("2024-01-15")
}
const ToDoData2 = {
    nameTask: "Test Task 2",
    importanceValue: 10,
    taskGroup: "Test Group 2",
    dueDate: new Date("2024-01-20")
}


describe("ToDo tests", () => {
    beforeAll(() => {
		jest.setTimeout(20000);
	});

    let toDoID1: string;
    let toDoID2: string;

    beforeEach(async () => {
		const toDo1 = (await ToDo.create(
			ToDoData1,
            
		)) as mongoose.Document & { _id: mongoose.Types.ObjectId };
		toDoID1 = toDo1._id.toString();
        const toDo2 = (await ToDo.create(
			ToDoData2,
		)) as mongoose.Document & { _id: mongoose.Types.ObjectId };
		toDoID2 = toDo2._id.toString();
	});

    it("should retrieve all ToDo tasks", async () => {
        const res = await request(app).get("/api/todos");
        expect(res.status).toBe(200);

        const list = Array.isArray(res.body) ? res.body : res.body.data;
        expect(Array.isArray(list)).toBe(true);

        expect(list).toEqual(
            expect.arrayContaining([
                expect.objectContaining({ nameTask: "Test Task", importanceValue: 5, taskGroup: "Test Group" }),
                expect.objectContaining({nameTask: "Test Task 2", importanceValue: 10, taskGroup: "Test Group 2"})
            ])
        );
    });

    it("it should retrieve ToDo Task by filter for name task", async() =>{
        const res = await request(app).get("/api/todos?taskGroup=Test%20Group");
        expect(res.status).toBe(200);
        const list = Array.isArray(res.body) ? res.body : res.body.data;
        expect(Array.isArray(list)).toBe(true);

        expect(list).toEqual(
            expect.arrayContaining([
                expect.objectContaining({ nameTask: "Test Task"})
            ])
        );
    })


    
})