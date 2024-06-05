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
   *  @param {any} req
  */
  async delete(req) {
    const categoryDocRef = await TodoCategoryRepository.db
        .doc(`todoCategory/${req.params.id}`);

    const response = await TodoCategoryRepository
        .db.collection("todoTask")
        .where("categoryId", "==", categoryDocRef)
        .where("status", "==", "active")
        .get();

    if (!response.empty) {
      throw new Error(
          "There are tasks under this category that are not completed!");
    } else {
      const taskRes = await TodoCategoryRepository
          .db.collection("todoTask")
          .where("categoryId", "==", categoryDocRef).get();
      taskRes.forEach(async (element) => {
        await TodoCategoryRepository.db
            .doc(`todoTask/${element.id}`)
            .update({isDeleted: true});
      });
    }

    const existingUser = await TodoCategoryRepository.delete(req);
    if (!existingUser) throw new Error("Error");

    return {
      message: "Category have been successfully deleted!",
    };
  }
}

export default new TodoCategoryController();
