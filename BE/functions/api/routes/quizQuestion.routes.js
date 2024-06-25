import express from "express";
import {
  handleReadRequest,
  handleWriteRequest,
} from "../utils/handle-request.js";
import {QuizQuestionController} from "../controllers/index.js";
import {QuizQuestionRepository} from "../../repositories/index.js";

// eslint-disable-next-line new-cap
const router = express.Router();

// get all quiz question of the user
router.get("/getAll", async (req, res) =>
  await handleReadRequest(res, async () => {
    const auth = await QuizQuestionRepository.checkAuthenticate(req, res);
    if (auth.message) {
      return await QuizQuestionController.getAll();
    } else {
      return auth;
    }
  }));

// get active quiz
router.get("/active", async (req, res) =>
  await handleReadRequest(res, async () => {
    const auth = await QuizQuestionRepository.checkAuthenticate(req, res);
    if (auth.message) {
      return await QuizQuestionController.getActiveQuiz();
    } else {
      return auth;
    }
  }));

// get one quiz question with its id
router.get("/:id", async (req, res) =>
  await handleReadRequest(res, async () => {
    const auth = await QuizQuestionRepository.checkAuthenticate(req, res);
    if (auth.message) {
      return await QuizQuestionController.getById(req.params.id);
    } else {
      return auth;
    }
  }));


// create one quiz question
router.post("/create", async (req, res) =>
  await handleWriteRequest(res, async () => {
    const auth = await QuizQuestionRepository.checkAuthenticate(req, res);
    if (auth.message) {
      return await QuizQuestionController.create(req, req.body);
    } else {
      return auth;
    }
  }, 201));

// update one quiz question
router.put("/:id", async (req, res) =>
  await handleWriteRequest(res, async () => {
    const auth = await QuizQuestionRepository.checkAuthenticate(req, res);
    if (auth.message) {
      return await QuizQuestionController.update(req);
    } else {
      return auth;
    }
  }));

// set default
router.put("/default/:id", async (req, res) =>
  await handleWriteRequest(res, async () => {
    const auth = await QuizQuestionRepository.checkAuthenticate(req, res);
    if (auth.message) {
      return await QuizQuestionController.setDefault(req);
    } else {
      return auth;
    }
  }));

// delete one quiz question
router.delete("/:id", async (req, res) =>
  await handleWriteRequest(res, async () => {
    const auth = await QuizQuestionRepository.checkAuthenticate(req, res);
    if (auth.message) {
      return await QuizQuestionController.delete(req);
    } else {
      return auth;
    }
  }));

export default router;
