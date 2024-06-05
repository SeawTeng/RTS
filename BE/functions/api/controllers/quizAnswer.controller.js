import {QuizAnswerRepository} from "../../repositories/index.js";
import jwt from "jsonwebtoken";

/**
 * quizAnswerController
*/
class QuizAnswerController {
  /**
   *  get all quiz answer
   * @param {any} req
  */
  async getAll(req) {
    return await QuizAnswerRepository.getAll(req);
  }

  /**
   *  @param {string} id
  */
  async getById(id) {
    return await QuizAnswerRepository.getById(id);
  }

  /**
   *  @param {any} req
   *  @param {QuizAnswer} quizAnswerDto
  */
  async create(req, quizAnswerDto) {
    const token = req.headers["authorization"];
    const userId = jwt.decode(token, process.env.JWT_SECRET).id;

    quizAnswerDto.isDeleted = false;
    const userDocRef = await QuizAnswerRepository.db
        .doc(`users/${userId}`);
    const questionDocRef = await QuizAnswerRepository.db
        .doc(`quizQuestion/${quizAnswerDto.questionId}`);
    quizAnswerDto.userId = userDocRef;
    quizAnswerDto.questionId = questionDocRef;

    return await QuizAnswerRepository.add(req, quizAnswerDto);
  }

  /**
   *  @param {any} req
  */
  async update(req) {
    const data = req.body;
    data.id = req.params.id;

    return await QuizAnswerRepository.set(req, data);
  }

  /**
   *  @param {any} req
  */
  async delete(req) {
    const existingAns = await QuizAnswerRepository.delete(req);
    if (!existingAns) throw new Error("Error");

    return {
      message: "Quiz Answer have been successfully deleted!",
    };
  }
}

export default new QuizAnswerController();
