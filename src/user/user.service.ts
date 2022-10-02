import User, {IUser} from '@models/User' // '@models/User'
import bcrypt from 'bcrypt'
import {NotFoundException} from "@utils/exceptions";
import {IUserListResponse} from "@src/user/user.controller";


class UserService {
    async updateUser(
        id: string,
        email: string,
        firstName: string,
        lastName: string,
        role: string,
        password?: any
    ) {
        if (password) {
            const hashedPassword: string = await bcrypt.hash(password, 12)
            await User.updateOne(
                {_id: id},
                {$set: {email, password: hashedPassword, firstName, lastName, role}}
            )

        } else {
            await User.updateOne(
                {_id: id},
                {$set: {email, firstName, lastName, role}}
            )
        }

        const updatedUser = await User.findOne({_id: id})

        return {
            message: 'User updated',
            user: updatedUser
        }
    }

    async getUsersList(
        page: number,
        pageSize: number,
        searchParams?: string
    ): Promise<IUserListResponse | IUser[]> {
        if (!searchParams) {
            const allUsers = await User.find()
                .limit(pageSize)
                .skip((page - 1) * pageSize)
                .exec()

            const count = await User.count();
            return {
                users: allUsers,
                totalPages: Math.ceil(count / pageSize),
                currentPage: page,
            }
        }
        const users = await User.find({
            $text: {$search: searchParams}
        })

        if (users.length === 0) {
            throw new NotFoundException('No users found, please retry')
        }

        return {users, totalPages: 1, currentPage: 1}
    }
}

export default new UserService()
