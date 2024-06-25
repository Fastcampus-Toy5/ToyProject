import express from "express";
import db from "../database.js";

const router = express.Router();

const getToday = () => {
  const date = new Date();
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const day = date.getDate().toString().padStart(2, "0");
  const today = `${year}-${month}-${day}`;
  return today;
};

// 유효성 검사 미들웨어
const validateCommuteData = (req, res, next) => {
  const { userId, arriveTime } = req.body;
  if (!userId || !arriveTime) {
    return res.status(400).json({
      status: "ERROR",
      error: "userId와 arriveTime은 필수 항목입니다",
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
 *     Commute:
 *       type: object
 *       required:
 *         - userId
 *         - date
 *         - arriveTime
 *       properties:
 *         id:
 *           type: integer
 *           description: 통근 기록의 자동 생성 ID
 *         userId:
 *           type: string
 *           description: 사용자 ID
 *         date:
 *           type: string
 *           description: 날짜
 *         arriveTime:
 *           type: string
 *           format: date-time
 *           description: 통근 시작 시간
 *         leaveTime:
 *           type: string
 *           format: date-time
 *           description: 통근 종료 시간
 *       example:
 *         id: 1
 *         userId: kimpra2989
 *         date: 2024-06-25
 *         arriveTime: 09:00:00
 *         leaveTime: 18:00:00
 */

/**
 * @swagger
 * tags:
 *   name: Commutes
 *   description: 출퇴근 기록 정보에 대한 API입니다.
 */

/**
 * @swagger
 * /api/commutes:
 *   get:
 *     summary: 모든 출퇴근 기록을 조회합니다
 *     tags: [Commutes]
 *     responses:
 *       200:
 *         description: 모든 출퇴근 기록 목록
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Commute'
 *       500:
 *         description: 서버 오류
 */
router.get("/", (req, res) => {
  const sql = `SELECT * FROM Commutes`;

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
 * /api/commutes/{commuteId}:
 *   get:
 *     summary: ID로 특정 출퇴근 기록을 조회합니다
 *     tags: [Commutes]
 *     parameters:
 *       - name: commuteId
 *         in: path
 *         description: 출퇴근 ID
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: 출퇴근 기록
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Commute'
 *       404:
 *         description: 출퇴근 기록을 찾을 수 없음
 */
router.get("/:commuteId", (req, res) => {
  const { commuteId } = req.params;

  const sql = `SELECT * FROM Commutes WHERE id = ?`;

  db.get(sql, [commuteId], (err, row) => {
    if (err) return handleError(res, err);

    if (!row)
      return res.status(404).json({
        status: "ERROR",
        error: "해당 출퇴근 기록을 찾을 수 없습니다",
      });

    res.json({
      status: "OK",
      data: row,
    });
  });
});

/**
 * @swagger
 * /api/commutes/arrive:
 *   post:
 *     summary: 출근 시간을 기록합니다.(사원용)
 *     tags: [Commutes]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Commute'
 *           example:
 *             userId: kimpra2989
 *             arriveTime: 09:00:00
 *     responses:
 *       200:
 *         description: 출근 기록 생성
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Commute'
 *             example:
 *               status: success
 *               message: 출근 처리 되었습니다
 *               data: { id: 1 }
 *       400:
 *         description: 잘못된 요청
 */
router.post("/arrive", validateCommuteData, (req, res) => {
  const { userId, arriveTime } = req.body;

  const today = getToday();

  const sql = `
    INSERT INTO Commutes (userId, date, arriveTime)
    VALUES (?, ?, ?)
  `;

  const params = [userId, today, arriveTime];

  db.run(sql, params, function (err) {
    if (err) return handleError(res, err);

    res.json({
      status: "success",
      message: `출근 처리 되었습니다`,
      data: { id: this.lastID },
    });
  });
});

/**
 * @swagger
 * /api/commutes/leave:
 *   post:
 *     summary: 퇴근 시간을 기록합니다 (사원용)
 *     tags: [Commutes]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Commute'
 *           example:
 *             userId: kimpra2989
 *             leaveTime: 18:00:00
 *     responses:
 *       200:
 *         description: 퇴근 기록 생성
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Commute'
 *             example:
 *               status: success
 *               message: 퇴근 처리 되었습니다
 *               data: { id: 1 }
 *       400:
 *         description: 잘못된 요청
 */
router.post("/leave", (req, res) => {
  const { userId, leaveTime } = req.body;

  // 레코드 업데이트
  const sql = `
  UPDATE Commutes SET 
    leaveTime = ?
  WHERE userId = ? and date = ?
`;

  const today = getToday();

  const params = [leaveTime, userId, today];

  db.run(sql, params, (err) => {
    if (err) return handleError(res, err);

    res.json({
      status: "success",
      message: `퇴근 처리 되었습니다`,
    });
  });
});

/**
 * @swagger
 * /api/commutes/{commuteId}:
 *   put:
 *     summary: ID로 특정 출퇴근 기록을 수정합니다.(관리자용)
 *     tags: [Commutes]
 *     parameters:
 *       - name: commuteId
 *         in: path
 *         description: 출퇴근 ID
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Commute'
 *     responses:
 *       200:
 *         description: 출퇴근 기록이 수정됨
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Commute'
 */
router.put("/:commuteId", (req, res) => {
  const { commuteId } = req.params;
  const { date, arriveTime, leaveTime } = req.body;

  // body 유효성 검사
  if (!date || !arriveTime || !leaveTime) {
    return res.status(400).json({
      status: "ERROR",
      error: "date, arriveTime, leaveTime은 필수 항목입니다",
    });
  }

  if (!commuteId) {
    return res.status(400).json({
      status: "ERROR",
      error: "commuteId가 필요합니다",
    });
  }

  // commuteId 존재 여부 확인
  const checkSql = `SELECT * FROM Commutes WHERE id = ?`;

  db.get(checkSql, [commuteId], (err, row) => {
    if (err) return handleError(res, err);

    if (!row) {
      return res.status(404).json({
        status: "ERROR",
        error: "해당 출퇴근 데이터가 존재하지 않습니다",
      });
    }

    // 레코드 업데이트
    const sql = `
      UPDATE Commutes SET 
        date = ?, 
        arriveTime = ?, 
        leaveTime = ?
      WHERE id = ?
    `;

    const params = [date, arriveTime, leaveTime, commuteId];

    db.run(sql, params, (err) => {
      if (err) return handleError(res, err);

      res.json({
        status: "UPDATE",
        message: `출퇴근 기록이 수정되었습니다`,
      });
    });
  });
});

/**
 * @swagger
 * /api/commutes/{commuteId}:
 *   delete:
 *     summary: ID로 특정 출퇴근 기록을 삭제합니다
 *     tags: [Commutes]
 *     parameters:
 *       - name: commuteId
 *         in: path
 *         description: 출퇴근 ID
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: 통근 기록이 삭제됨
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
 *                   example: 통근 기록이 삭제되었습니다
 */
router.delete("/:commuteId", (req, res) => {
  const { commuteId } = req.params;

  const sql = `DELETE FROM Commutes WHERE id = ?`;

  db.run(sql, [commuteId], (err) => {
    if (err) return handleError(res, err);

    res.json({
      status: "DELETE",
      message: "출퇴근 기록이 삭제되었습니다",
    });
  });
});

export default router;
