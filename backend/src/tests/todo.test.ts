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
    let toDoID3: string

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

    it("it should retrieve ToDo Task by id", async () =>{
        const res = await request(app).get(`/api/todos/${toDoID1}`);
        expect(res.status).toBe(200)

        expect(res.body).toEqual(
            expect.objectContaining({
                data: expect.objectContaining({
                nameTask: 'Test Task',
                importanceValue: 5,
                taskGroup: 'Test Group',
                }),
            })
        );
    })

    it('it should create a new ToDo task', async () => {
        const payload = {
            nameTask: 'Test Task 3',
            importanceValue: 15,     // adjust if your schema restricts range (e.g. 1–10)
            taskGroup: 'Test Group 3',
            dueDate: '2024-02-20',   // strings are safest; Dates will be serialized anyway
        };

        const res = await request(app)
            .post('/api/todos')
            .send(payload)
            .set('Content-Type', 'application/json')
            .expect(201)
            .expect('Content-Type', /json/);
        
        
        
        expect(res.status).toBe(201)

        toDoID3 = res.body.id;

        const getRes = await request(app).get(`/api/todos/${toDoID3}`)

        expect(getRes.body).toEqual(
            expect.objectContaining({
                data:expect.objectContaining({
                    nameTask: 'Test Task 3',
                    importanceValue: 15,
                    taskGroup: 'Test Group 3'
                }),
            })
        )
    })

    it('it should update the ToDo task', async () =>{

        const payload = {
            nameTask: "Test Task Update",
            importanceValue: 2
        }

        const res = await request(app).patch(`/api/todos/${toDoID2}`).send(payload).expect(200);

        expect(res.body).toEqual(
            expect.objectContaining({
                data: expect.objectContaining({
                    nameTask: 'Test Task Update',
                    importanceValue: 2,
                    taskGroup: 'Test Group 2',
                }),
            })
        )
    })

    it("it should delete the ToDo task", async () => {
        const res = await request(app).delete(`/api/todos/${toDoID2}`)

        expect(res.status).toEqual(200)

        expect(res.body).toEqual(
            expect.objectContaining({
                message: `${toDoID2} todo has been deleted`
            })
        )

        const getRes = await request(app).get(`/api/todos/${toDoID2}`)
        expect(getRes.status).toEqual(404)
        expect(getRes.body).toEqual(
            expect.objectContaining({
                success: false,
                message:"Task not found"
            })
        )
    })

})