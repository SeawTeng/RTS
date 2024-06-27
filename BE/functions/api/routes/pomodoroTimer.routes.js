import express from "express";
import {
  handleReadRequest,
  handleWriteRequest,
} from "../utils/handle-request.js";
import {pomodoroTimerController} from "../controllers/index.js";
import {pomodoroTimerRepository} from "../../repositories/index.js";

// eslint-disable-next-line new-cap
const router = express.Router();

// get all category of the user
router.get("/getAll", async (req, res) =>
  await handleReadRequest(res, async () => {
    const auth = await pomodoroTimerRepository.checkAuthenticate(req, res);
    if (auth.message) {
      return await pomodoroTimerController.getAll(req);
    } else {
      return auth;
    }
  }));


// create one pomodoro session
router.post("/create", async (req, res) =>
  await handleWriteRequest(res, async () => {
    const auth = await pomodoroTimerRepository.checkAuthenticate(req, res);
    if (auth.message) {
      return await pomodoroTimerController.create(req, req.body);
    } else {
      return auth;
    }
  }, 201));


export default router;
