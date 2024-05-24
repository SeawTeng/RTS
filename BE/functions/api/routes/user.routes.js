import express from 'express';
import { handleReadRequest, handleWriteRequest } from '../utils/handle-request.js';
import { UserController } from '../controllers/index.js';
import { UserRepository } from '../../repositories/index.js';

const router = express.Router();

router.post('/login', async (req, res) => await handleReadRequest(res, async () => {
    return await UserController.login(req, res);
}));

router.post('/logout', async (req, res) => await handleReadRequest(res, async () => {
    return await UserController.logout(req, res);
}));

router.get('/:id', async (req, res) => await handleReadRequest(res, async () => {
    const auth = await UserRepository.checkAuthenticate(req, res)
    if (auth.success) {
        return await UserController.getById(req.params.id);
    } else {
        return auth;
    }
}));

router.post('/create', async (req, res) => await handleWriteRequest(res, async () => {
    const auth = await UserRepository.checkAuthenticate(req, res)
    if (auth.success) {
        return await UserController.create(req.body);
    } else {
        return auth;
    }
}, 201));

router.put('/:id', async (req, res) => await handleWriteRequest(res, async () => {
    const auth = await UserRepository.checkAuthenticate(req, res)
    if (auth.success) {
        return await UserController.update(req.params.id, req.body);
    } else {
        return auth;
    }
}));

router.delete('/:id', async (req, res) => await handleWriteRequest(res, async () => {
    const auth = await UserRepository.checkAuthenticate(req, res)
    if (auth.success) {
        return await UserController.delete(req.params.id);
    } else {
        return auth;
    }
}));

router.post('/updatePassword', async (req, res) => await handleWriteRequest(res, async () => {
    const auth = await UserRepository.checkAuthenticate(req, res)
    if (auth.success) {
        return await UserController.updatePassword(req);
    } else {
        return auth;
    }
}));

export default router;