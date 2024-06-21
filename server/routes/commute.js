import express from "express";
import db from "../database.js";

const router = express.Router();

/**
 * 출퇴근 전체조회
 */
router.get("/", (req, res) => {
  let sql = ` SELECT no, userId, startTime, endTime FROM commutes `;

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
 * 출퇴근 상세조회
 */
router.get("/:no", (req, res) => {
  const { no } = req.params;

  const sql =
    " SELECT no, userId, startTime, endTime FROM commutes WHERE no = $1 ";

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
 * 출퇴근 등록
 */
router.post("/", (req, res) => {
  const { userId, startTime, endTime } = req.body;

  try {
    db.run(
      ` INSERT INTO commutes(no, userId, startTime, endTime) 
        VALUES( (SELECT MAX(no)+1 FROM commutes), $1, $2, $3 ) `,
      [userId, startTime, endTime]
    );

    res.json({
      status: "REGISTER",
      message: "출퇴근이 등록되었습니다.",
    });
  } catch (err) {
    console.error("출퇴근 등록중 오류가 발생했습니다.", err);
    res.status(500).json({
      status: "ERROR",
      error: err.message,
    });
  }
});

/**
 * 출퇴근 수정
 */
router.put("/", (req, res) => {
  const { no, userId, startTime, endTime } = req.body;

  if (!!!no || !!!userId) {
    return res.status(500).json({
      status: "ERROR",
      error: "출퇴근 정보 수정중 오류가 발생했습니다.",
    });
  }

  let updateSql = ` UPDATE commutes SET `;
  let params = [];

  startTime !== undefined &&
    params.push(startTime) &&
    (updateSql += ` startTime = $${params.length}, `);
  endTime !== undefined &&
    params.push(endTime) &&
    (updateSql += ` endTime = $${params.length}, `);

  params.push(no);
  updateSql += ` no = $${params.length} WHERE no = $${params.length} `;
  params.push(userId);
  updateSql += ` AND userId = $${params.length} `;


  db.run(updateSql, params, (err, rows) => {
    if (err) {
      console.error("출퇴근 정보 수정중 오류가 발생했습니다.", err);
      return res.status(500).json({
        status: "ERROR",
        error: err.message,
      });
    }

    res.json({
      status: "UPDATE",
      message: "출퇴근 정보가 수정되었습니다.",
      data: rows,
    });
  });
});

/**
 * 출퇴근 삭제
 */
router.delete("/", (req, res) => {
  const sql = ` DELETE FROM commutes WHERE no = $1 `;
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
      message: "출퇴근이 삭제되었습니다.",
      data: rows,
    });
  });
});

export default router;
