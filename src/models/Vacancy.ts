import mongoose, {Document, Schema} from 'mongoose'

export interface IVacancy extends Document {
    _id: string
    userId: string
    jobTitle: string
    companyName: string
    vacancyLink: string
    country: string
    city: string
    status: string
    vacancyType: string
}

const VacancySchema = new Schema({
        userId: {type: String, required: true},
        jobTitle: {type: String, required: true},
        companyName: {type: String, required: true},
        vacancyLink: {type: String, required: true},
        country: {type: String, required: true},
        city: {type: String, required: true},
        status: {type: String, required: true},
        vacancyType: {type: String, required: true},
    },

    {timestamps: true}
)
export default mongoose.model<IVacancy>('Vacancy', VacancySchema)
