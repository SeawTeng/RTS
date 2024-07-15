import FirebaseRepository from "./utils/firebase.repository.js";

/**
 * DiscussionRepository
 */
class DiscussionRepository extends FirebaseRepository {
  /**
   * collection discussion
   */
  constructor() {
    super("discussion");
  }

  /**
   * get all discussion
  */
  async getAll() {
    let response = await this.firebaseCollection
        .where("isDeleted", "==", false)
        .get();

    response = this.processFirebaseResponse(response, true);
    return response;
  }
}

export default new DiscussionRepository();
