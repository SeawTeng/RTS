import Entity from "./entity.js";
import moment from "moment";

/**
 * DiscussionComment entity
*/
class DiscussionComment extends Entity {
  /**
    * @param {string} id
    * @param {string} comment
    * @param {string} userId
    * @param {string} userName
    * @param {string} discussionId
    * @param {string} lastCreatedBy
    * @param {string} lastUpdatedBy
    * @param {string} lastCreatedTime
    * @param {string} lastUpdatedTime
    * @param {boolean} isDeleted
  */
  constructor(
      id,
      comment,
      userId,
      userName,
      discussionId,
      lastCreatedBy,
      lastUpdatedBy,
      lastCreatedTime,
      lastUpdatedTime,
      isDeleted
  ) {
    super(id);

    if (!userId) throw new TypeError("User ID required");
    if (!discussionId) throw new TypeError("Discussion ID required");

    this.categoryName = comment;
    this.userId = userId;
    this.userName = userName;
    this.discussionId = discussionId;
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

export default DiscussionComment;
