import UserApplication, {
  IUserApplication,
} from "./../models/UserApplicationSchema";
import { UserApplicationController } from "./userApplication.controller";
import { UserApplicationService } from "./userApplication.service";
describe("UserApplication controller", () => {
  const userApplicationController = new UserApplicationController();

  describe("UserApplication creation controller and return Application object", () => {
    let createApplicationMock: jest.SpyInstance<Promise<IUserApplication>>;

    const testPayload = {
      courseId: "6339968b08de3a384d052255",
      englishLvl: "elementary",
      technicalBackground: "beginner",
      status: "pending",
    };
    beforeAll(() => {
      createApplicationMock = jest.spyOn(
        UserApplicationService.prototype,
        "createApplication"
      );
    });

    it("Should create new user application and return application object", async () => {
      createApplicationMock.mockImplementationOnce(
        async () => new UserApplication({ ...testPayload })
      );
      const result = await userApplicationController.createApplication({
        body: testPayload,
        user: {
          role: "user",
          id: "63321b9896afa14f0dd6807",
        },
      } as any);

      expect(result).toHaveProperty("_id");
      const { _id, __v, user, ...actualApplication } = result.toJSON();
      expect(actualApplication).toEqual({
        ...testPayload,
      });
    });
  });
});
