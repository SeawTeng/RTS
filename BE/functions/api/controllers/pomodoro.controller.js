import { PomodoroRepository } from "../../repositories/index.js";
import jwt from "jsonwebtoken";

class PomodoroController {

    /**
 *  @param {any} req
*/
    async getAllByUser(req) {
        return await PomodoroRepository.getAllByUser(req);
    }


    /**
     *  @param {any} req
     *  @param {any} pomodoroSessions
    */
    async create(req, pomodoroSessions) {
        const token = req.headers["authorization"];
        const userId = jwt.decode(token, process.env.JWT_SECRET).id;

        const userDocRef = await PomodoroRepository.db
            .doc(`users/${userId}`);
        pomodoroSessions.userId = userDocRef;

        return await PomodoroRepository.add(req, pomodoroSessions);
    }

}

export default new PomodoroController();