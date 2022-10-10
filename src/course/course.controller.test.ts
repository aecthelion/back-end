import Course, { ICourse } from "@src/models/Course";
import { CourseController } from "@src/course/course.controller";
import { CourseService } from "@src/course/course.service";
import { ForbiddenException } from "./../utils/exceptions/forbidden.exception";

describe("Course controller", () => {
  const courseController = new CourseController();

  describe("Course creation controller and return Course object", () => {
    let createCourseMock: jest.SpyInstance<Promise<ICourse>>;

    const testPayload = {
      title: "Test Course",
      type: "full-time",
    };
    beforeAll(() => {
      createCourseMock = jest.spyOn(CourseService.prototype, "createCourse");
    });

    it("Should create new course and return course object", async () => {
      createCourseMock.mockImplementationOnce(
        async () => new Course({ ...testPayload })
      );
      const result = await courseController.createCourse({
        body: testPayload,
        user: {
          role: "admin",
        },
      } as any);

      expect(result).toHaveProperty("_id");
      const { _id, __v, ...actualCourse } = result.toJSON();
      expect(actualCourse).toEqual({
        ...testPayload,
      });
    });

    it("Should return forbidden exception", async () => {
      createCourseMock.mockImplementationOnce(
        async () => new Course({ ...testPayload })
      );
      try {
        await courseController.createCourse({
          body: testPayload,
          user: {
            role: "user",
          },
        } as any);
      } catch (e: any) {
        const { message } = e;
        expect(message).toBe("You are not allowed to create course");
      }
    });
  });
});
