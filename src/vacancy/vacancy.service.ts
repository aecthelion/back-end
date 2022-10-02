import {NotFoundException} from '@src/utils/exceptions'
import Vacancy, {IVacancy} from '@models/Vacancy'

export class VacancyService {
    async createVacancy(
        currentUserId: string,
        jobTitle: string,
        companyName: string,
        vacancyLink: string,
        country: string,
        city: string,
        status: number,
        vacancyType: string,
    ): Promise<IVacancy> {
        const vacancy = new Vacancy({
            userId: currentUserId,
            jobTitle,
            companyName,
            vacancyLink,
            country,
            city,
            status,
            vacancyType,
        })
        return vacancy.save()
    }

    async updateVacancy(id: string, status: string) {

        await Vacancy.updateOne(
            {_id: id},
            {
                $set: {
                    status
                }
            }
        )
    }

    async getVacancyList(
        page: number,
        pageSize: number,
        searchParams?: string,
        currentUserId?: string,
    ): Promise<IVacancy[]> {
        if (!searchParams) {
            return Vacancy.find({userId: currentUserId})
                .limit(pageSize)
                .skip((page - 1) * pageSize)
                .exec()
        }
        const vacancies = await Vacancy.find({
            $text: {$search: searchParams}, userId: currentUserId,
        })

        if (vacancies.length === 0) {
            throw new NotFoundException('Nothing find, please retry')
        }

        return vacancies
    }
}
