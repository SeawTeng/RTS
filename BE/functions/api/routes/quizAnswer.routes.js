import express from "express";
import {
  handleReadRequest,
  handleWriteRequest,
} from "../utils/handle-request.js";
import {QuizAnswerController} from "../controllers/index.js";
import {QuizAnswerRepository} from "../../repositories/index.js";

// eslint-disable-next-line new-cap
const router = express.Router();

// get all quiz answer of the user
router.get("/getAll", async (req, res) =>
  await handleReadRequest(res, async () => {
    const auth = await QuizAnswerRepository.checkAuthenticate(req, res);
    if (auth.message) {
      return await QuizAnswerController.getAll(req);
    } else {
      return auth;
    }
  }));

// get one quiz answer with its id
router.get("/:id", async (req, res) =>
  await handleReadRequest(res, async () => {
    const auth = await QuizAnswerRepository.checkAuthenticate(req, res);
    if (auth.message) {
      return await QuizAnswerController.getById(req.params.id);
    } else {
      return auth;
    }
  }));

// create one quiz answer
router.post("/create", async (req, res) =>
  await handleWriteRequest(res, async () => {
    const auth = await QuizAnswerRepository.checkAuthenticate(req, res);
    if (auth.message) {
      return await QuizAnswerController.create(req, req.body);
    } else {
      return auth;
    }
  }, 201));

// update one quiz answer
router.put("/:id", async (req, res) =>
  await handleWriteRequest(res, async () => {
    const auth = await QuizAnswerRepository.checkAuthenticate(req, res);
    if (auth.message) {
      return await QuizAnswerController.update(req);
    } else {
      return auth;
    }
  }));

// delete one quiz answer
router.delete("/:id", async (req, res) =>
  await handleWriteRequest(res, async () => {
    const auth = await QuizAnswerRepository.checkAuthenticate(req, res);
    if (auth.message) {
      return await QuizAnswerController.delete(req);
    } else {
      return auth;
    }
  }));

export default router;
