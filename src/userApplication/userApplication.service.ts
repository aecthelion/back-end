import { NotFoundException } from "@src/utils/exceptions";
import UserApplication, {
  IUserApplication,
  IUserApplicationListResponse,
} from "@models/UserApplicationSchema";
import User from "@models/User";

export interface IApplicationUser {
  email: string;
  firstName: string;
  lastName: string;
  avatar: string;
  role: string;
  _id?: string;
}

export class UserApplicationService {
  async createApplication(
    currentUserId: string,
    courseId: string,
    englishLvl: string,
    technicalBackground: string,
    status: string
  ): Promise<IUserApplication> {
    const userApplication = new UserApplication({
      userId: currentUserId,
      courseId,
      englishLvl,
      technicalBackground,
      status,
    });
    return userApplication.save();
  }

  async updateUserApplication(
    id: string,
    status: string
  ): Promise<IUserApplication | null> {
    await UserApplication.updateOne(
      { _id: id },
      {
        $set: {
          status,
        },
      }
    );

    const updateUserApplication = await UserApplication.findById(id);

    return updateUserApplication;
  }

  async deleteUserApplication(id: string): Promise<any> {
    await UserApplication.deleteOne({ _id: id });
  }

  async getUserApplicationList(
    page: number,
    pageSize: number,
    searchParams?: string,
    currentUserId?: string,
    currentUserRole?: string
  ): Promise<IUserApplicationListResponse | IUserApplication[]> {
    let count = 1;
    let allApplications: any = [];
    if (currentUserRole !== "user") {
      const allUsers = await User.find();
      count = await UserApplication.count();
      allApplications = searchParams
        ? await UserApplication.find()
        : await UserApplication.find()
            .limit(pageSize)
            .skip((page - 1) * pageSize)
            .exec();
      allApplications = allApplications.map((ap: IUserApplication) => {
        const currentUser = allUsers.find((u) => u._id == ap.userId);

        return {
          _id: ap._id,
          userId: ap.userId,
          courseId: ap.courseId,
          englishLvl: ap.englishLvl,
          technicalBackground: ap.technicalBackground,
          status: ap.status,
          createdAt: ap.createdAt,
          updatedAt: ap.updatedAt,
          user: currentUser
            ? {
                email: currentUser.email,
                firstName: currentUser.firstName,
                lastName: currentUser.lastName,
                avatar: currentUser.avatar,
                role: currentUser.role,
              }
            : null,
        };
      });

      if (searchParams) {
        allApplications = allApplications.filter((ap: IUserApplication) => {
          if (
            ap.user &&
            `${ap.user.firstName} ${ap.user.lastName}`
              .toLocaleLowerCase()
              .includes(searchParams.toLocaleLowerCase())
          ) {
            return true;
          } else return false;
        });
      }
    } else {
      allApplications = await UserApplication.find({ userId: currentUserId });
    }

    if (allApplications.length === 0) {
      throw new NotFoundException("Nothing find, please retry");
    }

    return {
      applications: allApplications,
      totalPages:
        searchParams || currentUserRole === "user"
          ? 1
          : Math.ceil(count / pageSize),
      currentPage: searchParams || currentUserRole === "user" ? 1 : page,
    };
  }
}
