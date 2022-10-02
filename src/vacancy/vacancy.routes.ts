import {Router} from 'express'
import {check, query} from 'express-validator'
import {requestWrapper} from '@utils/request-wrapper'
import {errorHandler} from '@src/middleware/error-handling.middleware'
import {VacancyController} from '../vacancy/vacancy.controller'
import {StatusCodes} from '@src/utils/status-codes'
import {authorize} from "@src/middleware/auth.middleware";


/**
 * @swagger
 *
 * tags:
 *  - name: Vacancy
 *    description: Vacancy application functionality
 */


const router = Router()

const vacancyController = new VacancyController()

/**
 * @swagger
 *
 * /vacancies:
 *  post:
 *    tags:
 *      - Vacancy
 *    security:
 *      - bearerAuth: []
 *    summary: Creates a new vacancy application with provided information
 *    requestBody:
 *      content:
 *        application/json:
 *          schema:
 *            $ref: "#/components/schemas/CreateVacancyDto"
 *    responses:
 *      '201':
 *        description: Successfully created new vacancy application
 *        content:
 *          application/json:
 *            schema:
 *              $ref: "#/components/schemas/VacancySuccessDto"
 *      '400':
 *        description: Bad vacancy creation data
 *        content:
 *          application/json:
 *            schema:
 *              $ref: "#/components/schemas/VacancyBadResponse"
 */

router.post(
    '/',
    [
        check('jobTitle', 'Enter valid job title').notEmpty(),
        check('companyName', 'Enter valid company name').isString().notEmpty(),
        check('vacancyLink', 'Enter valid vacancy link').isString().isURL(),
        check('country', 'Enter valid country').isString().notEmpty(),
        check('city', 'Enter valid city').isString().notEmpty(),
        check('status', 'Select valid city').isNumeric().notEmpty(),
        check('vacancyType', 'Please select work type').isString().notEmpty(),
    ],
    authorize,
    requestWrapper(vacancyController.createVacancy, StatusCodes.CREATED),
    errorHandler
)


/**
 * @swagger
 *
 * /vacancies/{vacancyId}:
 *  patch:
 *    tags:
 *      - Vacancy
 *    security:
 *      - bearerAuth: []
 *    summary: Update specific application
 *    parameters:
 *      - in: path
 *        name: vacancyId
 *        schema:
 *          type: string
 *        required: true
 *        description: Vacancy database id
 *    requestBody:
 *      content:
 *        application/json:
 *          schema:
 *            $ref: "#/components/schemas/UpdateVacancyDto"
 *    responses:
 *      '200':
 *        description: application successfully updated
 *        content:
 *          application/json:
 *            schema:
 *              $ref: "#/components/schemas/UpdateVacancyResponse"
 *      '400':
 *        description: Can't update application
 *        content:
 *          application/json:
 *            schema:
 *              $ref: "#/components/schemas/VacancyBadResponse"
 */

router.patch(
    '/:id',
    authorize,
    requestWrapper(vacancyController.updateVacancy),
    errorHandler
)

router.get(
    '/list',
    [
        query(
            'page',
            'Page query parameter should be an integer that is greater than or equal to 1'
        )
            .optional()
            .isInt({min: 1})
            .toInt(),
        query(
            'pageSize',
            'Page size query parameter should be an integer that is greater than or equal to 10'
        )
            .optional()
            .isInt({min: 1})
            .toInt(),
        query('searchParams', 'Search params should be string')
            .optional()
            .isString()
    ],
    authorize,
    requestWrapper(vacancyController.getVacancyList),
    errorHandler
)

module.exports = router
