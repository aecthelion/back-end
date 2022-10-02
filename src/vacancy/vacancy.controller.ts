import {BadRequestException, ForbiddenException} from '@utils/exceptions'
import {Request} from 'express'
import {validationResult} from 'express-validator'
import {DEFAULT_PAGE_SIZE} from '@utils/constants'
import {IVacancy} from "@models/Vacancy";
import {VacancyService} from "@src/vacancy/vacancy.service";

export interface ICreateVacancyBody {
    jobTitle: string
    companyName: string
    vacancyLink: string
    country: string
    city: string
    status: number
    vacancyType: string
}

export interface IUpdateVacancyBody {
    status: string
}

const vacancyService = new VacancyService()

export class VacancyController {

    async createVacancy(req: Request<any, any, ICreateVacancyBody>): Promise<IVacancy> {
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            throw new BadRequestException(
                'Invalid application creating data',
                errors.array()
            )
        }
        const currentUserId = req.user?.id
        const {
            jobTitle,
            companyName,
            vacancyLink,
            country,
            city,
            status,
            vacancyType,
        } = req.body

        if (!currentUserId) {
            throw new ForbiddenException(
                'You are not allowed to create vacancy application',
                errors.array()
            )
        }
        return vacancyService.createVacancy(
            currentUserId,
            jobTitle,
            companyName,
            vacancyLink,
            country,
            city,
            status,
            vacancyType,
        )
    }

    async updateVacancy(
        req: Request<any, any, IUpdateVacancyBody>
    ): Promise<{ message: string, status: string, _id: string }> {
        const {id} = req.params
        const {
            status
        } = req.body

        await vacancyService.updateVacancy(id, status)

        return {message: 'Vacancy application updated', status: status, _id:id}
    }

    //making pagination - page: 1+; pageSize: 1+
    getVacancyList(
        req: Request<any,
            any,
            any,
            { page: number; pageSize: number; filter: string; searchParams: string }>
    ): Promise<IVacancy[]> {
        const errors = validationResult(req)

        if (!errors.isEmpty()) {
            throw new BadRequestException('Invalid query parameters', errors.array())
        }

        const {
            page = 1,
            pageSize = DEFAULT_PAGE_SIZE,
            filter = '',
            searchParams = ''
        } = req.query

        const currentUserId = req.user?.id
        if (Array.isArray(page) || Array.isArray(pageSize)) {
            throw new BadRequestException('Invalid query parameters')
        }

        return vacancyService.getVacancyList(page, pageSize, searchParams, currentUserId)
    }
}
