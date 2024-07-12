import FirebaseRepository from "./utils/firebase.repository.js";

/**
 * DiscussionCommentRepository
 */
class DiscussionCommentRepository extends FirebaseRepository {
  /**
   * collection todo task
   */
  constructor() {
    super("discussion-comment");
  }

  /**
   * get all discussion comment
   * @param {any} req
  */
  async getAll(req) {
    const discussionDocRef = await this.db
        .doc(`discussion/${req.params.id}`);

    let response = await this.firebaseCollection
        .where("discussionId", "==", discussionDocRef)
        .where("isDeleted", "==", false)
        .get();

    response = this.processFirebaseResponse(response, true);
    return response;
  }
}

export default new DiscussionCommentRepository();
