import express from "express";
import {
  handleReadRequest,
  handleWriteRequest,
} from "../utils/handle-request.js";
import {PomodoroController} from "../controllers/index.js";
import {PomodoroRepository} from "../../repositories/index.js";

// eslint-disable-next-line new-cap
const router = express.Router();

// get all pomodoro session data of a user 
router.get("/getAll", async (req, res) =>
  await handleReadRequest(res, async () => {
    const auth = await PomodoroRepository.checkAuthenticate(req, res);
    if (auth.message) {
      return await PomodoroController.getAllByUser(req);
    } else {
      return auth;
    }
  }));



// create pomodoroSession
router.post("/create", async (req, res) =>
  await handleWriteRequest(res, async () => {
    const auth = await PomodoroRepository.checkAuthenticate(req, res);
    if (auth.message) {
      return await PomodoroController.create(req, req.body);
    } else {
      return auth;
    }
  }, 201));




export default router;