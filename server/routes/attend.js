import express from "express";
import db from "../database.js";

const router = express.Router();

/**
 * 근태 전체조회
 */
router.get("/", (req, res) => {
  let sql = ` SELECT no, attends.userId, subject, content, startDate, endDate, type, name FROM attends JOIN users ON attends.userId = users.userId `;

  db.all(sql, (err, rows) => {
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
 * 근태 상세조회
 */
router.get("/:no", (req, res) => {
  const { no } = req.params;

  const sql =
    " SELECT no, attends.userId, subject, content, startDate, endDate, type, name FROM attends JOIN users ON attends.userId = users.userId WHERE no = $1 ";

  db.all(sql, [no], (err, rows) => {
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
 * 근태 등록
 */
router.post("/", (req, res) => {
  const { userId, subject, content, startDate, endDate, type } = req.body;

  try {
    db.run(
      ` INSERT INTO attends(no, userId, subject, content, startDate, endDate, type) 
        VALUES( (SELECT MAX(no)+1 FROM attends), $1, $2, $3, $4, $5, $6 ) `,
      [userId, subject, content, startDate, endDate, type]
    );

    res.json({
      status: "REGISTER",
      message: "근태신청이 등록되었습니다.",
    });
  } catch (err) {
    console.error("근태 등록중 오류가 발생했습니다.", err);
    res.status(500).json({
      status: "ERROR",
      error: err.message,
    });
  }
});

/**
 * 근태 수정
 */
router.put("/", (req, res) => {
  const { no, userId, subject, content, startDate, endDate, type } = req.body;

  if (!!!no) {
    return res.status(500).json({
      status: "ERROR",
      error: "근태 정보 수정중 오류가 발생했습니다.",
    });
  }

  let updateSql = ` UPDATE attends SET `;
  let params = [];

  subject !== undefined &&
    params.push(subject) &&
    (updateSql += ` subject = $${params.length}, `);
  content !== undefined &&
    params.push(content) &&
    (updateSql += ` content = $${params.length}, `);
  startDate !== undefined &&
    params.push(startDate) &&
    (updateSql += ` startDate = $${params.length}, `);
  endDate !== undefined &&
    params.push(endDate) &&
    (updateSql += ` endDate = $${params.length}, `);
  type !== undefined &&
    params.push(type) &&
    (updateSql += ` type = $${params.length}, `);

  params.push(no);
  updateSql += ` no = $${params.length} WHERE no = $${params.length} `;
  params.push(userId);
  updateSql += ` AND userId = $${params.length} `;

  db.run(updateSql, params, (err, rows) => {
    if (err) {
      console.error("근태 정보 수정중 오류가 발생했습니다.", err);
      return res.status(500).json({
        status: "ERROR",
        error: err.message,
      });
    }

    res.json({
      status: "UPDATE",
      message: "근태 정보가 수정되었습니다.",
      data: rows,
    });
  });
});

/**
 * 근태 삭제
 */
router.delete("/", (req, res) => {
  const sql = ` DELETE FROM attends WHERE no = $1 `;
  const { no } = req.body;

  if (!!!no) {
    return res.status(500).json({
      status: "ERROR",
      error: "삭제할 대상을 지정해주세요.",
    });
  }

  db.run(sql, [no], (err, rows) => {
    if (err) {
      return res.status(500).json({
        status: "ERROR",
        error: err.message,
      });
    }

    res.json({
      status: "DELETE",
      message: "근태 내역이 삭제되었습니다.",
      data: rows,
    });
  });
});

export default router;
