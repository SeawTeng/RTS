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
  async getAllByUser(req) {
    const token = req.headers["authorization"];
    const userId = jwt.decode(token, process.env.JWT_SECRET).id;

    const userDocRef = await this.db
        .doc(`users/${userId}`);

    let response = null;

    if (!req.body.showCompleted) {
      response = await this.firebaseCollection
          .where("userId", "==", userDocRef)
          .where("isDeleted", "==", false)
          .orderBy("endDateTime")
          .get();
    } else {
      response = await this.firebaseCollection
          .where("userId", "==", userDocRef)
          .where("isDeleted", "==", false)
          .orderBy("endDateTime")
          .get();
    }

    response = this.processFirebaseResponse(response, true);
    response = [
      ...response.filter((x) => x.status == "active"),
      ...response.filter((x) => x.status != "active"),
    ];

    return response;
  }
}

export default new PomodoroTimerRepository();
