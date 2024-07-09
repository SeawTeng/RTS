import FirebaseRepository from "./utils/firebase.repository.js";
import encUtf8 from "crypto-js/enc-utf8.js";
import AES from "crypto-js/aes.js";
import moment from "moment";

/**
 * UserRepository
 */
class UserRepository extends FirebaseRepository {
  /**
   * collection users
   */
  constructor() {
    super("users");
  }

  /**
   * get all userr data
  */
  async getAll() {
    const response = await this.firebaseCollection.get();
    return this.processFirebaseResponse(response);
  }

  /**
   *  @param {any} req
  */
  async resetPassword(req) {
    // check if the email available
    const bytes = AES.decrypt(req.body.data, process.env.JWT_SECRET);
    const decryptedData = JSON.parse(bytes.toString(encUtf8));
    const exist = await this.firebaseCollection
        .where("email", "==", decryptedData.email)
        .get();
    if (exist.empty) {
      throw new Error("This email is not found");
    }

    const userDocRef = await this.db
        .doc(`users/${this.processFirebaseResponse(exist).id}`);

    // create a reset record
    const data = {
      from: userDocRef,
      email: decryptedData.email,
      requestDate: moment().format("DD-MM-YYYY HH:mm:ss"),
    };
    const response = await this.db.collection("resetPassword")
        .add(data);

    // create email
    const emailBody = {
      to: [decryptedData.email],
      message: {
        subject: "Reset Password",
        text: "",
        html: `Reset Password Code: <strong>${response.id}</strong>`,
      },
    };

    return await this.db.collection("mail")
        .add(emailBody);
  }

  /**
   *  @param {any} req
  */
  async validateResetPassword(req) {
    const reset = await this.db
        .doc(`resetPassword/${req.params.id}`).get();

    if (reset.data() == undefined) {
      throw new Error("Invalid Code!");
    }

    const data = this.processDBResponse(reset);
    const hours = moment().diff(
        moment(data.requestDate, "DD-MM-YYYY HH:mm:ss"),
        "hours");

    if (Math.abs(hours) <= 24 && !data.used) {
      return data;
    } else {
      throw new Error("Invalid Code!");
    }
  }

  /**
   *  @param {any} req
  */
  async updateResetPassword(req) {
    const bytes = AES.decrypt(req.body.data, process.env.JWT_SECRET);
    const decryptedData = JSON.parse(bytes.toString(encUtf8));

    const reset = await this.db
        .doc(`resetPassword/${decryptedData.code}`).get();
    const data = this.processDBResponse(reset);

    const hours = moment().diff(
        moment(data.requestDate, "DD-MM-YYYY HH:mm:ss"),
        "hours");

    if (data.id || Math.abs(hours) <= 24) {
      const existingUser = await this.getById(decryptedData.userId);
      if (!existingUser) {
        throw new Error("User does not exist!");
      }

      if (existingUser.password == decryptedData.new_password) {
        throw new Error("Old password cannot be same as new password");
      }

      const newPassword = {
        password: decryptedData.new_password,
        id: existingUser.id,
      };

      await this.db
          .doc(`resetPassword/${decryptedData.code}`)
          .update({used: true});

      return await this.set(req, newPassword);
    } else {
      throw new Error("Invalid Link!");
    }
  }
}

export default new UserRepository();
