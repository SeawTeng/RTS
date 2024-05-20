import { UserRepository } from '../../repositories/index.js';
import { Users } from '../../domain/users/index.js';

class UserController {

    async getAll() {
        return await UserRepository.getAll();
    }

    async getById(id) {
        return await UserRepository.getById(id);
    }

    async create(userDto) {
        const newUser = this.parse(userDto);
        await UserRepository.set(newUser);
        return newUser.id;
    }

    async update(id, userDto) {
        const existingUser = await UserRepository.getById(id);
        if (!existingUser) throw new Error('Error');

        const newUser = Object.assign({}, existingUser, userDto);
        newUser.id = id;

        await UserRepository.set(this.parse(newUser));
    }

    async delete(id) {
        const existingUser = await UserRepository.getById(id);
        if (!existingUser) throw new Error('Error');

        await UserRepository.delete(id);
    }

    parse(userDto) {
        if (!userDto) throw new Error('User not found.');

        const { username, lastName, firstName, password, id } = userDto;
        return new Users(username, lastName, firstName, password, id);
    }
}

export default new UserController();