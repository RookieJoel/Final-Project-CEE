import mongoose from 'mongoose';

// Define the schema for threads
const threadSchema = new mongoose.Schema({
  title: String,
  description: String,
  username: { type: String, required: true },
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

export default Thread;