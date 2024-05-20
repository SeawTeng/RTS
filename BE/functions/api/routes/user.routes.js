import express from 'express';
import { handleReadRequest, handleWriteRequest } from '../utils/handle-request.js';
import { UserController } from '../controllers/index.js';

const router = express.Router();

router.get('/', async (req, res) => await handleReadRequest(res, async () => {
    return await UserController.getAll();
}));

router.get('/get/:id', async (req, res) => await handleReadRequest(res, async () => {
    return await UserController.getById(req.params.id);
}));

router.post('/create/:id', async (req, res) => await handleWriteRequest(res, async () => {
    req.body.id = req.params.id;
    return await UserController.create(req.body);
}, 201));

router.put('/:id', async (req, res) => await handleWriteRequest(res, async () => {
    return await UserController.update(req.params.id, req.body);
}));

router.delete('/:id', async (req, res) => await handleWriteRequest(res, async () => {
    return await UserController.delete(req.params.id);
}));

export default router;