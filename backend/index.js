// index.js (Backend)

import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import bodyParser from 'body-parser';

// Initialize Express app
const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Connect to MongoDB (local or MongoDB Atlas)
mongoose.connect('mongodb+srv://RookieJoel:Guyi7tu007@cluster0.ciuyn.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log(err));

// Thread Schema
const threadSchema = new mongoose.Schema({
  id: String,
  title: String,
  description: String,
  likes: { type: Number, default: 0 },
  dislikes: { type: Number, default: 0 },
  comments: [
    {
      user: String,
      text: String,
      likes: { type: Number, default: 0 },
      dislikes: { type: Number, default: 0 }
    }
  ]
});

const Thread = mongoose.model('Thread', threadSchema);

// API routes

// GET all threads
app.get('/api/threads', async (req, res) => {
  try {
    const threads = await Thread.find();
    res.json(threads);
  } catch (err) {
    res.status(500).send(err);
  }
});

// POST a new thread
app.post('/api/threads', async (req, res) => {
    try {
      // Create a new thread document
      const newThread = new Thread(req.body);
      
      // Save the thread to the database
      await newThread.save();
      
      // Return the created thread with its generated _id
      res.status(201).json({
        title: newThread.title,
        description: newThread.description,
        likes: newThread.likes,
        dislikes: newThread.dislikes,
        comments: newThread.comments,
      });
    } catch (err) {
      res.status(500).json({ error: 'Error creating thread', message: err.message });
    }
  });
  
// GET all comments for a specific thread
  app.get('/api/threads/:id/comments', async (req, res) => {
    try {
      const thread = await Thread.findById(req.params.id);
      if (!thread) {
        return res.status(404).json({ error: 'Thread not found' });
      }
      res.json(thread.comments); // Send only the comments
    } catch (err) {
      res.status(500).json({ error: 'Error fetching comments', message: err.message });
    }
  });

// DELETE a thread
app.delete('/api/threads/:id', async (req, res) => {
  try {
    const thread = await Thread.findByIdAndDelete(req.params.id);
    if (!thread) {
      return res.status(404).send('Thread not found');
    }
    res.status(200).send('Thread deleted');
  } catch (err) {
    res.status(500).send(err);
  }
});

// POST a comment to a thread
// POST a comment to a thread
app.post('/api/threads/:id/comments', async (req, res) => {
  const { user, text } = req.body;

  try {
    const thread = await Thread.findById(req.params.id);
    if (!thread) {
      return res.status(404).json({ error: 'Thread not found' });
    }

    // Create a new comment
    const newComment = {
      user: user || 'Anonymous', // Default to 'Anonymous' if no user is provided
      text,
      likes: 0,
      dislikes: 0,
    };

    // Add the new comment to the thread
    thread.comments.push(newComment);

    // Save the thread with the new comment
    await thread.save();

    res.status(201).json(newComment); // Respond with the new comment
  } catch (err) {
    res.status(400).json({ error: 'Failed to add comment', message: err.message });
  }
});

// DELETE a comment from a thread
app.delete('/api/threads/:threadId/comments/:commentId', async (req, res) => {
  try {
    const thread = await Thread.findById(req.params.threadId);
    if (!thread) {
      return res.status(404).send('Thread not found');
    }

    const commentIndex = thread.comments.findIndex(c => c._id.toString() === req.params.commentId);
    if (commentIndex === -1) {
      return res.status(404).send('Comment not found');
    }

    thread.comments.splice(commentIndex, 1);
    await thread.save();

    res.status(200).send('Comment deleted');
  } catch (err) {
    res.status(500).send(err);
  }
});

app.patch('/api/threads/:id', async (req, res) => {
  const { likes, dislikes } = req.body;
  try {
    const thread = await Thread.findById(req.params.id);
    if (!thread) {
      return res.status(404).json({ error: 'Thread not found' });
    }

    // Update likes and dislikes if provided
    if (likes !== undefined) thread.likes = likes;
    if (dislikes !== undefined) thread.dislikes = dislikes;

    await thread.save();
    res.status(200).json(thread); // Return updated thread
  } catch (err) {
    res.status(500).json({ error: 'Error updating thread', message: err.message });
  }
});

// LIKE a comment
app.post('/api/threads/:threadId/comments/:commentId/like', async (req, res) => {
  try {
    const thread = await Thread.findById(req.params.threadId);
    if (!thread) {
      return res.status(404).json({ error: 'Thread not found' });
    }

    const comment = thread.comments.id(req.params.commentId);
    if (!comment) {
      return res.status(404).json({ error: 'Comment not found' });
    }

    // Increment the like count for the comment
    comment.likes += 1;
    await thread.save();

    res.status(200).json(comment); // Return the updated comment
  } catch (err) {
    res.status(500).json({ error: 'Error liking comment', message: err.message });
  }
});

// DISLIKE a comment
app.post('/api/threads/:threadId/comments/:commentId/dislike', async (req, res) => {
  try {
    const thread = await Thread.findById(req.params.threadId);
    if (!thread) {
      return res.status(404).json({ error: 'Thread not found' });
    }

    const comment = thread.comments.id(req.params.commentId);
    if (!comment) {
      return res.status(404).json({ error: 'Comment not found' });
    }

    // Increment the dislike count for the comment
    comment.dislikes += 1;
    await thread.save();

    res.status(200).json(comment); // Return the updated comment
  } catch (err) {
    res.status(500).json({ error: 'Error disliking comment', message: err.message });
  }
});


// GET all to-do items
app.get('/api/todos', async (req, res) => {
  try {
    const todos = await Todo.find();
    res.json(todos);
  } catch (err) {
    res.status(500).json({ error: 'Error fetching to-do list', message: err.message });
  }
});

// POST a new to-do item
app.post('/api/todos', async (req, res) => {
  const { task, topic } = req.body;

  try {
    if (!task || !topic) {
      return res.status(400).json({ error: 'Task and Topic are required' });
    }

    const newTodo = new Todo({
      task,
      topic,
    });

    await newTodo.save();
    res.status(201).json(newTodo);
  } catch (err) {
    res.status(500).json({ error: 'Error creating to-do item', message: err.message });
  }
});

// DELETE a to-do item
app.delete('/api/todos/:id', async (req, res) => {
  try {
    const todo = await Todo.findByIdAndDelete(req.params.id);
    if (!todo) {
      return res.status(404).json({ error: 'To-Do item not found' });
    }
    res.status(200).send('To-Do item deleted');
  } catch (err) {
    res.status(500).json({ error: 'Error deleting to-do item', message: err.message });
  }
});


// Listen on port
app.listen(3222, () => {
  console.log('Server is running on port http://3.211.14.24:3222/api/threads');
});






