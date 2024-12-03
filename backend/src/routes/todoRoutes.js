// routes/todoRoutes.js
import express from 'express';
import Todo from '../models/Todo.js';

const router = express.Router();

// Get To-Do list for a user
router.get('/', async (req, res) => {
  try {
    const todos = await Todo.find({ userId: req.session.userId }); // Get todos for the logged-in user
    res.json(todos);
  } catch (err) {
    res.status(500).json({ error: 'Error fetching to-do list', message: err.message });
  }
});

// Add a new To-Do item
router.post('/', async (req, res) => {
  const { task, genre } = req.body;

  try {
    if (!req.session.userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const newTodo = new Todo({
      task,
      genre,
      userId: req.session.userId,
    });

    await newTodo.save();
    res.status(201).json(newTodo);
  } catch (err) {
    res.status(500).json({ error: 'Error creating to-do item', message: err.message });
  }
});

// Delete a To-Do item
router.delete('/:id', async (req, res) => {
  try {
    const todo = await Todo.findOneAndDelete({
      _id: req.params.id,
      userId: req.session.userId, // Ensure the logged-in user owns the item
    });

    if (!todo) {
      return res.status(404).json({ error: 'To-Do item not found' });
    }
    res.status(200).send('To-Do item deleted');
  } catch (err) {
    res.status(500).json({ error: 'Error deleting to-do item', message: err.message });
  }
});

export default router;
