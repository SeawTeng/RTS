import {pomodoroTimerRepository} from "../../repositories/index.js";
import jwt from "jsonwebtoken";

/**
 * TodoTaskController
*/
class PomodoroTimerController {
  /**
     *  @param {any} req
    */
  async getAll(req) {
    return await pomodoroTimerRepository.getAll(req);
  }

  /**
     *  @param {any} req
     *  @param {pomodoroTimer} pomoSess
    */
  async create(req, pomoSess) {
    const token = req.headers["authorization"];
    const userId = jwt.decode(token, process.env.JWT_SECRET).id;

    pomoSess.isDeleted = false;
    const userDocRef = await pomodoroTimerRepository.db
        .doc(`users/${userId}`);
    pomoSess.userId = userDocRef;

    return await pomodoroTimerRepository.add(req, pomoSess);
  }
}

export default new PomodoroTimerController();
