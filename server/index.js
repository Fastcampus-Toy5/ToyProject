import cors from "cors";
import express from "express";
import morgan from "morgan";

import attendRouter from "./routes/attend.js";
import commuteRouter from "./routes/commute.js";
import noticeRouter from "./routes/notice.js";
import userRouter from "./routes/users.js";

import swaggerUi from 'swagger-ui-express';
import swaggerSpec from './swagger.js';

const port = process.env.PORT || 8080;
const app = express();

app.use(morgan("dev"));
app.use(express.static("dist"));
app.use(express.json());
app.use(cors());

const API_URL = {
  user: "/api/users",
  notice: "/api/notices",
  commute: "/api/commutes",
  attend: "/api/attends",
};

// route
app.use(API_URL.user, userRouter);
app.use(API_URL.notice, noticeRouter);
app.use(API_URL.commute, commuteRouter);
app.use(API_URL.attend, attendRouter);

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec))

app.listen(port, () => {
  console.log(`ready to ${port}`);
});
