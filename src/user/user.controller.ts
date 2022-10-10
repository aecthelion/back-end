import { Request } from "express";
import userService from "@src/user/user.service";
import { BadRequestException, ForbiddenException } from "@src/utils/exceptions";
import { validationResult } from "express-validator";
import { DEFAULT_PAGE_SIZE } from "@utils/constants";
import { IUser } from "@models/User";

interface IUpdateProfileBody {
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  password?: any;
}

export interface IUserListResponse {
  users: IUser[];
  totalPages: number;
  currentPage: number;
}

class UserController {
  async updateProfile(
    req: Request<any, any, IUpdateProfileBody>
  ): Promise<any> {
    const { id } = req.params;
    let { password, email, firstName, lastName, role } = req.body;
    if (id !== req.user?.id && req.user?.role !== "admin") {
      throw new ForbiddenException(
        "You are not allowed to edit other's profile info"
      );
    }

    if (req.user?.role !== "admin") {
      role = "user";
    }

    return userService.updateUser(
      id,
      email,
      firstName,
      lastName,
      password,
      role
    );
  }

  getUsersList(
    req: Request<
      any,
      any,
      any,
      { page: number; pageSize: number; searchParams: string }
    >
  ): Promise<IUser[] | IUserListResponse> {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      throw new BadRequestException("Invalid query parameters", errors.array());
    }

    const {
      page = 1,
      pageSize = DEFAULT_PAGE_SIZE,
      searchParams = "",
    } = req.query;
    if (Array.isArray(page) || Array.isArray(pageSize)) {
      throw new BadRequestException("Invalid query parameters");
    }

    return userService.getUsersList(page, pageSize, searchParams);
  }
}
export default new UserController();
