import { Schema, model } from "mongoose";

const userSchema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  userID: {
    type: String,
    required: true,
    unique: true,
  },
  user_name: {
    type: String,
    required: true,
  },
});

const User = model("User", userSchema);

export default User;
