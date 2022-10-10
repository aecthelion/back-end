import { VacancyController } from "./vacancy.controller";
import { IVacancy } from "./../models/Vacancy";
import { VacancyService } from "./vacancy.service";
import Vacancy from "@models/Vacancy";

describe("Vacancy controller", () => {
  const vacancyController = new VacancyController();

  describe("Vacancy creation controller", () => {
    let createVacancyMock: jest.SpyInstance<Promise<IVacancy>>;

    const testPayload = {
      jobTitle: "Test job",
      companyName: "test company",
      vacancyLink: "https://www.google.com/",
      country: "Ukraine",
      city: "Lviv",
      status: "0",
      vacancyType: "full-time",
    };
    beforeAll(() => {
      createVacancyMock = jest.spyOn(VacancyService.prototype, "createVacancy");
    });

    it("Should create new user application and return application object", async () => {
      createVacancyMock.mockImplementationOnce(
        async () => new Vacancy({ ...testPayload })
      );
      const result = await vacancyController.createVacancy({
        body: testPayload,
        user: {
          role: "user",
          id: "63321b9896afa14f0dd6807",
        },
      } as any);

      expect(result).toHaveProperty("_id");
      const { _id, __v, user, ...actualVacancy } = result.toJSON();
      expect(actualVacancy).toEqual({
        ...testPayload,
      });
    });
  });
});
