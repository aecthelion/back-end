import { BadRequestException, ForbiddenException } from "@utils/exceptions";
import { Request } from "express";
import { validationResult } from "express-validator";
import { DEFAULT_PAGE_SIZE } from "@utils/constants";
import { UserApplicationService } from "./userApplication.service";
import {
  IUserApplication,
  IUserApplicationListResponse,
} from "./../models/UserApplicationSchema";

export interface ICreateUserApplicationBody {
  courseId: string;
  englishLvl: string;
  technicalBackground: string;
  status: string;
}

export interface IUpdateUserApplicationBody {
  status: string;
}

const userApplicationService = new UserApplicationService();

export class UserApplicationController {
  async createApplication(
    req: Request<any, any, ICreateUserApplicationBody>
  ): Promise<IUserApplication> {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      throw new BadRequestException(
        "Invalid application creating data",
        errors.array()
      );
    }
    const currentUserId = req.user?.id;
    const { courseId, technicalBackground, englishLvl, status } = req.body;

    if (!currentUserId) {
      throw new ForbiddenException(
        "You are not allowed to create vacancy application",
        errors.array()
      );
    }
    return userApplicationService.createApplication(
      currentUserId,
      courseId,
      englishLvl,
      technicalBackground,
      status
    );
  }

  async updateUserApplication(
    req: Request<any, any, IUpdateUserApplicationBody>
  ): Promise<{ message: string; status: string; id: string }> {
    const { id } = req.params;
    const { status } = req.body;

    await userApplicationService.updateUserApplication(id, status);

    return {
      message: "Application successfully updated",
      status,
      id,
    };
  }

  async deleteUserApplication(
    req: Request<any, any>
  ): Promise<{ message: string; id: string }> {
    const { id } = req.params;

    await userApplicationService.deleteUserApplication(id);

    return {
      message: "Application successfully deleted",
      id,
    };
  }

  getUserApplicationList(
    req: Request<
      any,
      any,
      any,
      { page: number; pageSize: number; filter: string; searchParams: string }
    >
  ): Promise<IUserApplicationListResponse | IUserApplication[]> {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      throw new BadRequestException("Invalid query parameters", errors.array());
    }

    const {
      page = 1,
      pageSize = DEFAULT_PAGE_SIZE,
      filter = "",
      searchParams = "",
    } = req.query;

    const currentUserId = req.user?.id;
    const currentUserRole = req.user?.role;
    if (Array.isArray(page) || Array.isArray(pageSize)) {
      throw new BadRequestException("Invalid query parameters");
    }

    return userApplicationService.getUserApplicationList(
      page,
      pageSize,
      searchParams,
      currentUserId,
      currentUserRole
    );
  }
}
