import Entity from "./entity.js";
import moment from "moment";

/**
 * QuizQuestion entity
*/
class QuizQuestion extends Entity {
  /**
    * @param {string} id
    * @param {any} questionList
    * @param {any} typeList
    * @param {string} status
    * @param {string} lastCreatedBy
    * @param {string} lastUpdatedBy
    * @param {string} lastCreatedTime
    * @param {string} lastUpdatedTime
    * @param {boolean} isDeleted
    * @param {boolean} isDefault
  */
  constructor(
      id,
      questionList,
      typeList,
      status,
      lastCreatedBy,
      lastUpdatedBy,
      lastCreatedTime,
      lastUpdatedTime,
      isDeleted,
      isDefault
  ) {
    super(id);

    if (!questionList.length) throw new TypeError("Question List requires");
    if (!typeList.length) throw new TypeError("Type List required");

    this.questionList = questionList;
    this.typeList = typeList;
    this.status = status;
    this.lastCreatedTime =
        moment(lastCreatedTime).format("DD-MM-YYYY HH:mm:ss") ||
        moment().format("DD-MM-YYYY HH:mm:ss");
    this.lastUpdatedTime =
        moment(lastUpdatedTime).format("DD-MM-YYYY HH:mm:ss") ||
        moment().format("DD-MM-YYYY HH:mm:ss");
    this.isDeleted = isDeleted;
    this.lastCreatedBy = lastCreatedBy;
    this.lastUpdatedBy = lastUpdatedBy;
    this.isDefault = isDefault;
  }
}

export default QuizQuestion;
