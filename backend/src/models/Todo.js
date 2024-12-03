// models/Todo.js
import mongoose from 'mongoose';

const todoSchema = new mongoose.Schema({
  task: { type: String, required: true },
  genre: { type: String, required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Link to the user
});

const Todo = mongoose.model('Todo', todoSchema);
export default Todo;
