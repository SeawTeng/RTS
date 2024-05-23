import express from 'express';
import { handleReadRequest, handleWriteRequest } from '../utils/handle-request.js';
import { UserController } from '../controllers/index.js';

const router = express.Router();

router.post('/login', async (req, res) => await handleReadRequest(res, async () => {
    return await UserController.login(req.body);
}));

router.get('/:id', async (req, res) => await handleReadRequest(res, async () => {
    return await UserController.getById(req.params.id);
}));

router.post('/create', async (req, res) => await handleWriteRequest(res, async () => {
    return await UserController.create(req.body);
}, 201));

router.put('/:id', async (req, res) => await handleWriteRequest(res, async () => {
    return await UserController.update(req.params.id, req.body);
}));

router.delete('/:id', async (req, res) => await handleWriteRequest(res, async () => {
    return await UserController.delete(req.params.id);
}));

router.post('/updatePassword', async (req, res) => await handleWriteRequest(res, async () => {
    return await UserController.updatePassword(req.body);
}));

export default router;