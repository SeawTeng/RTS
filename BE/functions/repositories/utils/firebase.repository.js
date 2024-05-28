import admin from "firebase-admin";
import p from "../../permission.json" assert { type: "json" };
import jwt from "jsonwebtoken";

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
    if (req.headers && req.headers["cookie"]) {
      const token = req.headers["cookie"].split("=")[1];

      const decode = jwt.verify(token, process.env.JWT_SECRET);

      const user = await await this.db
          .doc(`${this.collection}/${decode.id}`)
          .get();

      if (!user) {
        res.clearCookie("jwt");
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

    const id = response.docs[0].ref.id;
    const data = this.processFirebaseResponse(response)[0];
    data.id = id;

    const token = jwt.sign(data, process.env.JWT_SECRET);
    data.token = token;
    res.cookie("jwt", token, {httpOnly: true, secure: true, maxAge: 3600000});

    return data;
  }

  /**
   * @param {any} req
   * @param {any} res
  */
  async logout(req, res) {
    res.clearCookie("jwt");

    return {
      message: "user logout successfully",
    };
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
   * @param {any} item
  */
  async add(item) {
    const response = await this.firebaseCollection
        .add(item);

    return response.id;
  }

  /**
   * @param {any} item
  */
  async set(item) {
    await this.db
        .doc(`${this.collection}/${item.id}`)
        .update(item);

    return {
      message: `${this.collection} has successfully updated!`,
    };
  }

  /**
   * @param {string} id
  */
  async delete(id) {
    const res = await this.db
        .doc(`${this.collection}/${id}`)
        .update({"isDeleted": true});

    return res;
  }

  /**
   * @param {any} response
   * @return {any}
  */
  processFirebaseResponse(response) {
    return response.docs.map((itemRef) => itemRef.data());
  }

  /**
   * @param {any} response
   * @return {any}
  */
  processDBResponse(response) {
    const data = {};
    for (const i in response._fieldsProto) {
      if (response._fieldsProto[i]) {
        data[i] = response._fieldsProto[i].stringValue;
      }
    }

    return data;
  }
}

export default FirebaseRepository;
