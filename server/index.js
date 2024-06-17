import express from "express";
import morgan from "morgan";
import fs from "fs";
import db from "./database.js";
import { STATUS_CODES } from "http";
import cors from "cors";

import userRouter from './routes/users.js'

const port = process.env.PORT || 8080;
const app = express();

app.use(morgan("dev"));
app.use(express.static("dist"));
app.use(express.json());
app.use(cors());

// route
app.use("/api/users", userRouter);

app.get("/api/users.json", (req, res) => {
  fs.readFile("./server/data/users.json", "utf8", (err, data) => {
    if (err) {
      console.error("Error reading JSON file:", err);
      return res.status(500).send({
        status: "Internal Server Error",
        message: err,
        data: null,
      });
    }

    try {
      const jsonData = JSON.parse(data);
      res.json(jsonData);
    } catch (parseErr) {
      console.error("Error parsing JSON file:", parseErr);
      return res.status(500).send({
        status: "Internal Server Error",
        message: parseErr,
        data: null,
      });
    }
  });
});

app.listen(port, () => {
  console.log(`ready to ${port}`);
});
