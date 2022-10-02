import {NotFoundException} from '@src/utils/exceptions'
import Course, {ICourse, ICourseListResponse} from "@models/Course";

export class CourseService {
    async createCourse(
        title: string,
        type: string,
        icon: string,
    ): Promise<ICourse> {
        const vacancy = new Course({
            title,
            type,
            icon
        })
        return vacancy.save()
    }

    async updateCourse(id: string, title: string, type: string) {

        await Course.updateOne(
            {_id: id},
            {
                $set: {
                    title,
                    type,
                }
            }
        )

        const updatedCourse = await Course.findOne({_id: id})

        if (updatedCourse) {
            return updatedCourse
        }
    }

    async getCourseList(page: number,
                        pageSize: number,
                        searchParams?: string): Promise<ICourseListResponse | ICourse[]> {
        if (!searchParams) {
            const allCourses = await Course.find()
                .limit(pageSize)
                .skip((page - 1) * pageSize)
                .exec()

            const count = await Course.count();
            return {
                courses: allCourses,
                totalPages: Math.ceil(count / pageSize),
                currentPage: page,
            }
        }
        const courses = await Course.find({
            $text: {$search: searchParams}
        })

        if (courses.length === 0) {
            throw new NotFoundException('No users found, please retry')
        }

        return {courses, totalPages: 1, currentPage: 1}
    }

    async deleteCourseById(courseId: string) {
        const result = await Course.deleteOne({_id: courseId})

        if (!result) {
            throw new NotFoundException('Course with provided ID was not found!')
        }
    }
}
