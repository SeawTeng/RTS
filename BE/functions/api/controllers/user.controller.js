import { UserRepository } from '../../repositories/index.js';
import jwt from "jsonwebtoken";

class UserController {

    async getAll() {
        return await UserRepository.getAll();
    }

    async login(req, res) {
        const user = await UserRepository.login(req, res);
        const newUser = Object.assign({}, user, req.body);
        delete newUser.password;
        return newUser;
    }

    async logout(req, res) {
        const logout = await UserRepository.logout(req, res);
        return logout;
    }

    async getById(id) {
        return await UserRepository.getById(id);
    }

    async create(userDto) {
        const exist = await UserRepository.firebaseCollection
            .where('email', '==', userDto.email)
            .get();
        if (!exist.empty) {
            return `This email is in used please try with another email or login with your password!`
        }

        return await UserRepository.add(userDto);
    }

    async update(id, userDto) {
        userDto.id = id;

        return await UserRepository.set(userDto);
    }

    async updatePassword(req) {
        const token = req.headers["cookie"].split('=')[1];
        const existingUser = await UserRepository.getById(jwt.decode(token, process.env.JWT_SECRET).id);
        if (!existingUser) throw new Error('User does not exist!');

        const data = req.body;
        if (data.old_password != existingUser.password) {
            throw new Error('Incorrect old password');
        }

        if (data.old_password == data.new_password) {
            throw new Error('Old password cannot be same as new password');
        }

        const newPassword = {
            password: data.new_password,
            id: existingUser.id
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