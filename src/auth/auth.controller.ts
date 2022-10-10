import { Request } from "express";
import { validationResult } from "express-validator";
import authService from "@src/auth/auth.service";
import { BadRequestException } from "@src/utils/exceptions";

interface IRegisterBody {
  password: string;
  email: string;
  firstName: string;
  lastName: string;
  avatar: string;
}

interface ILoginBody {
  password: string;
  email: string;
}

export class AuthController {
  async register(
    req: Request<any, any, IRegisterBody>
  ): Promise<{ message: string }> {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      throw new BadRequestException(
        "Invalid registration data",
        errors.array()
      );
    }
    const { password, email, firstName, lastName } = req.body;
    const avatar = `/uploads/${req.file?.filename}`;
    await authService.registerUser(
      email,
      password,
      firstName,
      lastName,
      avatar
    );

    return { message: "User created" };
  }
  async login(
    req: Request<any, any, ILoginBody>
  ): Promise<Record<string, any>> {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      throw new BadRequestException("Invalid login data", errors.array());
    }

    const { password, email } = req.body;

    const { token, role, userId, firstName, lastName, avatar } =
      await authService.loginUser(email, password);

    return {
      token,
      role,
      userId,
      firstName,
      lastName,
      email,
      avatar,
    };
  }
}
