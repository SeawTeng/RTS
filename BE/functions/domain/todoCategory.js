import Entity from "./entity.js";
import moment from "moment";

/**
 * TodoCategory entity
*/
class TodoCategory extends Entity {
  /**
    * @param {string} id
    * @param {string} categoryName
    * @param {string} userId
    * @param {string} lastCreatedBy
    * @param {string} lastUpdatedBy
    * @param {string} lastCreatedTime
    * @param {string} lastUpdatedTime
    * @param {boolean} isDeleted
  */
  constructor(
      id,
      categoryName,
      userId,
      lastCreatedBy,
      lastUpdatedBy,
      lastCreatedTime,
      lastUpdatedTime,
      isDeleted
  ) {
    super(id);

    if (!categoryName) throw new TypeError("Category Name requires");
    if (!userId) throw new TypeError("User ID required");

    this.categoryName = categoryName;
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

export default TodoCategory;
