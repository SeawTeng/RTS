import * as functions from "firebase-functions";

import express from "express";
import cors from "cors";

import {UserRoutes} from "./routes/index.js";
// import auth from './utils/auth';

const app = express();

const port = process.env.HOST_PORT || 4000;

const corsOptions = {
  origin: [
    "http://127.0.0.1:5001",
    "http://localhost:4200",
    "https://rts-tkik.onrender.com",
  ],
  credentials: true,
};

app.use(cors(corsOptions));

// app.use(auth);

app.use("/users", UserRoutes);

const api = functions.https.onRequest(app);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});

export default api;
