import express from "express";
import db from "../database.js";

const router = express.Router();

// 유효성 검사 미들웨어
const validateNoticeData = (req, res, next) => {
  const { subject, date } = req.body;
  if (!subject || !date) {
    return res.status(400).json({
      status: "ERROR",
      error: "Subject and date are required",
    });
  }
  next();
};

// 에러 처리 함수
const handleError = (res, err) => {
  console.error(err);
  return res.status(500).json({
    status: "ERROR",
    error: err.message,
  });
};

/**
 * @swagger
 * components:
 *   schemas:
 *     Notice:
 *       type: object
 *       required:
 *         - subject
 *         - date
 *       properties:
 *         id:
 *           type: integer
 *           description: 공지사항 ID
 *         subject:
 *           type: string
 *           description: 제목
 *         content:
 *           type: string
 *           description: 내용
 *         imgUrl:
 *           type: string
 *           description: 이미지 URL
 *         date:
 *           type: string
 *           format: date
 *           description: 날짜
 *       example:
 *         id: 1
 *         subject: '연말 파티 안내'
 *         content: '연말 파티가 열립니다. 많은 참석 바랍니다.'
 *         imgUrl: 'http://example.com/image.jpg'
 *         date: '2024-12-24'
 */

/**
 * @swagger
 * tags:
 *   name: Notice
 *   description: 공지사항 관리 API
 */

/**
 * @swagger
 * /api/notices:
 *   get:
 *     summary: 모든 공지사항을 조회합니다.
 *     tags: [Notice]
 *     responses:
 *       200:
 *         description: 공지사항 목록
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Notice'
 *       500:
 *         description: 서버 오류
 */
router.get("/", (req, res) => {
  const sql = `SELECT * FROM Notices`;

  db.all(sql, [], (err, rows) => {
    if (err) return handleError(res, err);

    res.json({
      status: "OK",
      data: rows,
    });
  });
});

/**
 * @swagger
 * /api/notices/{noticeId}:
 *   get:
 *     summary: 특정 공지사항을 조회합니다.
 *     tags: [Notice]
 *     parameters:
 *       - name: noticeId
 *         in: path
 *         description: 공지사항 ID
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: 공지사항 상세 정보
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Notice'
 *       404:
 *         description: 공지사항을 찾을 수 없음
 *       500:
 *         description: 서버 오류
 */
router.get("/:noticeId", (req, res) => {
  const { noticeId } = req.params;

  const sql = `SELECT * FROM Notices WHERE id = ?`;

  db.get(sql, [noticeId], (err, row) => {
    if (err) return handleError(res, err);

    if (!row) {
      return res.status(404).json({
        status: "ERROR",
        error: "Notice not found",
      });
    }

    res.json({
      status: "OK",
      data: row,
    });
  });
});

/**
 * @swagger
 * /api/notices:
 *   post:
 *     summary: 새로운 공지사항을 생성합니다.
 *     tags: [Notice]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Notice'
 *     responses:
 *       201:
 *         description: 공지사항이 생성됨
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Notice'
 *       400:
 *         description: 잘못된 요청
 *       500:
 *         description: 서버 오류
 */
router.post("/", validateNoticeData, (req, res) => {
  const { subject, content, imgUrl, date } = req.body;

  const sql = `
    INSERT INTO Notices (subject, content, imgUrl, date)
    VALUES (?, ?, ?, ?)
  `;

  const params = [subject, content, imgUrl, date];

  db.run(sql, params, function (err) {
    if (err) return handleError(res, err);

    res.status(201).json({
      status: "CREATED",
      id: this.lastID,
      message: "공지사항이 생성되었습니다.",
    });
  });
});

/**
 * @swagger
 * /api/notices/{noticeId}:
 *   put:
 *     summary: 공지사항을 수정합니다.
 *     tags: [Notice]
 *     parameters:
 *       - name: noticeId
 *         in: path
 *         description: 공지사항 ID
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Notice'
 *     responses:
 *       200:
 *         description: 공지사항이 수정됨
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Notice'
 *       400:
 *         description: 잘못된 요청
 *       404:
 *         description: 공지사항을 찾을 수 없음
 *       500:
 *         description: 서버 오류
 */
router.put("/:noticeId", validateNoticeData, (req, res) => {
  const { noticeId } = req.params;
  const { subject, content, imgUrl, date } = req.body;

  const sql = `
    UPDATE Notices SET 
      subject = ?, 
      content = ?, 
      imgUrl = ?, 
      date = ?
    WHERE id = ?
  `;

  const params = [subject, content, imgUrl, date, noticeId];

  db.run(sql, params, function (err) {
    if (err) return handleError(res, err);

    if (this.changes === 0) {
      return res.status(404).json({
        status: "ERROR",
        error: "Notice not found",
      });
    }

    res.json({
      status: "UPDATED",
      message: "공지사항이 수정되었습니다.",
    });
  });
});

/**
 * @swagger
 * /api/notices/{noticeId}:
 *   delete:
 *     summary: 공지사항을 삭제합니다.
 *     tags: [Notice]
 *     parameters:
 *       - name: noticeId
 *         in: path
 *         description: 공지사항 ID
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: 공지사항이 삭제됨
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: "DELETED"
 *                 message:
 *                   type: string
 *                   example: "공지사항이 삭제되었습니다."
 *       404:
 *         description: 공지사항을 찾을 수 없음
 *       500:
 *         description: 서버 오류
 */
router.delete("/:noticeId", (req, res) => {
  const { noticeId } = req.params;

  const sql = `DELETE FROM Notices WHERE id = ?`;

  db.run(sql, [noticeId], function (err) {
    if (err) return handleError(res, err);

    if (this.changes === 0) {
      return res.status(404).json({
        status: "ERROR",
        error: "Notice not found",
      });
    }

    res.json({
      status: "DELETED",
      message: "공지사항이 삭제되었습니다.",
    });
  });
});

export default router;
