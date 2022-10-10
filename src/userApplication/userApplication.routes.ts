import { Router } from "express";
import { check, query } from "express-validator";
import { requestWrapper } from "@utils/request-wrapper";
import { errorHandler } from "@src/middleware/error-handling.middleware";
import { StatusCodes } from "@src/utils/status-codes";
import { authorize } from "@src/middleware/auth.middleware";
import { UserApplicationController } from "./userApplication.controller";

/**
 * @swagger
 *
 * tags:
 *  - name: UserApplication
 *    description: User Course Application functionality
 */

const router = Router();

const userApplicationController = new UserApplicationController();

/**
 * @swagger
 *
 * /user-application:
 *  post:
 *    tags:
 *      - UserApplication
 *    security:
 *      - bearerAuth: []
 *    summary: Creates a new user application with provided information
 *    requestBody:
 *      content:
 *        application/json:
 *          schema:
 *            $ref: "#/components/schemas/CreateUserApplicationDto"
 *    responses:
 *      '201':
 *        description: Successfully created new application application
 *        content:
 *          application/json:
 *            schema:
 *              $ref: "#/components/schemas/UserApplicationSuccessDto"
 *      '400':
 *        description: Bad application creation data
 *        content:
 *          application/json:
 *            schema:
 *              $ref: "#/components/schemas/UserApplicationBadResponse"
 */

router.post(
  "/",
  [
    check("courseId", "Enter valid job course id").notEmpty(),
    check("englishLvl", "Enter valid english lvl").isString().notEmpty(),
    check("technicalBackground", "Enter valid technical background")
      .isString()
      .notEmpty(),
    check("status", "Enter valid status").isString().notEmpty(),
  ],
  authorize,
  requestWrapper(
    userApplicationController.createApplication,
    StatusCodes.CREATED
  ),
  errorHandler
);

/**
 * @swagger
 *
 * /user-application/{applicationId}:
 *  patch:
 *    tags:
 *      - UserApplication
 *    security:
 *      - bearerAuth: []
 *    summary: Update specific application
 *    parameters:
 *      - in: path
 *        name: applicationId
 *        schema:
 *          type: string
 *        required: true
 *        description: Application database id
 *    requestBody:
 *      content:
 *        application/json:
 *          schema:
 *            $ref: "#/components/schemas/UpdateUserApplicationDto"
 *    responses:
 *      '200':
 *        description: application successfully updated
 *        content:
 *          application/json:
 *            schema:
 *              $ref: "#/components/schemas/UpdateUserApplicationDto"
 *      '400':
 *        description: Can't update application
 *        content:
 *          application/json:
 *            schema:
 *              $ref: "#/components/schemas/UserApplicationBadResponse"
 */

router.patch(
  "/:id",
  authorize,
  requestWrapper(userApplicationController.updateUserApplication),
  errorHandler
);

router.delete(
  "/:id",
  authorize,
  requestWrapper(userApplicationController.deleteUserApplication),
  errorHandler
);

router.get(
  "/list",
  [
    query(
      "page",
      "Page query parameter should be an integer that is greater than or equal to 1"
    )
      .optional()
      .isInt({ min: 1 })
      .toInt(),
    query(
      "pageSize",
      "Page size query parameter should be an integer that is greater than or equal to 10"
    )
      .optional()
      .isInt({ min: 1 })
      .toInt(),
    query("searchParams", "Search params should be string")
      .optional()
      .isString(),
  ],
  authorize,
  requestWrapper(userApplicationController.getUserApplicationList),
  errorHandler
);

module.exports = router;
