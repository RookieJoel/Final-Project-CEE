import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  username: String,
  password: String,
  // other fields as needed
});

const User = mongoose.model('User', userSchema);

export default User;
