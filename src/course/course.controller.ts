import {BadRequestException, ForbiddenException} from '@utils/exceptions'
import {Request} from 'express'
import {validationResult} from 'express-validator'
import {DEFAULT_PAGE_SIZE} from '@utils/constants'
import {ICourse, ICourseListResponse} from "@models/Course";
import {CourseService} from "@src/course/course.service";

export interface ICreateCourseBody {
    title: string
    type: string
    icon: string
}

export interface IUpdateCourseBody {
    title: string
    type: string
}

const courseService = new CourseService()

export class CourseController {

    async createCourse(req: Request<any, any, ICreateCourseBody>): Promise<ICourse> {
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            throw new BadRequestException(
                'Invalid application creating data',
                errors.array()
            )
        }
        const currentUser = req.user
        const {
            title,
            type
        } = req.body
        const icon = `/uploads/courses/${req.file?.filename}`;
        if (currentUser?.role !== 'admin') {
            throw new ForbiddenException(
                'You are not allowed to create course',
                errors.array()
            )
        }
        return courseService.createCourse(
            title, type, icon
        )
    }

    async updateCourse(
        req: Request<any, any, IUpdateCourseBody>
    ): Promise<{ message: string, course: ICourse | undefined }> {
        const errors = validationResult(req)
        const {id} = req.params
        const {
            title, type
        } = req.body
        const currentUser = req.user
        if (currentUser?.role !== 'admin') {
            throw new ForbiddenException(
                'You are not allowed to update course',
                errors.array()
            )
        }
        const updatedCourse = await courseService.updateCourse(id, title, type)

        return {message: 'Course successfully updated', course: updatedCourse}
    }

    getCourseList(
        req: Request<any,
            any,
            any,
            { page: number; pageSize: number; searchParams: string }>
    ): Promise<ICourse[] | ICourseListResponse> {
        const errors = validationResult(req)

        if (!errors.isEmpty()) {
            throw new BadRequestException('Invalid query parameters', errors.array())
        }

        const {
            page = 1,
            pageSize = DEFAULT_PAGE_SIZE,
            searchParams = ''
        } = req.query
        if (Array.isArray(page) || Array.isArray(pageSize)) {
            throw new BadRequestException('Invalid query parameters')
        }

        return courseService.getCourseList(page, pageSize, searchParams)
    }


    deleteCourse(req: Request): Promise<void> {
        const courseId = req.params.id

        const currentUser = req.user
        if (currentUser?.role !== 'admin') {
            throw new ForbiddenException(
                'You are not allowed to delete course'
            )
        }
        return courseService.deleteCourseById(courseId)
    }
}
