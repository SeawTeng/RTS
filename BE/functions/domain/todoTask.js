import Entity from "./entity.js";
import moment from "moment";

/**
 * TodoTask entity
*/
class TodoTask extends Entity {
  /**
    * @param {string} id
    * @param {string} categoryId
    * @param {string} userId
    * @param {string} title
    * @param {string} description
    * @param {string} endDate
    * @param {string} status
    * @param {string} lastCreatedBy
    * @param {string} lastUpdatedBy
    * @param {string} lastCreatedTime
    * @param {string} lastUpdatedTime
    * @param {boolean} isDeleted
  */
  constructor(
      id,
      categoryId,
      userId,
      title,
      description,
      endDate,
      status,
      lastCreatedBy,
      lastUpdatedBy,
      lastCreatedTime,
      lastUpdatedTime,
      isDeleted
  ) {
    super(id);

    if (!userId) throw new TypeError("User ID required");
    if (!title) throw new TypeError("Title required");
    if (!endDate) throw new TypeError("End Date required");

    this.categoryName = categoryId;
    this.userId = userId;
    this.title = title;
    this.description = description;
    this.endDate = moment(endDate).format("DD-MM-YYYY HH:mm:ss");
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
  }
}

export default TodoTask;
