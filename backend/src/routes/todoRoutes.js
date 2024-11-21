const express = require('express');
const {
  getTodos,
  getTodoById,
  createTodo,
  updateTodo,
  deleteTodo
} = require('../controllers/todoController');

const router = express.Router();

// Routes
router.get('/', getTodos); // GET /api/todos - ดึง To-Dos ทั้งหมด
router.get('/:id', getTodoById); // GET /api/todos/:id - ดึง To-Do ตาม ID
router.post('/', createTodo); // POST /api/todos - สร้าง To-Do ใหม่
router.patch('/:id', updateTodo); // PATCH /api/todos/:id - อัปเดต To-Do
router.delete('/:id', deleteTodo); // DELETE /api/todos/:id - ลบ To-Do

module.exports = router;
