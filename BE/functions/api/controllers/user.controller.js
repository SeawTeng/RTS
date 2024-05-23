import { UserRepository } from '../../repositories/index.js';
import { Users } from '../../domain/users/index.js';

class UserController {

    async getAll() {
        return await UserRepository.getAll();
    }

    async login(userDto) {
        const user = await UserRepository.login(userDto);
        const newUser = Object.assign({}, user, userDto);
        delete newUser.password;
        return newUser;
    }

    async getById(id) {
        return await UserRepository.getById(id);
    }

    async create(userDto) {
        return await UserRepository.add(userDto);
    }

    async update(id, userDto) {
        userDto.id = id;

        return await UserRepository.set(userDto);
    }

    async updatePassword(data) {
        const existingUser = await UserRepository.getById(data.id);
        if (!existingUser) throw new Error('User does not exist!');

        if (data.old_password != existingUser.password) {
            throw new Error('Incorrect old password');
        }

        if (data.old_password == data.new_password) {
            throw new Error('Old password cannot be same as new password');
        }

        const newPassword = {
            password: data.new_password,
            id: data.id
        }

        return await UserRepository.set(newPassword);
    }

    async delete(id) {
        const existingUser = await UserRepository.delete(id);
        if (!existingUser) throw new Error('Error');

        return "User have been successfully deleted!";
    }
}

export default new UserController();