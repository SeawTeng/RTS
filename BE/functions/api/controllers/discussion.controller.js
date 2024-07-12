import {DiscussionRepository} from "../../repositories/index.js";
import jwt from "jsonwebtoken";

/**
 * DiscussionController
*/
class DiscussionController {
  /**
   *
  */
  async getAll() {
    return await DiscussionRepository.getAll();
  }

  /**
   *  @param {string} id
  */
  async getById(id) {
    return await DiscussionRepository.getById(id);
  }

  /**
   *  @param {any} req
   *  @param {Discussion} discussionDto
  */
  async create(req, discussionDto) {
    const token = req.headers["authorization"];
    const userId = jwt.decode(token, process.env.JWT_SECRET).id;

    discussionDto.isDeleted = false;
    const userDocRef = await DiscussionRepository.db
        .doc(`users/${userId}`);
    discussionDto.userId = userDocRef;

    return await DiscussionRepository.add(req, discussionDto);
  }

  /**
   *  @param {any} req
  */
  async update(req) {
    const data = req.body;
    data.id = req.params.id;

    return await DiscussionRepository.set(req, data);
  }

  /**
   *  @param {any} req
  */
  async delete(req) {
    const existingDiscussion = await DiscussionRepository.delete(req);
    if (!existingDiscussion) throw new Error("Error");

    return {
      message: "Discussion have been successfully deleted!",
    };
  }
}

export default new DiscussionController();
