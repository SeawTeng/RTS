import { pomodoroTimerRepository } from "../../repositories/index.js";
import jwt from "jsonwebtoken";

/**
 * TodoTaskController
*/
class pomodoroTimerController {
    /**
     *  @param {any} req
    */
    async getAllByUser(req) {
        return await pomodoroTimerRepository.getAllByUser(req);
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

export default new pomodoroTimerController();
