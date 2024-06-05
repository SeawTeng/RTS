import Entity from "./entity.js";
import moment from "moment";

/**
 * QuizAnswer entity
*/
class QuizAnswer extends Entity {
  /**
    * @param {string} id
    * @param {any} learnerType
    * @param {any} questionAnswer
    * @param {string} questionId
    * @param {string} userId
    * @param {string} lastCreatedBy
    * @param {string} lastUpdatedBy
    * @param {string} lastCreatedTime
    * @param {string} lastUpdatedTime
    * @param {boolean} isDeleted
  */
  constructor(
      id,
      learnerType,
      questionAnswer,
      questionId,
      userId,
      lastCreatedBy,
      lastUpdatedBy,
      lastCreatedTime,
      lastUpdatedTime,
      isDeleted,
  ) {
    super(id);

    if (!learnerType) throw new TypeError("Learner Type requires");
    if (!questionAnswer) throw new TypeError("Question Answer required");

    this.learnerType = learnerType;
    this.questionAnswer = questionAnswer;
    this.questionId = questionId;
    this.userId = userId;
    this.lastCreatedTime =
        moment(lastCreatedTime).format("DD-MM-YYYY HH:mm:ss") ||
        moment().format("DD-MM-YYYY HH:mm:ss");
    this.lastUpdatedTime =
        moment(lastUpdatedTime).format("DD-MM-YYYY HH:mm:ss") ||
        moment().format("DD-MM-YYYY HH:mm:ss");
    this.isDeleted = isDeleted;
    this.lastCreatedBy = lastCreatedBy;
    this.lastUpdatedBy = lastUpdatedBy;
  }
}

export default QuizAnswer;
