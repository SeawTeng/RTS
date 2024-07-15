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
    const dec = jwt.decode(token, process.env.JWT_SECRET);

    discussionCommentDto.isDeleted = false;
    const userDocRef = await DiscussionCommentRepository.db
        .doc(`users/${dec.id}`);
    const discussionDocRef = await DiscussionCommentRepository.db
        .doc(`discussion/${req.body.discussionId}`);
    discussionCommentDto.userId = userDocRef;
    discussionCommentDto.discussionId = discussionDocRef;
    discussionCommentDto.userName = dec.firstName + " " + dec.lastName;

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
