import {QuizQuestionRepository} from "../../repositories/index.js";

/**
 * quizQuestionController
*/
class QuizQuestionController {
  /**
   *  @param {any} req
  */
  async getAll() {
    return await QuizQuestionRepository.getAll();
  }

  /**
   *  @param {string} id
  */
  async getById(id) {
    return await QuizQuestionRepository.getById(id);
  }

  /**
   *  get an active quiz question
  */
  async getActiveQuiz() {
    return await QuizQuestionRepository.getActiveQuiz();
  }

  /**
   *  @param {any} req
   *  @param {QuizQuestion} quizQuestionDto
  */
  async create(req, quizQuestionDto) {
    quizQuestionDto.isDeleted = false;
    return await QuizQuestionRepository.add(req, quizQuestionDto);
  }

  /**
   *  @param {any} req
  */
  async setDefault(req) {
    const prevDefault = await this.getActiveQuiz();
    prevDefault.isDefault = false;

    await QuizQuestionRepository.set(req, prevDefault);
    const newDefault = await QuizQuestionRepository.getById(req.params.id);
    newDefault.isDefault = true;

    return await QuizQuestionRepository.set(req, newDefault);
  }

  /**
   *  @param {any} req
  */
  async update(req) {
    const data = req.body;
    data.id = req.params.id;

    return await QuizQuestionRepository.set(req, data);
  }

  /**
   *  @param {any} req
  */
  async delete(req) {
    const existingQuiz = await QuizQuestionRepository.delete(req);
    if (!existingQuiz) throw new Error("Error");

    return {
      message: "Quiz Question have been successfully deleted!",
    };
  }
}

export default new QuizQuestionController();
