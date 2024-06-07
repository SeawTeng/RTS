import FirebaseRepository from "./utils/firebase.repository.js";
import jwt from "jsonwebtoken";
import moment from "moment";

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

    let response = await this.firebaseCollection
        .where("isDeleted", "==", false)
        .where("userId", "==", userDocRef)
        .orderBy("lastUpdatedTime", "desc")
        .get();

    response = this.processFirebaseResponse(response, true);
    response.sort((a, b) => {
      return moment(a.lastCreatedTime).isBefore(moment(b.lastCreatedTime));
    });

    return response;
  }
}

export default new QuizAnswerRepository();
