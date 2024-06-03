import {TodoCategoryRepository} from "../../repositories/index.js";
import jwt from "jsonwebtoken";

/**
 * TodoCategoryController
*/
class TodoCategoryController {
  /**
   *  @param {any} req
  */
  async getAll(req) {
    return await TodoCategoryRepository.getAll(req);
  }

  /**
   *  @param {string} id
  */
  async getById(id) {
    return await TodoCategoryRepository.getById(id);
  }

  /**
   *  @param {any} req
   *  @param {TodoCategory} todoCategoryDto
  */
  async create(req, todoCategoryDto) {
    const token = req.headers["authorization"];
    const userId = jwt.decode(token, process.env.JWT_SECRET).id;

    todoCategoryDto.isDeleted = false;
    const userDocRef = await TodoCategoryRepository.db
        .doc(`users/${userId}`);
    todoCategoryDto.userId = userDocRef;

    return await TodoCategoryRepository.add(req, todoCategoryDto);
  }

  /**
   *  @param {any} req
  */
  async update(req) {
    const data = req.body;
    data.id = req.params.id;

    return await TodoCategoryRepository.set(req, data);
  }

  /**
   *  @param {string} id
  */
  async delete(id) {
    const existingUser = await TodoCategoryRepository.delete(id);
    if (!existingUser) throw new Error("Error");

    return {
      message: "Category have been successfully deleted!",
    };
  }
}

export default new TodoCategoryController();
