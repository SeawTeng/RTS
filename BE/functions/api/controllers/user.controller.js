import {UserRepository} from "../../repositories/index.js";
import jwt from "jsonwebtoken";
import encUtf8 from "crypto-js/enc-utf8.js";
import AES from "crypto-js/aes.js";

/**
 * UserController
*/
class UserController {
  /**
   * check if token valid
   * @param {any} req
  */
  async checkAuth(req) {
    const auth = await UserRepository.checkAuthenticate(req);
    if (auth.message) {
      return true;
    }

    return false;
  }

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
   *  @param {string} id
  */
  async getById(id) {
    return await UserRepository.getById(id);
  }

  /**
   *  @param {any} req
  */
  async create(req) {
    const bytes = AES.decrypt(req.body.data, process.env.JWT_SECRET);
    const decryptedData = JSON.parse(bytes.toString(encUtf8));

    const exist = await UserRepository.firebaseCollection
        .where("email", "==", decryptedData.email)
        .get();
    if (!exist.empty) {
      throw new Error(`This email is in used please try with 
        another email or login with your password!`,
      );
    }

    decryptedData.planType = "basic";
    decryptedData.planid = "";
    decryptedData.status = "active";
    decryptedData.isDeleted = false;

    return await UserRepository.add(req, decryptedData);
  }

  /**
   *  @param {any} req
  */
  async update(req) {
    const bytes = AES.decrypt(req.body.data, process.env.JWT_SECRET);
    const userDto = JSON.parse(bytes.toString(encUtf8));
    userDto.id = req.params.id;

    return await UserRepository.set(req, userDto);
  }

  /**
   *  @param {any} req
  */
  async updatePassword(req) {
    const token = req.headers["authorization"];
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

    return await UserRepository.set(req, newPassword);
  }

  /**
   *  @param {any} req
  */
  async resetPassword(req) {
    return await UserRepository.resetPassword(req);
  }

  /**
   *  @param {any} req
  */
  async validateResetPassword(req) {
    return await UserRepository.validateResetPassword(req);
  }

  /**
   *  @param {any} req
  */
  async updateResetPassword(req) {
    return await UserRepository.updateResetPassword(req);
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
