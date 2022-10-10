import mongoose, { Document, Schema } from "mongoose";

export interface IUser extends Document {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  avatar: string;
  role: string;
}

const UserSchema = new Schema(
  {
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    avatar: { type: String, required: false },
    role: { type: String, require: true },
  },
  { timestamps: true }
);
export default mongoose.model<IUser>("User", UserSchema);
