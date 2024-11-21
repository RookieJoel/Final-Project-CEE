const Todo = require('../models/Todo');

// GET all To-Dos
const getTodos = async (req, res) => {
  try {
    const todos = await Todo.find(); // ดึงข้อมูลทั้งหมด
    res.status(200).json(todos);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch To-Dos', message: err.message });
  }
};

// GET a single To-Do by ID
const getTodoById = async (req, res) => {
  try {
    const todo = await Todo.findById(req.params.id); // หา To-Do ตาม ID
    if (!todo) {
      return res.status(404).json({ error: 'To-Do not found' });
    }
    res.status(200).json(todo);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch To-Do', message: err.message });
  }
};

// CREATE a new To-Do
const createTodo = async (req, res) => {
  try {
    const { title, description } = req.body;
    const newTodo = new Todo({
      title,
      description
    });
    const savedTodo = await newTodo.save(); // บันทึกข้อมูลในฐานข้อมูล
    res.status(201).json(savedTodo);
  } catch (err) {
    res.status(500).json({ error: 'Failed to create To-Do', message: err.message });
  }
};

// UPDATE a To-Do
const updateTodo = async (req, res) => {
  try {
    const { title, description, completed } = req.body;
    const todo = await Todo.findById(req.params.id); // หา To-Do ตาม ID
    if (!todo) {
      return res.status(404).json({ error: 'To-Do not found' });
    }

    // อัปเดตฟิลด์ที่ส่งมา
    if (title !== undefined) todo.title = title;
    if (description !== undefined) todo.description = description;
    if (completed !== undefined) todo.completed = completed;

    const updatedTodo = await todo.save(); // บันทึกการเปลี่ยนแปลง
    res.status(200).json(updatedTodo);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update To-Do', message: err.message });
  }
};

// DELETE a To-Do
const deleteTodo = async (req, res) => {
  try {
    const deletedTodo = await Todo.findByIdAndDelete(req.params.id); // ลบ To-Do ตาม ID
    if (!deletedTodo) {
      return res.status(404).json({ error: 'To-Do not found' });
    }
    res.status(200).json({ message: 'To-Do deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete To-Do', message: err.message });
  }
}
