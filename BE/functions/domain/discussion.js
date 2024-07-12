import Entity from "./entity.js";
import moment from "moment";

/**
 * Discussion entity
*/
class Discussion extends Entity {
  /**
    * @param {string} id
    * @param {string} userId
    * @param {string} userName
    * @param {string} title
    * @param {string} content
    * @param {string} lastCreatedBy
    * @param {string} lastUpdatedBy
    * @param {string} lastCreatedTime
    * @param {string} lastUpdatedTime
    * @param {boolean} isDeleted
  */
  constructor(
      id,
      userId,
      userName,
      title,
      content,
      lastCreatedBy,
      lastUpdatedBy,
      lastCreatedTime,
      lastUpdatedTime,
      isDeleted
  ) {
    super(id);

    if (!title) throw new TypeError("Title required");
    if (!userId) throw new TypeError("User ID required");


    this.title = title;
    this.userId = userId;
    this.userName = userName;
    this.content = content;
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


export default Discussion;
