import * as functions from 'firebase-functions';

import express from 'express';
import cors from 'cors';

import { UserRoutes } from './routes/index.js';
import cookieParser from 'cookie-parser';
// import auth from './utils/auth';

const app = express();

const port = process.env.PORT || 4000;

var corsOptions = {
    origin: [
        'https://rts-24.firebaseapp.com',
        'http://127.0.0.1:5001'
    ]
}

app.use(cors(corsOptions));

app.use(cookieParser());

// app.use(auth);

app.use('/users', UserRoutes);

const api = functions.https.onRequest(app);

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})

export default api;