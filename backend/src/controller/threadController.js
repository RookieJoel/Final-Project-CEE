import Thread from '../models/Thread.js';

// Fetch all threads
export const getAllThreads = async (req, res) => {
  try {
    const threads = await Thread.find();
    res.json(threads);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Create a new thread
export const createThread = async (req, res) => {
  const { title, description } = req.body;

  try {
    const newThread = new Thread({ title, description });
    await newThread.save();
    res.status(201).json(newThread);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete a thread
export const deleteThread = async (req, res) => {
  const { id } = req.params;

  try {
    await Thread.findByIdAndDelete(id);
    res.json({ message: 'Thread deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
