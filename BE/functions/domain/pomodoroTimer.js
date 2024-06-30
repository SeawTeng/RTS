import Entity from "./entity.js";
import moment from "moment";

/**
 * TodoTask entity
*/
class pomodoroTimer extends Entity {
  /**
    * @param {string} id
    * @param {string} userId
    * @param {string} taskName
    * @param {string} startDateTime
    * @param {string} endDateTime
    * @param {boolean} pomodoroSession
    * @param {boolean} breakSession
    * @param {integer} minutesTaken
    * @param {integer} secondsTaken
    * @param {string} lastCreatedBy
    * @param {string} lastUpdatedBy
    * @param {string} lastCreatedTime
    * @param {string} lastUpdatedTime
    * @param {boolean} isDeleted
  */
  constructor(
      id,
      userId,
      taskName,
      startDateTime,
      endDateTime,
      pomodoroSession,
      breakSession,
      minutesTaken,
      secondsTaken,
      lastCreatedBy,
      lastUpdatedBy,
      lastCreatedTime,
      lastUpdatedTime,
      isDeleted
  ) {
    super(id);

    if (!userId) throw new TypeError("User ID required");
    // if (!title) throw new TypeError("Title required");
    // if (!endDate) throw new TypeError("End Date required");

    this.userId = userId;
    this.taskName = taskName;
    this.startDateTime = moment(startDateTime).format("DD-MM-YYYY HH:mm:ss");
    this.endDateTime = moment(startDateTime).format("DD-MM-YYYY HH:mm:ss");
    this.pomodoroSession = pomodoroSession;
    this.breakSession = breakSession;
    this.minutesTaken = minutesTaken;
    this.secondsTaken = secondsTaken;
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

export default pomodoroTimer;
