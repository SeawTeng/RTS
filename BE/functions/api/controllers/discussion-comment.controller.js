import {DiscussionCommentRepository} from "../../repositories/index.js";
import jwt from "jsonwebtoken";

/**
 * DiscussionCommentController
*/
class DiscussionCommentController {
  /**
   *  @param {any} req
  */
  async getAll(req) {
    return await DiscussionCommentRepository.getAll(req);
  }

  /**
   *  @param {string} id
  */
  async getById(id) {
    return await DiscussionCommentRepository.getById(id);
  }

  /**
   *  @param {any} req
   *  @param {DiscussionComment} discussionCommentDto
  */
  async create(req, discussionCommentDto) {
    const token = req.headers["authorization"];
    const userId = jwt.decode(token, process.env.JWT_SECRET).id;

    discussionCommentDto.isDeleted = false;
    const userDocRef = await DiscussionCommentRepository.db
        .doc(`users/${userId}`);
    const discussionDocRef = await DiscussionCommentRepository.db
        .doc(`discussion/${req.body.id}`);
    discussionCommentDto.userId = userDocRef;
    discussionCommentDto.discussionId = discussionDocRef;

    return await DiscussionCommentRepository.add(req, discussionCommentDto);
  }

  /**
   *  @param {any} req
  */
  async update(req) {
    const data = req.body;
    data.id = req.params.id;

    return await DiscussionCommentRepository.set(req, data);
  }

  /**
   *  @param {any} req
  */
  async delete(req) {
    const existingDiscussion = await DiscussionCommentRepository.delete(req);
    if (!existingDiscussion) throw new Error("Error");

    return {
      message: "Comment have been successfully deleted!",
    };
  }
}

export default new DiscussionCommentController();
