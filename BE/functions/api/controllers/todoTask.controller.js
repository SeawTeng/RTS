import {TodoTaskRepository} from "../../repositories/index.js";
import jwt from "jsonwebtoken";

/**
 * TodoTaskController
*/
class TodoTaskController {
  /**
   *  @param {any} req
  */
  async getAllByUser(req) {
    return await TodoTaskRepository.getAllByUser(req);
  }

  /**
   *  @param {any} req
  */
  async getAllByCategory(req) {
    return await TodoTaskRepository.getAllByCategory(req);
  }

  /**
   *  @param {string} id
  */
  async getById(id) {
    return await TodoTaskRepository.getById(id);
  }

  /**
   *  @param {any} req
   *  @param {TodoTask} todoTaskDto
  */
  async create(req, todoTaskDto) {
    const token = req.headers["authorization"];
    const userId = jwt.decode(token, process.env.JWT_SECRET).id;

    todoTaskDto.isDeleted = false;
    todoTaskDto.status = "active";
    const userDocRef = await TodoTaskRepository.db
        .doc(`users/${userId}`);
    todoTaskDto.userId = userDocRef;

    if (todoTaskDto.categoryId) {
      const categoryDocRef = await TodoTaskRepository.db
          .doc(`todoCategory/${todoTaskDto.categoryId}`);
      todoTaskDto.categoryId = categoryDocRef;
    }

    return await TodoTaskRepository.add(req, todoTaskDto);
  }

  /**
   *  @param {any} req
  */
  async update(req) {
    const data = req.body;

    if (data.categoryId) {
      const categoryDocRef = await TodoTaskRepository.db
          .doc(`todoCategory/${data.categoryId}`);
      data.categoryId = categoryDocRef;
    }
    data.id = req.params.id;

    return await TodoTaskRepository.set(req, data);
  }

  /**
   *  @param {string} id
  */
  async delete(id) {
    const existingUser = await TodoTaskRepository.delete(id);
    if (!existingUser) throw new Error("Error");

    return {
      message: "Category have been successfully deleted!",
    };
  }
}

export default new TodoTaskController();
