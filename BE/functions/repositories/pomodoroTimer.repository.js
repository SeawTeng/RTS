import FirebaseRepository from "./utils/firebase.repository.js";
import jwt from "jsonwebtoken";

/**
 * PomodoroTimerRepository
 */
class PomodoroTimerRepository extends FirebaseRepository {
  /**
   * collection todo task
   */
  constructor() {
    super("pomodoroTimer");
  }

  /**
   * get all task of user
   * @param {any} req
  */
  async getAll(req) {
    const token = req.headers["authorization"];
    const userId = jwt.decode(token, process.env.JWT_SECRET).id;

    const userDocRef = await this.db
        .doc(`users/${userId}`);

    let response = null;


    response = await this.firebaseCollection
        .where("userId", "==", userDocRef)
        .where("isDeleted", "==", false)
        .orderBy("endDateTime")
        .get();


    response = this.processFirebaseResponse(response, true);
    return response;
  }
}

export default new PomodoroTimerRepository();
