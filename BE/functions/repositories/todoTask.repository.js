import FirebaseRepository from "./utils/firebase.repository.js";
import jwt from "jsonwebtoken";

/**
 * TodoTaskRepository
 */
class TodoTaskRepository extends FirebaseRepository {
  /**
   * collection todo task
   */
  constructor() {
    super("todoTask");
  }

  /**
   * get all task of user
   * @param {any} req
  */
  async getAllByUser(req) {
    const token = req.headers["authorization"];
    const userId = jwt.decode(token, process.env.JWT_SECRET).id;

    const userDocRef = await this.db
        .doc(`users/${userId}`);

    let response = null;

    if (!req.body.showCompleted) {
      response = await this.firebaseCollection
          .where("userId", "==", userDocRef)
          .where("isDeleted", "==", false)
          .where("status", "==", "active")
          .orderBy("endDate")
          .get();
    } else {
      response = await this.firebaseCollection
          .where("userId", "==", userDocRef)
          .where("isDeleted", "==", false)
          .orderBy("endDate")
          .get();
    }

    response = this.processFirebaseResponse(response, true);
    response = [
      ...response.filter((x) => x.status == "active"),
      ...response.filter((x) => x.status != "active"),
    ];

    return response;
  }

  /**
   * get all task by category
   * @param {any} req
  */
  async getAllByCategory(req) {
    const token = req.headers["authorization"];
    const userId = jwt.decode(token, process.env.JWT_SECRET).id;

    const userDocRef = await this.db
        .doc(`users/${userId}`);
    const categoryDocRef = await this.db
        .doc(`todoCategory/${req.params.id}`);

    let response = null;
    if (!req.body.showCompleted) {
      response = await this.firebaseCollection
          .where("userId", "==", userDocRef)
          .where("categoryId", "==", categoryDocRef)
          .where("isDeleted", "==", false)
          .where("status", "==", "active")
          .orderBy("endDate")
          .get();
    } else {
      response = await this.firebaseCollection
          .where("userId", "==", userDocRef)
          .where("categoryId", "==", categoryDocRef)
          .where("isDeleted", "==", false)
          .orderBy("endDate")
          .get();
    }

    response = this.processFirebaseResponse(response, true);

    response = [
      ...response.filter((x) => x.status == "active"),
      ...response.filter((x) => x.status != "active"),
    ];
    return response;
  }

  /**
   * get all active task
   * @param {any} req
  */
  async getActiveTask(req) {
    const data = [];
    const response = await this.getAllByUser(req);

    const alarms = [];
    alarms.push({
      action: "audio",
      description: "Reminder",
      trigger: {hours: 2, minutes: 30, before: true},
      repeat: 2,
      attachType: "VALUE=URI",
      attach: "Glass",
    });

    for (const r of response) {
      const date = r.endDate.split(" ")[0].split("-");
      const time = r.endDate.split(" ")[1].split(":");
      const event = {
        start: [
          Number(date[0]),
          Number(date[1]),
          Number(date[2]),
          Number(time[0]),
          Number(time[1]),
        ],
        duration: {hours: 1},
        title: r.title,
        description: r.description,
        alarms: alarms,
      };

      data.push(event);
    }
    return data;
  }
}

export default new TodoTaskRepository();
