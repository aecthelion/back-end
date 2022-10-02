import mongoose, {Document, Schema} from 'mongoose'

export interface ICourse extends Document {
    _id: string
    title: string
    type: string
    icon: string
}

export interface ICourseListResponse {
    courses: ICourse[],
    totalPages: number,
    currentPage: number
}

const Course = new Schema({
        title: {type: String, required: true},
        type: {type: String, required: true},
        icon: {type: String, required: true},
    },

    {timestamps: true}
)
export default mongoose.model<ICourse>('Course', Course)
