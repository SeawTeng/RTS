import express from "express";
import {
  handleReadRequest,
  handleWriteRequest,
} from "../utils/handle-request.js";
import {UserController} from "../controllers/index.js";
import {UserRepository} from "../../repositories/index.js";

// eslint-disable-next-line new-cap
const router = express.Router();

router.get("/checkToken", async (req, res) =>
  await handleReadRequest(res, async () => {
    return await UserController.checkAuth(req);
  }));

router.post("/login", async (req, res) =>
  await handleReadRequest(res, async () => {
    return await UserController.login(req, res);
  }));

router.get("/:id", async (req, res) =>
  await handleReadRequest(res, async () => {
    const auth = await UserRepository.checkAuthenticate(req, res);
    if (auth.message) {
      return await UserController.getById(req.params.id);
    } else {
      return auth;
    }
  }));

router.post("/create", async (req, res) =>
  await handleWriteRequest(res, async () => {
    return await UserController.create(req);
  }, 201));

router.put("/:id", async (req, res) =>
  await handleWriteRequest(res, async () => {
    const auth = await UserRepository.checkAuthenticate(req, res);
    if (auth.message) {
      return await UserController.update(req);
    } else {
      return auth;
    }
  }));

router.delete("/:id", async (req, res) =>
  await handleWriteRequest(res, async () => {
    const auth = await UserRepository.checkAuthenticate(req, res);
    if (auth.message) {
      return await UserController.delete(req);
    } else {
      return auth;
    }
  }));

router.post("/updatePassword", async (req, res) =>
  await handleWriteRequest(res, async () => {
    const auth = await UserRepository.checkAuthenticate(req, res);
    if (auth.message) {
      return await UserController.updatePassword(req);
    } else {
      return auth;
    }
  }));

router.post("/resetPassword", async (req, res) =>
  await handleWriteRequest(res, async () => {
    return await UserController.resetPassword(req);
  }));

router.get("/validateResetPassword/:id", async (req, res) =>
  await handleReadRequest(res, async () => {
    return await UserController.validateResetPassword(req);
  }));

router.post("/updateResetPassword", async (req, res) =>
  await handleReadRequest(res, async () => {
    return await UserController.updateResetPassword(req);
  }));

export default router;
