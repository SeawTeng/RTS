import FirebaseRepository from "./utils/firebase.repository.js";
import jwt from "jsonwebtoken";

/**
 * QuizAnswerRepository
 */
class QuizAnswerRepository extends FirebaseRepository {
  /**
   * collection quiz answer
   */
  constructor() {
    super("quizAnswer");
  }

  /**
   * get quiz answer
   * @param {any} req
  */
  async getAll(req) {
    const token = req.headers["authorization"];
    const userId = jwt.decode(token, process.env.JWT_SECRET).id;

    const userDocRef = await this.db
        .doc(`users/${userId}`);

    const response = await this.firebaseCollection
        .where("isDeleted", "==", false)
        .where("userId", "==", userDocRef)
        .orderBy("lastUpdatedTime", "desc")
        .get();
    return this.processFirebaseResponse(response, true);
  }
}

export default new QuizAnswerRepository();
