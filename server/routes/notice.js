import express from "express";
import db from "../database.js";

const router = express.Router();

/**
 * 공지사항 전체조회
 */
router.get("/", (req, res) => {
  let sql = ` SELECT no, subject, content, regDate FROM notices `;

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
 * 공지사항 상세조회
 */
router.get("/:no", (req, res) => {
  const { no } = req.params;

  const sql = " SELECT no, subject, content, regDate FROM notices WHERE no = $1 ";

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
 * 공지사항 등록
 */
router.post("/", (req, res) => {
  const { subject, content, imgUrl } = req.body;

  try {
    db.run(
      ` INSERT INTO notices(no, subject, content, imgUrl, regDate) 
    VALUES((SELECT MAX(no)+1 FROM notices), $1, $2, $3, datetime('now','localtime') ) `,
      [subject, content, imgUrl]
    );

    res.json({
      status: "REGISTER",
      message: "공지사항이 등록되었습니다.",
    });
  } catch (err) {
    console.error("공지사항 등록중 오류가 발생했습니다.", err);
    res.status(500).json({
      status: "ERROR",
      error: err.message,
    });
  }
});

/**
 * 공지사항 수정
 */
router.put("/", (req, res) => {
  const { no, subject, content, imgUrl } = req.body;
  const params = [subject, content, imgUrl, no];

  if(!!!no) {
    return res.status(500).json({
      status:"ERROR",
      error: "공지사항 정보 수정중 오류가 발생했습니다."
    })
  }

  let updateSql = ` UPDATE notices SET subject= $1, content = $2, imgUrl = $3 WHERE no = $4`;

  db.run(updateSql, params, (err, rows) => {
    if (err) {
      console.error("공지사항 정보 수정중 오류가 발생했습니다.", err);
      return res.status(500).json({
        status: "ERROR",
        error: err.message,
      });
    }

    res.json({
      status: "UPDATE",
      message: "공지사항 정보가 수정되었습니다.",
      data: rows,
    });
  });
});

/**
 * 공지사항 삭제
 */
router.delete("/", (req, res) => {
  const sql = ` DELETE FROM notices WHERE no = $1 `;
  const { no } = req.body;

  if(!!!no) {
    return res.status(500).json({
      status:"ERROR",
      error: "삭제할 대상을 지정해주세요."
    })
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
      message: "공지사항이 삭제되었습니다.",
      data: rows,
    });
  });
});

export default router