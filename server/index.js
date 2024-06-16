import express from "express";
import morgan from "morgan";
import fs from "fs";
import db from "./database.js";
import { STATUS_CODES } from "http";

const THRESHOLD = 2000;
const port = process.env.PORT || 8080;
const app = express();

app.use((req, res, next) => {
  const delayTime = Math.floor(Math.random() * THRESHOLD);

  setTimeout(() => {
    next();
  }, delayTime);
});

app.use(morgan("dev"));
app.use(express.static("dist"));
app.use(express.json());

app.get("/api/counter", (req, res) => {
  const counter = Number(req.query.latest);

  if (Math.floor(Math.random() * 10) <= 3) {
    res.status(400).send({
      status: "Error",
      data: null,
    });
  } else {
    res.status(200).send({
      status: "OK",
      data: counter + 1,
    });
  }
});

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

/**
 * 사용자 전체조회
 */
app.get("/api/users", (req, res) => {
  let sql = `SELECT userId, email, name, team, position, withdraw, isAdmin FROM Users `;

  const { isAdmin } = req.body;
  if (isAdmin !== undefined) sql += ` WHERE isAdmin = $1 `;

  db.all(sql, [isAdmin], (err, rows) => {
    if (err) {
      return res.status(500).json({
        status: "ERROR",
        error: err.message,
      });
    }

    res.json({
      status: "OK",
      data: rows,
    });
  });
});

/**
 * 사용자 상세조회
 */
app.get("/api/users", (req, res) => {
  const { userId } = req.body;

  const sql =
    "SELECT userId, email, name, team, position, withdraw, isAdmin FROM Users WHERE userId=$1 ";

  db.all(sql, [userId], (err, rows) => {
    if (err) {
      return res.status(500).json({
        status: "ERROR",
        error: err.message,
      });
    }

    res.json({
      status: "OK",
      data: rows,
    });
  });
});

/**
 * 사용자 등록
 */
app.post("/api/users", (req, res) => {
  const { userId, password, email, name, team, position, isAdmin } = req.body;

  try {
    db.run(
      ` INSERT INTO Users(id, userId, password, email, name, team, position, withdraw, isAdmin) 
    VALUES((SELECT MAX(id)+1 FROM Users), $1, $2, $3, $4, $5, $6, false, $7) `,
      [userId, password, email, name, team, position, isAdmin]
    );

    res.json({
      status: "REGISTER",
      message: "사용자가 등록되었습니다.",
    });
  } catch (err) {
    console.error("사용자 등록중 오류가 발생했습니다.", err);
    res.status(500).json({
      status: "ERROR",
      error: err.message,
    });
  }
});

/**
 * 사용자 수정
 */
app.put("/api/users", (req, res) => {
  const { userId, password, email, name, team, position, isAdmin } = req.body;

  let updateSql = ` UPDATE Users SET `;
  let params = [];

  password !== undefined &&
    params.push(password) &&
    (updateSql += ` password = $${params.length}, `);
  email !== undefined &&
    params.push(email) &&
    (updateSql += ` email = $${params.length}, `);
  name !== undefined &&
    params.push(name) &&
    (updateSql += ` name = $${params.length}, `);
  team !== undefined &&
    params.push(team) &&
    (updateSql += ` team = $${params.length}, `);
  position !== undefined &&
    params.push(position) &&
    (updateSql += ` position = $${params.length}, `);
  isAdmin !== undefined &&
    params.push(isAdmin) &&
    (updateSql += ` isAdmin = $${params.length}, `);

  
  params.push(userId);
  updateSql += ` userId = $${params.length} WHERE userId = $${params.length} `;

  db.run(updateSql, params, (err, rows) => {
    if (err) {
      console.error("사용자 정보 수정중 오류가 발생했습니다.", err);
      return res.status(500).json({
        status: "ERROR",
        error: err.message,
      });
    }

    res.json({
      status: "UPDATE",
      message: "사용자 정보가 수정되었습니다.",
      data: rows
    });
  });

});

/**
 * 사용자 삭제
 */
app.delete("/api/users", (req, res) => {

  const sql = ` DELETE FROM Users WHERE userId = $1 `;
  const { userId } = req.body;

  db.run(sql, [userId], (err, rows) => {
    if (err) {
      return res.status(500).json({
        status: "ERROR",
        error: err.message,
      });
    }

    res.json({
      status: "DELETE",
      message: "사용자가 삭제되었습니다.",
      data: rows,
    });
  });
});

app.get("/api/users/login", (req, res) => {
  const { userId, password } = req.body;

  const sql =
    "SELECT userId, email, name, team, position, isAdmin FROM Users WHERE userId=$1 and password = $2 and withdraw = false";

  db.all(sql, [userId, password], (err, rows) => {
    if (err) {
      return res.status(500).json({
        status: "ERROR",
        error: err.message,
      });
    }

    if(rows < 1) {
      return res.status(401).json({
        status: "NO_USER",
        message: "일치하는 사용자가 없습니다."
      })
    }

    res.json({
      status: "OK",
      data: rows,
    });
  });
})

app.listen(port, () => {
  console.log(`ready to ${port}`);
});
