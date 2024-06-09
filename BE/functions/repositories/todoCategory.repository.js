import FirebaseRepository from "./utils/firebase.repository.js";
import jwt from "jsonwebtoken";

/**
 * TodoCategoryRepository
 */
class TodoCategoryRepository extends FirebaseRepository {
  /**
   * collection todo category
   */
  constructor() {
    super("todoCategory");
  }

  /**
   * get all category data
   * @param {any} req
  */
  async getAll(req) {
    const token = req.headers["authorization"];
    const userId = jwt.decode(token, process.env.JWT_SECRET).id;

    const userDocRef = await this.db
        .doc(`users/${userId}`);

    let response = await this.firebaseCollection
        .where("userId", "==", userDocRef)
        .where("isDeleted", "==", false)
        .orderBy("categoryName", "asc")
        .get();

    response = this.processFirebaseResponse(response, true);
    response.sort((a, b) => {
      return a.categoryName.localeCompare(b.categoryName);
    });

    return response;
  }
}

export default new TodoCategoryRepository();
