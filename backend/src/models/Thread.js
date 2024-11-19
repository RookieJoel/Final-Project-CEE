import mongoose from 'mongoose';

// Define the schema for threads
const threadSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  likes: {
    type: Number,
    default: 0
  },
  dislikes: {
    type: Number,
    default: 0
  },
  comments: [
    {
      user: { type: String, required: true },
      text: { type: String, required: true },
      likes: { type: Number, default: 0 },
      dislikes: { type: Number, default: 0 }
    }
  ]
});

// Create the Thread model from the schema
const Thread = mongoose.model('Thread', threadSchema);

export default Thread;