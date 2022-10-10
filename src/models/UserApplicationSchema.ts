import mongoose, { Document, Schema } from "mongoose";
import { IUser } from "./User";
import { IApplicationUser } from "./../userApplication/userApplication.service";

export interface IUserApplication extends Document {
  _id: string;
  userId: string;
  courseId: string;
  englishLvl: string;
  technicalBackground: string;
  status: string;
  user?: any;
  createdAt?: string | Date;
  updatedAt?: string | Date;
}

export interface IUserApplicationListResponse {
  applications: IUserApplication[] | [];
  totalPages: number;
  currentPage: number;
}

const UserApplicationSchema = new Schema(
  {
    userId: { type: String, required: true },
    courseId: { type: String, required: true },
    englishLvl: { type: String, required: true },
    technicalBackground: { type: String, required: true },
    status: { type: String, required: true },
  },
  { timestamps: true }
);

export default mongoose.model<IUserApplication>(
  "UserApplication",
  UserApplicationSchema
);
