"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// src/app.ts
const express_1 = __importDefault(require("express"));
const mongoose_1 = __importDefault(require("mongoose"));
const zod_1 = __importDefault(require("zod"));
const cors_1 = __importDefault(require("cors"));
const app = (0, express_1.default)();
const PORT = 3001;
app.use(express_1.default.json());
app.use((0, cors_1.default)());
// MongoDB Connection
mongoose_1.default.connect("mongodb://localhost:27017/Todo");
const TodoModel = mongoose_1.default.model('Todo', new mongoose_1.default.Schema({
    title: { type: String, required: true },
    description: { type: String },
    completed: { type: Boolean, default: false },
}));
// Routes
app.get('/todos', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const todos = yield TodoModel.find();
    res.json(todos);
}));
app.post('/todos', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const bodyObj = zod_1.default.object({
        title: zod_1.default.string(),
        description: zod_1.default.string(),
        completed: zod_1.default.boolean().optional()
    });
    const body = req.body;
    const resp = bodyObj.safeParse(body);
    if (!resp.success) {
        res.status(411).json({ msg: "invalid input" });
    }
    const todo = yield TodoModel.create(req.body);
    res.status(201).json(todo);
}));
app.put('/todos/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const bodyObj = zod_1.default.object({
        title: zod_1.default.string(),
        description: zod_1.default.string(),
        completed: zod_1.default.boolean().optional()
    });
    const body = req.body;
    const resp = bodyObj.safeParse(body);
    if (!resp.success) {
        res.status(411).json({ msg: "invalid input" });
    }
    const { id } = req.params;
    const todo = yield TodoModel.findByIdAndUpdate(id, req.body, { new: true });
    res.json(todo);
}));
app.delete('/todos/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    yield TodoModel.findByIdAndDelete(id);
    res.sendStatus(204);
}));
app.get("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    res.send("Server running");
}));
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
