import bcrypt from "bcrypt";
import User from "@models/User";
import jwt from "jsonwebtoken";
import config from "@src/config";
import { BadRequestException, NotFoundException } from "@src/utils/exceptions";

export interface IJwtPayload {
  sub: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
}

export class AuthService {
  async registerUser(
    email: string,
    password: string,
    firstName: string,
    lastName: string,
    avatar: string
  ) {
    const candidate = await User.findOne({ email });
    if (candidate) {
      throw new BadRequestException("User already exists");
    }

    const hashedPassword: string = await bcrypt.hash(password, 12);
    const user = new User({
      email,
      password: hashedPassword,
      firstName,
      lastName,
      avatar,
      role: "user",
    });

    await user.save();
  }

  async loginUser(email: string, password: string) {
    const user = await User.findOne({ email });
    if (!user) {
      throw new NotFoundException("User not found");
    }

    const isPasswordMatch: boolean = await bcrypt.compare(
      password,
      user.password
    );

    if (!isPasswordMatch) {
      throw new BadRequestException("Incorrect password, please try again");
    }
    const jwtSecret = config.get<string>("JWT_SECRET");
    const payload: IJwtPayload = {
      sub: user.id,
      email,
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role,
    };
    const token = jwt.sign(payload, jwtSecret, {
      expiresIn: config.get<string | number>("JWT_EXPIRATION_TIME"),
    });
    const loginData = {
      userId: user.id,
      role: user.role,
      token: token,
      firstName: user.firstName,
      lastName: user.lastName,
      password: user.password,
      avatar: user.avatar,
    };

    return loginData;
  }
}

export default new AuthService();
