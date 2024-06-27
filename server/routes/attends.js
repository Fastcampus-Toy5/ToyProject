import express from "express";
import db from "../database.js";

const router = express.Router();

// 유효성 검사 미들웨어
const validateAttendData = (req, res, next) => {
  const { userId, subject, content, startDate, endDate, type } = req.body;
  if (!userId || !subject || !content || !startDate || !endDate || !type) {
    return res.status(400).json({
      status: "ERROR",
      error: "All fields are required",
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
 *     Attends:
 *       type: object
 *       required:
 *         - userId
 *         - subject
 *         - content
 *         - startDate
 *         - endDate
 *         - type
 *       properties:
 *         userId:
 *           type: string
 *           description: 사번
 *         subject:
 *           type: string
 *           description: 제목
 *         content:
 *           type: string
 *           description: 내용
 *         startDate:
 *           type: string
 *           description: 시작한 시점
 *         endDate:
 *           type: string
 *           description: 끝난 시점
 *         type:
 *           type: string
 *           description: 구분
 *       example:
 *         userId: kimpra2989
 *         subject: 연기 신청합니다.
 *         content: 그냥요
 *         startDate: 2024-08-25
 *         endDate: 2024-08-27
 *         type: 연가
 */

/**
 * @swagger
 * tags:
 *   name: Attends
 *   description: 근태 정보에 대한 API입니다.
 */

/**
 * @swagger
 * /api/attends:
 *   get:
 *     summary: 모든 근태 정보를 가져옵니다
 *     tags: [Attends]
 *     responses:
 *       200:
 *         description: 모든 근태 정보
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Attends'
 *       500:
 *         description: 네트워크 오류
 */
router.get("/", (req, res) => {
  const sql = `SELECT * FROM Attends`;

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
 * /api/attends/{attendId}:
 *   get:
 *     summary: 특정 근태 정보를 가져옵니다
 *     tags: [Attends]
 *     parameters:
 *       - name: attendId
 *         in: path
 *         description: 근태 ID
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: 근태 정보
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Attends'
 *       404:
 *         description: 해당 근태 정보가 존재하지 않음
 */
router.get("/:attendId", (req, res) => {
  const { attendId } = req.params;

  const sql = `SELECT * FROM Attends WHERE id = ?`;

  db.get(sql, [attendId], (err, row) => {
    if (err) return handleError(res, err);

    if (!row)
      return res.status(404).json({
        status: "ERROR",
        error: "Attend not found",
      });

    res.json({
      status: "OK",
      data: row,
    });
  });
});

/**
 * @swagger
 * /api/attends:
 *   post:
 *     summary: 근태 정보를 등록합니다.
 *     tags: [Attends]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Attends'
 *     responses:
 *       200:
 *         description: 근태 정보가 생성됨
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Attends'
 *       400:
 *         description: Bad request
 */
router.post("/", validateAttendData, (req, res) => {
  const { userId, subject, content, startDate, endDate, type } = req.body;

  const sql = `
    INSERT INTO Attends (userId, subject, content, startDate, endDate, type)
    VALUES (?, ?, ?, ?, ?, ?)
  `;

  const params = [userId, subject, content, startDate, endDate, type];

  db.run(sql, params, (err) => {
    if (err) return handleError(res, err);

    res.json({
      status: "REGISTER",
      message: `근태 정보가 등록되었습니다.`,
    });
  });
});

/**
 * @swagger
 * /api/attends/{attendId}:
 *   put:
 *     summary: 근태 정보를 수정합니다.
 *     tags: [Attends]
 *     parameters:
 *       - name: attendId
 *         in: path
 *         description: 근태 ID
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Attends'
 *     responses:
 *       200:
 *         description: 근태 정보가 수정됨
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Attends'
 */
router.put("/:attendId", validateAttendData, (req, res) => {
  const { attendId } = req.params;
  const { userId, subject, content, startDate, endDate, type } = req.body;

  if (!attendId) {
    return res.status(400).json({
      status: "ERROR",
      error: "attendId가 없습니다.",
    });
  }

  // 먼저 attendId가 존재하는지 확인
  const checkSql = `SELECT * FROM Attends WHERE id = ?`;

  db.get(checkSql, [attendId], (err, row) => {
    if (err) return handleError(res, err);

    if (!row) {
      return res.status(404).json({
        status: "ERROR",
        error: "일치하는 attend data가 없습니다.",
      });
    }
  });

  // put 요청 처리
  const sql = `
    UPDATE Attends SET 
      userId = ?, 
      subject = ?, 
      content = ?, 
      startDate = ?, 
      endDate = ?, 
      type = ?
    WHERE id = ?
  `;

  const params = [userId, subject, content, startDate, endDate, type, attendId];

  db.run(sql, params, (err) => {
    if (err) return handleError(res, err);

    res.json({
      status: "UPDATE",
      message: `근태 정보가 수정되었습니다.`,
    });
  });
});

/**
 * @swagger
 * /api/attends/{attendId}:
 *   delete:
 *     summary: 특정 근태 정보를 삭제합니다.
 *     tags: [Attends]
 *     parameters:
 *       - name: attendId
 *         in: path
 *         description: 근태 ID
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: 근태 정보가 삭제됨
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: DELETE
 *                 message:
 *                   type: string
 *                   example: 근태 정보가 삭제되었습니다.
 */
router.delete("/:attendId", (req, res) => {
  const { attendId } = req.params;

  const sql = `DELETE FROM Attends WHERE id = ?`;

  db.run(sql, [attendId], (err) => {
    if (err) return handleError(res, err);

    res.json({
      status: "DELETE",
      message: "근태 정보가 삭제되었습니다.",
    });
  });
});

export default router;
