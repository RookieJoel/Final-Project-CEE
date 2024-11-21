import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
      email: { type: String, required: true, unique: true },
      password: { type: String, required: true },
  },
  { strict: true } // Disallow fields not defined in the schema
);


const User = mongoose.model('User', userSchema);
export default User;
