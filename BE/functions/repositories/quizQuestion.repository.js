import FirebaseRepository from "./utils/firebase.repository.js";

/**
 * QuizQuestionRepository
 */
class QuizQuestionRepository extends FirebaseRepository {
  /**
   * collection quiz question
   */
  constructor() {
    super("quizQuestion");
  }

  /**
   * get all quiz question data
  */
  async getAll() {
    const response = await this.firebaseCollection
        .where("isDeleted", "==", false)
        .orderBy("lastUpdatedTime", "desc")
        .get();
    return this.processFirebaseResponse(response, true);
  }

  /**
   * get active quiz
  */
  async getActiveQuiz() {
    const response = await this.firebaseCollection
        .where("isDefault", "==", true)
        .where("status", "==", "active")
        .where("isDeleted", "==", false)
        .get();

    if (response.empty || response.isDeleted) {
      throw new Error("There is no active quiz.");
    }

    const data = this.processFirebaseResponse(response);

    return data;
  }
}

export default new QuizQuestionRepository();
