import express from "express";
import {
  handleReadRequest,
  handleWriteRequest,
} from "../utils/handle-request.js";
import {DiscussionController} from "../controllers/index.js";
import {DiscussionRepository} from "../../repositories/index.js";

// eslint-disable-next-line new-cap
const router = express.Router();

// get all discussion of the user
router.get("/getAll", async (req, res) =>
  await handleReadRequest(res, async () => {
    const auth = await DiscussionRepository.checkAuthenticate(req, res);
    if (auth.message) {
      return await DiscussionController.getAll();
    } else {
      return auth;
    }
  }));

// get one discussion with its id
router.get("/:id", async (req, res) =>
  await handleReadRequest(res, async () => {
    const auth = await DiscussionRepository.checkAuthenticate(req, res);
    if (auth.message) {
      return await DiscussionController.getById(req.params.id);
    } else {
      return auth;
    }
  }));

// create one discussion
router.post("/create", async (req, res) =>
  await handleWriteRequest(res, async () => {
    const auth = await DiscussionRepository.checkAuthenticate(req, res);
    if (auth.message) {
      return await DiscussionController.create(req, req.body);
    } else {
      return auth;
    }
  }, 201));

// update one discussion
router.put("/:id", async (req, res) =>
  await handleWriteRequest(res, async () => {
    const auth = await DiscussionRepository.checkAuthenticate(req, res);
    if (auth.message) {
      return await DiscussionController.update(req);
    } else {
      return auth;
    }
  }));

// delete one discussion
router.delete("/:id", async (req, res) =>
  await handleWriteRequest(res, async () => {
    const auth = await DiscussionRepository.checkAuthenticate(req, res);
    if (auth.message) {
      return await DiscussionController.delete(req);
    } else {
      return auth;
    }
  }));

export default router;
