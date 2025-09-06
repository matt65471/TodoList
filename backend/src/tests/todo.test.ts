import request from "supertest";
import app from "../app";
import mongoose from "mongoose";
import {ToDo} from "../models/Todo";

const ToDoData = {
    nameTask: "Test Task",
    importanceValue: 5,
    taskGroup: "Test Group",
    dueDate: new Date("2024-01-15")
}

describe("ToDo tests", () => {
    beforeAll(() => {
		jest.setTimeout(20000);
	});

    let certificateId: string;

    beforeEach(async () => {
		const certificate = (await ToDo.create(
			ToDoData
		)) as mongoose.Document & { _id: mongoose.Types.ObjectId };
		certificateId = certificate._id.toString();
	});

    it("should retrieve all ToDo tasks", async () => {
        const res = await request(app).get("/api/todos");
        expect(res.statusCode).toBe(200);
        expect(Array.isArray(res.body)).toBe(true);
        expect(res.body.length).toBeGreaterThan(0);
        expect(res.body[0]).toHaveProperty("nameTask", "Test Task");
        //expect(res.body[1]).toHaveProperty("importanceValue", 5);
        expect(res.body[2]).toHaveProperty("taskGroup", "Test Group");

    });

    
})