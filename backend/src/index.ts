// src/app.ts
import express, { Request, Response } from 'express';
import mongoose from 'mongoose';
import zod, { boolean, string } from 'zod';
import cors from 'cors';
import dotenv from 'dotenv';
dotenv.config();
const app = express();
const PORT =  3001;
app.use(express.json());
app.use(cors());
const mongoURL=process.env.DATABASE_URL || "";
// MongoDB Connection
mongoose.connect(mongoURL);

// Define Schema and Model for ToDo
interface Todo {
  title: string;
  description: string;
  completed?: boolean;
}

const TodoModel = mongoose.model<Todo>('Todo', new mongoose.Schema<Todo>({
  title: { type: String, required: true },
  description: { type: String },
  completed: { type: Boolean, default: false },
}));

// Routes
app.get('/todos', async (req: Request, res: Response) => {
  const todos = await TodoModel.find();
  res.json(todos);
});

app.post('/todos', async (req: Request, res: Response) => {
  const bodyObj = zod.object({
    title: zod.string(),
    description: zod.string(),
    completed: zod.boolean().optional()
  });
  const body = req.body;
  const resp = bodyObj.safeParse(body);
  if (!resp.success) {
    res.status(411).json({ msg: "invalid input" });
  }

  const todo = await TodoModel.create(req.body);
  res.status(201).json(todo);
});

app.put('/todos/:id', async (req: Request, res: Response) => {
  const bodyObj = zod.object({
    title: zod.string(),
    description: zod.string(),
    completed: zod.boolean().optional()
  });
  const body = req.body;
  const resp = bodyObj.safeParse(body);
  if (!resp.success) {
    res.status(411).json({ msg: "invalid input" });
  }
  const { id } = req.params;
  const todo = await TodoModel.findByIdAndUpdate(id, req.body, { new: true });
  res.json(todo);
});

app.delete('/todos/:id', async (req: Request, res: Response) => {
  const { id } = req.params;
  await TodoModel.findByIdAndDelete(id);
  res.sendStatus(204);
});
app.get("/",async(req: Request, res: Response)=>{
  res.send("Server running");
})

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
