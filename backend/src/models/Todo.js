// src/models/Todo.js
import mongoose from 'mongoose';

const todoSchema = new mongoose.Schema({
  task: { type: String, required: true },
  genre: { type: String, required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  completed: { type: Boolean, default: false }, // Add completion field
});

// Export with default
const Todo = mongoose.model('Todo', todoSchema);
export default Todo;
