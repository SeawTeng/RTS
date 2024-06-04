import admin from "firebase-admin";
import p from "../../permission.json" assert { type: "json" };
import jwt from "jsonwebtoken";
import moment from "moment";

/**
 * FirebaseRepository
 */
class FirebaseRepository {
  /**
   * @param {any} collection
  */
  constructor(collection) {
    let defaultApp;

    if (!admin.apps?.length) {
      defaultApp = admin.initializeApp({
        credential: admin.credential.cert(p),
      });

      defaultApp.firestore().settings({timestampsInSnapshots: true});
    } else {
      defaultApp = admin.app();
    }

    this.db = defaultApp.firestore();
    this.collection = collection;
    this.firebaseCollection = this.db.collection(collection);
  }

  /**
   * @param {any} req
   * @param {any} res
  */
  async checkAuthenticate(req, res) {
    if (req.headers && req.headers["authorization"]) {
      const token = req.headers["authorization"];
      const decode = jwt.verify(token, process.env.JWT_SECRET);

      const user = await await this.db
          .doc(`users/${decode.id}`)
          .get();

      if (!user) {
        throw new Error( "unauthorized access!");
      }

      return {
        message: "authorized access!",
      };
    } else {
      throw new Error("unauthorized access!");
    }
  }

  /**
   * @param {any} req
   * @param {any} res
  */
  async login(req, res) {
    const response = await this.firebaseCollection
        .where("email", "==", req.email)
        .where("password", "==", req.password)
        .get();

    if (response.empty) {
      throw new Error("not found!");
    }

    const data = this.processFirebaseResponse(response);

    const token = jwt.sign(data, process.env.JWT_SECRET);
    data.token = token;

    return data;
  }

  /**
   * @param {string} id
  */
  async getById(id) {
    const response = await this.firebaseCollection
        .doc(id)
        .get();

    if (response.empty) {
      throw new Error(`${this.collection} with id ${id} does not exist!`);
    }

    const data = this.processDBResponse(response);
    data.id = id;

    return data;
  }

  /**
   * @param {any} req
   * @param {any} item
  */
  async add(req, item) {
    const token = req.headers["authorization"];
    let decode = null;
    if (token) {
      decode = jwt.verify(token, process.env.JWT_SECRET);
    }

    item.lastCreatedTime = moment().format("DD-MM-YYYY HH:mm:ss");
    item.lastUpdatedTime = moment().format("DD-MM-YYYY HH:mm:ss");
    item.lastCreatedBy = decode ? decode.email : "SYSTEM";
    item.lastUpdatedBy = decode ? decode.email : "SYSTEM";

    const response = await this.firebaseCollection
        .add(item);

    return item;
  }

  /**
   * @param {any} req
   * @param {any} item
  */
  async set(req, item) {
    const token = req.headers["authorization"];
    let decode = null;
    if (token) {
      decode = jwt.verify(token, process.env.JWT_SECRET);
    }

    item.lastCreatedTime = moment().format("DD-MM-YYYY HH:mm:ss");
    item.lastUpdatedTime = moment().format("DD-MM-YYYY HH:mm:ss");
    item.lastCreatedBy = decode ? decode.email : "SYSTEM";
    item.lastUpdatedBy = decode ? decode.email : "SYSTEM";

    await this.db
        .doc(`${this.collection}/${item.id}`)
        .update(item);

    return {
      message: `${this.collection} has successfully updated!`,
    };
  }

  /**
   * @param {any} req
  */
  async delete(req) {
    const token = req.headers["authorization"];
    let decode = null;
    if (token) {
      decode = jwt.verify(token, process.env.JWT_SECRET);
    }
    const data = {
      lastCreatedTime: moment().format("DD-MM-YYYY HH:mm:ss"),
      lastUpdatedTime: moment().format("DD-MM-YYYY HH:mm:ss"),
      lastCreatedBy: decode ? decode.email : "SYSTEM",
      lastUpdatedBy: decode ? decode.email : "SYSTEM",
      isDeleted: true,
    };

    const res = await this.db
        .doc(`${this.collection}/${req.params.id}`)
        .update(data);

    return res;
  }

  /**
   * @param {any} response
   * @return {any}
  */
  processFirebaseResponse(response, getAll = false) {
    const tempDoc = []
    response.forEach((doc) => {
      tempDoc.push({ ...doc.data(), id: doc.id })
    })

    if (getAll) {
      return tempDoc;
    }
    return tempDoc[0];
  }

  /**
   * @param {any} response
   * @return {any}
  */
  processDBResponse(response) {
    const data = {};
    for (const i in response._fieldsProto) {
      if (response._fieldsProto[i]) {
        data[i] = response._fieldsProto[i][response._fieldsProto[i].valueType];
      }
    }

    return data;
  }
}

export default FirebaseRepository;
