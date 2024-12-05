import Thread from '../models/Thread.js';

// Get all threads
export const getAllThreads = async (req, res) => {
  try {
    const threads = await Thread.find();
    res.json(threads);
  } catch (err) {
    res.status(500).send(err);
  }
};

// Create a new thread
export const createThread = async (req, res) => {
  try {
    const newThread = new Thread(req.body);
    await newThread.save();
    res.status(201).json(newThread);
  } catch (err) {
    res.status(500).json({ error: 'Error creating thread', message: err.message });
  }
};

// Get comments of a thread
export const getThreadComments = async (req, res) => {
  try {
    const thread = await Thread.findById(req.params.id);
    if (!thread) {
      return res.status(404).json({ error: 'Thread not found' });
    }
    res.json(thread.comments);
  } catch (err) {
    res.status(500).json({ error: 'Error fetching comments', message: err.message });
  }
};

// Delete a thread
export const deleteThread = async (req, res) => {
  try {
    const thread = await Thread.findByIdAndDelete(req.params.id);
    if (!thread) {
      return res.status(404).send('Thread not found');
    }
    res.status(200).send('Thread deleted');
  } catch (err) {
    res.status(500).send(err);
  }
};

// Like or dislike a thread
export const likeDislikeThread = async (req, res) => {
  const { userId, action } = req.body;
  try {
    const thread = await Thread.findById(req.params.id);
    if (!thread) {
      return res.status(404).json({ error: 'Thread not found' });
    }

    if (action === 'like') {
      if (thread.likes.includes(userId)) {
        thread.likes = thread.likes.filter((id) => id !== userId);
      } else {
        thread.likes.push(userId);
        thread.dislikes = thread.dislikes.filter((id) => id !== userId);
      }
    } else if (action === 'dislike') {
      if (thread.dislikes.includes(userId)) {
        thread.dislikes = thread.dislikes.filter((id) => id !== userId);
      } else {
        thread.dislikes.push(userId);
        thread.likes = thread.likes.filter((id) => id !== userId);
      }
    } else {
      return res.status(400).json({ error: 'Invalid action' });
    }

    await thread.save();
    res.status(200).json(thread);
  } catch (err) {
    res.status(500).json({ error: 'Error updating thread', message: err.message });
  }
};

// Add a comment to a thread
export const addComment = async (req, res) => {
  const { user, text } = req.body;

  try {
    const thread = await Thread.findById(req.params.id);
    if (!thread) {
      return res.status(404).json({ error: 'Thread not found' });
    }

    const newComment = { user: user || 'Anonymous', text, likes: 0, dislikes: 0 };
    thread.comments.push(newComment);
    await thread.save();

    res.status(201).json(newComment);
  } catch (err) {
    res.status(500).json({ error: 'Failed to add comment', message: err.message });
  }
};