import * as functions from 'firebase-functions';

import express from 'express';
import cors from 'cors';

import { UserRoutes } from './routes/index.js';
// import auth from './utils/auth';

const app = express();

var corsOptions = {
    origin: [
        // 'https://rts-db.firebaseapp.com',
        'http://127.0.0.1:5001'
    ]
}

app.use(cors(corsOptions));

// app.use(auth);

app.use('/users', UserRoutes);

const api = functions.https.onRequest(app);

export default api;