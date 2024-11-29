// index.js (Backend)

import express from 'express';
import dotenv from 'dotenv';
import session from 'express-session';
import connectDB from './src/config/db.js';
import authRoutes from './src/routes/auth.js';
import mongoose from 'mongoose';
import cors from 'cors';
import bodyParser from 'body-parser';

// Update the CORS options
const corsOptions = {
  origin: 'http://54.211.108.140:3221', // Frontend URL
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'], // Allowed HTTP methods
  allowedHeaders: ['Content-Type', 'Authorization'], // Allowed headers
  credentials: true, // Allow credentials (like cookies)
};

// Initialize Express app
const app = express();

// Apply the CORS middleware with the updated options
app.use(cors(corsOptions));




// Middleware
app.use(bodyParser.json());

// Thread Schema
const threadSchema = new mongoose.Schema({
  id: String,
  title: String,
  description: String,
  likes: [String],
  dislikes: [String],
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

app.patch('/api/threads/:id/likes', async (req, res) => {
  const { userId, action } = req.body; // Expecting action to be 'like', 'dislike', 'unlike', or 'undislike'
  
  if (!userId || !action) {
    return res.status(400).json({ error: 'userId and action are required' });
  }
  
  try {
    const thread = await Thread.findById(req.params.id);
    if (!thread) {
      return res.status(404).json({ error: 'Thread not found' });
    }

    // Handle like action
    if (action === 'like') {
      // If user has already liked, remove like (unlike)
      if (thread.likes.includes(userId)) {
        thread.likes = thread.likes.filter(id => id !== userId);
      } else {
        thread.likes.push(userId); // Add like if not already liked
        thread.dislikes = thread.dislikes.filter(id => id !== userId); // Remove from dislikes if previously disliked
      }
    }
    // Handle dislike action
    else if (action === 'dislike') {
      // If user has already disliked, remove dislike (undislike)
      if (thread.dislikes.includes(userId)) {
        thread.dislikes = thread.dislikes.filter(id => id !== userId);
      } else {
        thread.dislikes.push(userId); // Add dislike if not already disliked
        thread.likes = thread.likes.filter(id => id !== userId); // Remove from likes if previously liked
      }
    } else {
      return res.status(400).json({ error: 'Invalid action. Must be "like" or "dislike".' });
    }

    // Save the updated thread
    await thread.save();
    res.status(200).json(thread); // Return updated thread with new like/dislike counts
  } catch (err) {
    console.error('Error processing like/dislike:', err);
    res.status(500).json({ error: 'Error updating thread', message: err.message });
  }
});


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
  const { userId, action } = req.body;
  try {
    const thread = await Thread.findById(req.params.id);
    if (!thread) {
      return res.status(404).json({ error: 'Thread not found' });
    }

    if (!['like', 'dislike'].includes(action)) {
      return res.status(400).json({ error: 'Invalid action' });
    }

    // Check for action logic here...

    await thread.save(); // Ensure the thread is saved properly
    res.status(200).json(thread);
  } catch (err) {
    console.error('Error occurred while updating thread:', err); // Log the error
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

//log in & sign up Part 

dotenv.config();

app.use(cors({ origin: 'http://54.211.108.140:3221', credentials: true }));
app.use(express.json());
app.use(session({
    secret: 'your-secret-key',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false },
}));



// Use Auth Routes
app.use('/api/auth', authRoutes);

// Log Out Endpoint
app.post('/api/auth/logout', (req, res) => {
  if (req.session) {
      req.session.destroy(err => {
          if (err) {
              return res.status(500).json({ message: 'Failed to log out' });
          }
          res.status(200).json({ message: 'Logged out successfully' });
      });
  } else {
      res.status(200).json({ message: 'No active session' });
  }
});

// Include user information in session check
app.get('/api/auth/session', (req, res) => {
  if (req.session && req.session.userId) {
      User.findById(req.session.userId, 'username', (err, user) => {
          if (err || !user) {
              return res.status(500).json({ loggedIn: false });
          }
          res.status(200).json({ loggedIn: true, username: user.username });
      });
  } else {
      res.status(200).json({ loggedIn: false });
  }
});

// Connect to MongoDB
connectDB();

// Listen on port
app.listen(3222, () => {
  console.log('Server is running');
});






