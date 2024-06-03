import Entity from "./entity.js";
import moment from "moment";

/**
 * User entity
*/
class Users extends Entity {
  /**
    * @param {string} id
    * @param {string} email
    * @param {string} firstName
    * @param {string} lastName
    * @param {string} password
    * @param {string} image
    * @param {string} dob
    * @param {string} type
    * @param {string} planType
    * @param {string} planId
    * @param {string} status
    * @param {string} lastCreatedTime
    * @param {string} lastUpdatedTime
    * @param {boolean} isDeleted
    * @param {string} lastCreatedBy
    * @param {string} lastUpdatedBy
  */
  constructor(
      id,
      email,
      firstName,
      lastName,
      password,
      image,
      dob,
      type,
      planType,
      planId,
      status,
      lastCreatedTime,
      lastUpdatedTime,
      isDeleted,
      lastCreatedBy,
      lastUpdatedBy
  ) {
    super(id);

    if (!email) throw new TypeError("Email requires");
    if (!firstName) throw new TypeError("First Name required");
    if (!lastName) throw new TypeError("Last Name required");
    if (!password) throw new TypeError("Password required");

    this.email = email;
    this.firstName = firstName;
    this.lastName = lastName;
    this.password = password;
    this.image = image;
    this.dob = moment(dob).format("DD-MM-YYYY");
    this.type = type;
    this.planType = planType;
    this.planId = planId;
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

export default Users;
