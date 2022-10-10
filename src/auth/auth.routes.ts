import { Router } from "express";
import { check } from "express-validator";
import { AuthController } from "@src/auth/auth.controller";
import { requestWrapper } from "@utils/request-wrapper";
import { errorHandler } from "@src/middleware/error-handling.middleware";
import multer from "multer";
import path from "path";
import { hashFileName } from "@src/utils/helpers";

/**
 * @swagger
 *
 * components:
 *  securitySchemes:
 *    bearerAuth:
 *      type: http
 *      scheme: bearer
 *      bearerFormat: JWt
 */

/**
 * @swagger
 *
 * tags:
 *  - name: Auth
 *    description: Authorization and authentication related functionality
 */

const router = Router();

const authController = new AuthController();

const storage = multer.diskStorage({
  destination: (req, file: Express.Multer.File, callback: any) => {
    callback(null, path.resolve(__dirname, "../../uploads"));
  },
  filename: (req, file: Express.Multer.File, callback: any) => {
    callback(null, hashFileName(file.originalname));
  },
});

const upload = multer({ storage: storage });

/**
 * @swagger
 *
 * /auth/register:
 *  post:
 *    tags:
 *      - Auth
 *    summary: Creates a new user's profile with provided credentials
 *    requestBody:
 *      content:
 *        multipart/form-data:
 *          schema:
 *            $ref: "#/components/schemas/RegisterDto"
 *    responses:
 *      '200':
 *        description: Successfully registered new user
 *        content:
 *          application/json:
 *            schema:
 *              $ref: "#/components/schemas/RegisterResponseDto"
 *
 *
 */

router.post(
  "/register",
  upload.single("avatar"),
  [
    check("email", "Incorrect email").normalizeEmail().isEmail(),
    check("password", "Minimum password length - 6 symbols").isLength({
      min: 6,
    }),
  ],
  requestWrapper(authController.register),
  errorHandler
);

/**
 * @swagger
 *
 * /auth/login:
 *  post:
 *    tags:
 *      - Auth
 *    summary: Checks provided credentials and generates access token on success
 *    requestBody:
 *      content:
 *        application/json:
 *          schema:
 *            $ref: "#/components/schemas/LoginDto"
 *    responses:
 *      '200':
 *        description: Successfully generated access token
 *        content:
 *          application/json:
 *            schema:
 *              $ref: "#/components/schemas/LoginResponseDto"
 *
 */

router.post(
  "/login",
  [
    check("email", "Enter correct email").normalizeEmail().isEmail(),
    check("password", "Enter password").exists(),
  ],
  requestWrapper(authController.login),
  errorHandler
);

module.exports = router;
