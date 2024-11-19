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
        id: newThread._id,  // This is MongoDB's generated ID
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
app.post('/api/threads/:id/comments', async (req, res) => {
  const { user, text } = req.body;
  try {
    const thread = await Thread.findById(req.params.id);
    if (!thread) {
      return res.status(404).send('Thread not found');
    }

    const newComment = { user, text };
    thread.comments.push(newComment);
    await thread.save();

    res.status(201).json(newComment);
  } catch (err) {
    res.status(400).send(err);
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

// Listen on port
app.listen(3222, () => {
  console.log('Server is running on port http://3.211.14.24:3222/api/threads');
});