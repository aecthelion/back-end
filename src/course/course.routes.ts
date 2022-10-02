import {Router} from 'express'
import {check} from 'express-validator'
import {requestWrapper} from '@utils/request-wrapper'
import {errorHandler} from '@src/middleware/error-handling.middleware'
import {StatusCodes} from '@src/utils/status-codes'
import {authorize} from "@src/middleware/auth.middleware";
import {CourseController} from "@src/course/course.controller";
import multer from "multer";
import path from "path";
import {hashFileName} from "@utils/helpers";


/**
 * @swagger
 *
 * tags:
 *  - name: Course
 *    description: Course functionality
 */


const router = Router()

const storage = multer.diskStorage({
        destination: (req, file: Express.Multer.File, callback: any) => {
                callback(null, path.resolve(__dirname, "../../uploads/courses/"));
        },
        filename: (req, file: Express.Multer.File, callback: any) => {
                callback(null, hashFileName(file.originalname));
        },
});

const upload = multer({ storage: storage });

const courseController = new CourseController()

/**
 * @swagger
 *
 * /courses:
 *  post:
 *    tags:
 *      - Course
 *    security:
 *      - bearerAuth: []
 *    summary: Creates a new course with provided information
 *    requestBody:
 *      content:
 *        application/json:
 *          schema:
 *            $ref: "#/components/schemas/CreateCourseDto"
 *    responses:
 *      '201':
 *        description: Successfully created new course
 *        content:
 *          application/json:
 *            schema:
 *              $ref: "#/components/schemas/CourseSuccessDto"
 *      '400':
 *        description: Bad course creation data
 *        content:
 *          application/json:
 *            schema:
 *              $ref: "#/components/schemas/CourseBadResponse"
 */

router.post(
    '/',
    upload.single("icon"),
    [
        check('title', 'Enter valid course title').notEmpty(),
        check('type', 'Select course type').isString().notEmpty(),

    ],
    authorize,
    requestWrapper(courseController.createCourse, StatusCodes.CREATED),
    errorHandler
)


/**
 * @swagger
 *
 * /courses/{courseId}:
 *  patch:
 *    tags:
 *      - Course
 *    security:
 *      - bearerAuth: []
 *    summary: Update specific course
 *    parameters:
 *      - in: path
 *        name: courseId
 *        schema:
 *          type: string
 *        required: true
 *        description: Course database id
 *    requestBody:
 *      content:
 *        application/json:
 *          schema:
 *            $ref: "#/components/schemas/UpdateCourseDto"
 *    responses:
 *      '200':
 *        description: Course successfully updated
 *        content:
 *          application/json:
 *            schema:
 *              $ref: "#/components/schemas/UpdateCourseResponse"
 *      '400':
 *        description: Can't update application
 *        content:
 *          application/json:
 *            schema:
 *              $ref: "#/components/schemas/CourseBadResponse"
 */

router.patch(
    '/:id',
    authorize,
    requestWrapper(courseController.updateCourse),
    errorHandler
)



/**
 * @swagger
 *
 * /courses/{courseId}:
 *  delete:
 *    tags:
 *      - Course
 *    summary: Delete specific course
 *    parameters:
 *      - in: path
 *        name: courseId
 *        schema:
 *          type: string
 *        required: true
 *        description: Course database id
 *    responses:
 *      '204':
 *        description: Course found and deleted
 *        content:
 *          application/json:
 *            schema:
 *              $ref: "#/components/schemas/CourseDeleteResponse"
 *      '404':
 *        description: Course with such id not found
 *        content:
 *          application/json:
 *            schema:
 *              $ref: "#/components/schemas/CourseDeleteResponse"
 */



router.delete(
    '/:id',
    authorize,
    requestWrapper(courseController.deleteCourse, StatusCodes.NO_CONTENT),
    errorHandler
)



/**
 * @swagger
 *
 * /courses/list:
 *  get:
 *    tags:
 *      - Course
 *    summary: Get list of courses
 *    responses:
 *      '200':
 *        description: Courses found
 *        content:
 *          application/json:
 *            schema:
 *              $ref: "#/components/schemas/CourseListResponse"
 *      '400':
 *        description: Bad request data
 *        content:
 *          application/json:
 *            schema:
 *              $ref: "#/components/schemas/CourseBadResponse"
 */

router.get(
    '/list',
    authorize,
    requestWrapper(courseController.getCourseList),
    errorHandler
)

module.exports = router
