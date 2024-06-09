import express from "express";
import {
  handleReadRequest,
  handleWriteRequest,
} from "../utils/handle-request.js";
import {todoCategoryController} from "../controllers/index.js";
import {TodoCategoryRepository} from "../../repositories/index.js";

// eslint-disable-next-line new-cap
const router = express.Router();

// get all category of the user
router.get("/getAll", async (req, res) =>
  await handleReadRequest(res, async () => {
    const auth = await TodoCategoryRepository.checkAuthenticate(req, res);
    if (auth.message) {
      return await todoCategoryController.getAll(req);
    } else {
      return auth;
    }
  }));

// get one category with its id
router.get("/:id", async (req, res) =>
  await handleReadRequest(res, async () => {
    const auth = await TodoCategoryRepository.checkAuthenticate(req, res);
    if (auth.message) {
      return await todoCategoryController.getById(req.params.id);
    } else {
      return auth;
    }
  }));

// create one category
router.post("/create", async (req, res) =>
  await handleWriteRequest(res, async () => {
    const auth = await TodoCategoryRepository.checkAuthenticate(req, res);
    if (auth.message) {
      return await todoCategoryController.create(req, req.body);
    } else {
      return auth;
    }
  }, 201));

// update one category
router.put("/:id", async (req, res) =>
  await handleWriteRequest(res, async () => {
    const auth = await TodoCategoryRepository.checkAuthenticate(req, res);
    if (auth.message) {
      return await todoCategoryController.update(req);
    } else {
      return auth;
    }
  }));

// delete one category
router.delete("/:id", async (req, res) =>
  await handleWriteRequest(res, async () => {
    const auth = await TodoCategoryRepository.checkAuthenticate(req, res);
    if (auth.message) {
      return await todoCategoryController.delete(req);
    } else {
      return auth;
    }
  }));

export default router;
