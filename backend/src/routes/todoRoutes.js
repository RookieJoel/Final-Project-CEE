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
  console.log('Request body:', req.body); // Log the request body
  console.log('User ID:', req.session.userId); // Log the session user ID

  const { task, genre } = req.body;

  if (!task || !genre) {
    console.error('Task or genre is missing');
    return res.status(400).json({ error: 'Task and genre are required' });
  }

  try {
    if (!req.session.userId) {
      console.error('User is not logged in');
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const newTodo = new Todo({
      task,
      genre,
      userId: req.session.userId,
    });

    await newTodo.save();
    console.log('Todo item created:', newTodo);
    res.status(201).json(newTodo);
  } catch (err) {
    console.error('Error creating to-do item:', err.message);
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

// Update a To-Do (Mark as Complete)
router.put('/:id', async (req, res) => {
  try {
    const { completed } = req.body;

    const todo = await Todo.findOneAndUpdate(
      { _id: req.params.id, userId: req.session.userId },
      { completed },
      { new: true }
    );

    if (!todo) {
      return res.status(404).json({ error: 'To-Do item not found' });
    }

    res.status(200).json(todo);
  } catch (err) {
    res.status(500).json({ error: 'Error updating to-do item', message: err.message });
  }
});

// Fetch To-Dos for Logged-In User
router.get('/', async (req, res) => {
  try {
    const todos = await Todo.find({ userId: req.session.userId });
    res.json(todos);
  } catch (err) {
    res.status(500).json({ error: 'Error fetching to-do list', message: err.message });
  }
});
router.post('/', async (req, res) => {
  console.log('Request Body:', req.body); // Logs the incoming body
  console.log('Session User ID:', req.session.userId);
  const { task, genre } = req.body; // Ensure field names are `task` and `genre`

  if (!task || !genre) {
    console.error('Task or genre is missing');
    return res.status(400).json({ error: 'Task and genre are required' });
  }

  try {
    const newTodo = new Todo({
      task,
      genre,
      userId: req.session.userId, // Ensure session userId is set
    });

    const savedTodo = await newTodo.save();
    res.status(201).json(savedTodo);
  } catch (err) {
    console.error('Error creating to-do item:', err.message);
    res.status(500).json({ error: 'Error creating to-do item', message: err.message });
  }
});

export default router;
