import {Router} from 'express'
import userController from '@src/user/user.controller'
import {authorize} from '@src/middleware/auth.middleware'
import {errorHandler} from '@src/middleware/error-handling.middleware'
import {requestWrapper} from '@src/utils/request-wrapper'
import {query} from "express-validator";

/**
 * @swagger
 *
 * tags:
 *  - name: User
 *    description: User profile functionality
 */

const router = Router()


/**
 * @swagger
 *
 * /user/{userId}:
 *  patch:
 *    tags:
 *      - User
 *    security:
 *      - bearerAuth: []
 *    summary: Update current user profile's information
 *    parameters:
 *      - in: path
 *        name: userId
 *        schema:
 *          type: string
 *        required: true
 *        description: User's database id
 *    requestBody:
 *      content:
 *        application/json:
 *          schema:
 *            $ref: "#/components/schemas/UpdateUserProfile"
 *    responses:
 *      '200':
 *        description: Successfully updated profile information
 *        content:
 *          application/json:
 *            schema:
 *              $ref: "#/components/schemas/UpdateUserProfileResponseDto"
 *      '401':
 *        description: You are not allowed to edit other's profile info
 *
 */

router.patch(
    '/:id',
    authorize,
    requestWrapper(userController.updateProfile),
    errorHandler
)

/**
 * @swagger
 *
 * /user/list?page=${page}&pageSize=${pageSize}:
 *  get:
 *    tags:
 *      - User
 *    summary: Get list of users
 *    parameters:
 *      - name: page
 *        in: query
 *        schema:
 *          type: number
 *        required: true
 *        description: User List page number
 *      - name: pageSize
 *        in: query
 *        schema:
 *          type: number
 *        required: true
 *        description: Amount of users that displayed per page
 *    responses:
 *      '200':
 *        description: Users found
 *        content:
 *          application/json:
 *            schema:
 *              $ref: "#/components/schemas/UserListResponse"
 *      '400':
 *        description: Bad request data
 *        content:
 *          application/json:
 *            schema:
 *              $ref: "#/components/schemas/UserBadResponse"
 */

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
    requestWrapper(userController.getUsersList),
    errorHandler
)

module.exports = router
