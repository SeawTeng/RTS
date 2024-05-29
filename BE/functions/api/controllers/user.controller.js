import {UserRepository} from "../../repositories/index.js";
import jwt from "jsonwebtoken";
import encUtf8 from "crypto-js/enc-utf8.js";
import AES from "crypto-js/aes.js";

/**
 * UserController
*/
class UserController {
  /**
   * get all user data
  */
  async getAll() {
    return await UserRepository.getAll();
  }

  /**
   *  @param {any} req
   *  @param {any} res
  */
  async login(req, res) {
    const bytes = AES.decrypt(req.body.data, process.env.JWT_SECRET);
    const decryptedData = JSON.parse(bytes.toString(encUtf8));

    const user = await UserRepository.login(decryptedData, res);
    const newUser = Object.assign({}, user, req.body);
    delete newUser.password;
    return newUser;
  }

  /**
   *  @param {any} req
   *  @param {any} res
  */
  async logout(req, res) {
    const logout = await UserRepository.logout(req, res);
    return logout;
  }

  /**
   *  @param {string} id
  */
  async getById(id) {
    return await UserRepository.getById(id);
  }

  /**
   *  @param {string} userDto
  */
  async create(userDto) {
    const bytes = AES.decrypt(userDto, process.env.JWT_SECRET);
    const decryptedData = JSON.parse(bytes.toString(encUtf8));

    const exist = await UserRepository.firebaseCollection
        .where("email", "==", decryptedData.email)
        .get();
    if (!exist.empty) {
      throw new Error(`This email is in used please try with 
        another email or login with your password!`,
      );
    }

    return await UserRepository.add(decryptedData);
  }

  /**
   *  @param {string} id
   *  @param {Users} userDto
  */
  async update(id, userDto) {
    userDto.id = id;

    return await UserRepository.set(userDto);
  }

  /**
   *  @param {any} req
  */
  async updatePassword(req) {
    const token = req.headers["cookie"].split("=")[1];
    const existingUser = await UserRepository.getById(
        jwt.decode(token, process.env.JWT_SECRET).id
    );
    if (!existingUser) {
      throw new Error("User does not exist!");
    }

    const bytes = AES.decrypt(req.body.data, process.env.JWT_SECRET);
    const decryptedData = JSON.parse(bytes.toString(encUtf8));
    if (decryptedData.old_password != existingUser.password) {
      throw new Error("Incorrect old password");
    }

    if (decryptedData.old_password == decryptedData.new_password) {
      throw new Error("Old password cannot be same as new password");
    }

    const newPassword = {
      password: decryptedData.new_password,
      id: existingUser.id,
    };

    return await UserRepository.set(newPassword);
  }

  /**
   *  @param {string} id
  */
  async delete(id) {
    const existingUser = await UserRepository.delete(id);
    if (!existingUser) throw new Error("Error");

    return {
      message: "User have been successfully deleted!",
    };
  }
}

export default new UserController();
