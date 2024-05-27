import FirebaseRepository from "./utils/firebase.repository.js";

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
}

export default new UserRepository();
