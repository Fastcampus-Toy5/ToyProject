import express from "express";
import db from "../database.js";

const router = express.Router();

// 유효성 검사 미들웨어
const validateUserData = (req, res, next) => {
    console.log("validate");
    const {userId} = req.params;
    const {password, email, name, team, position} = req.body;
    //imgUrl은 필수 아닌 것 같아서 뺌
    if (!userId || !password || !email || !name || !team || !position) {
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
 *     User:
 *       type: object
 *       required:
 *         - userId
 *         - password
 *         - email
 *         - name
 *         - team
 *         - position
 *       properties:
 *         userId:
 *           type: string
 *           description: 사번
 *         password:
 *           type: string
 *           description: 비밀번호
 *         email:
 *           type: string
 *           description: 사원의 e-mail
 *         name:
 *           type: string
 *           description: 사원의 이름
 *         team:
 *           type: string
 *           description: 사원의 소속 팀
 *         position:
 *           type: string
 *           description: 사원의 직책
 *         imgUrl:
 *           type: string
 *           description: 사원의 프로필 이미지 주소
 *       example:
 *         userId: kimpra2989
 *         password: awesomepw
 *         email: example@example.com
 *         name: 강호연
 *         team: delibery1
 *         position: FE-lead
 *         imgUrl: http://example.com/profile.jpg
 */

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: 사원 정보에 대한 API입니다.
 */

/**
 * @swagger
 * /api/users:
 *   get:
 *     summary: 관리자를 제외한 모든 사원의 데이터를 가져옵니다
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: 모든 사원 정보
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/User'
 *       500:
 *         description: 네트워크 오류
 */
router.get("/", (req, res) => {
    const sql = `
    SELECT userId, email, name, team, position, isAdmin, imgUrl 
    FROM Users 
    WHERE isAdmin != true
  `;

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
 * /api/users/{userId}:
 *   get:
 *     summary: 특정 사원의 데이터를 가져옵니다
 *     tags: [Users]
 *     parameters:
 *       - name: userId
 *         in: path
 *         description: 사번
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: 사원 정보
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       404:
 *         description: 해당 사번의 사원이 존재하지 않음
 */
router.get("/:userId", (req, res) => {
    const {userId} = req.params;

    const sql = `
    SELECT userId, email, name, team, position, isAdmin, imgUrl 
    FROM Users 
    WHERE userId=?
  `;

    db.get(sql, [userId], (err, row) => {
        if (err) return handleError(res, err);

        if (!row)
            return res.status(404).json({
                status: "ERROR",
                error: "User not found",
            });

        res.json({
            status: "OK",
            message: `${row.userId}님의 정보를 갖고왔다이놈아콘솔서확인해`,
            data: row,
        });
    });
});

/**
 * @swagger
 * /api/users/{userId}:
 *   post:
 *     summary: 사원을 등록합니다.
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: 사번
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *     responses:
 *       200:
 *         description: 사원이 생성됨
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       400:
 *         description: Bad request
 */
router.post("/:userId", validateUserData, (req, res) => {
    const {userId} = req.params;
    const {password, email, name, team, position, imgUrl} = req.body;

    // TODO: 중복 아이디가 있는지 먼저 확인
    const sql = `
    INSERT INTO Users( userId, password, email, name, team, position, imgUrl) 
    VALUES( $userId, $password, $email, $name, $team, $position, $imgUrl)
  `;

    const params = {
        $userId: userId,
        $password: password,
        $email: email,
        $name: name,
        $team: team,
        $position: position,
        $imgUrl: imgUrl,
    };

    db.run(sql, params, (err) => {
        if (err) return handleError(res, err);

        res.json({
            status: "REGISTER",
            message: `${userId}가 등록되었습니다.`,
        });
    });
});

/**
 * @swagger
 * /api/users/{userId}:
 *   put:
 *     summary: 사원 정보를 수정합니다.
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: 사번
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *     responses:
 *       200:
 *         description: The updated user
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 */
router.put("/:userId", validateUserData, (req, res) => {
    const {userId} = req.params;
    const {password, email, name, team, position, imgUrl} = req.body;

    const updateSql = `
    UPDATE Users SET 
      password = $password,
      email = $email,
      name = $name,
      team = $team,
      position = $position,
      imgUrl = $imgUrl
    WHERE userId = $userId
  `;

    const params = {
        $password: password,
        $email: email,
        $name: name,
        $team: team,
        $position: position,
        $imgUrl: imgUrl,
        $userId: userId,
    };

    db.run(updateSql, params, (err) => {
        if (err) return handleError(res, err);

        res.json({
            status: "UPDATE",
            message: `${userId}님의 정보가 수정되었습니다.`,
        });
    });
});

/**
 * @swagger
 * /api/users/{userId}:
 *   delete:
 *     summary: 특정 사원의 사원 정보를 삭제합니다.
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: 사번
 *     responses:
 *       200:
 *         description: The deleted user
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
 *                   example: 사용자 삭제됨
 */
router.delete("/:userId", (req, res) => {
    const {userId} = req.params;

    // TODO: 관리자인지 확인
    const sql = `
    DELETE FROM Users 
    WHERE userId = ? 
  `;

    db.run(sql, [userId], (err, rows) => {
        if (err) return handleError(res, err);

        res.json({
            status: "DELETE",
            message: "사용자가 삭제되었습니다.",
            data: rows,
        });
    });
});

// router.get("/login", (req, res) => {
//   const { userId, password } = req.body;

router.post("/login", (req, res) => {
    const {userId, password} = req.body;

    const sql = `
    SELECT userId, email, name, team, position, isAdmin, imgUrl 
    FROM Users 
    WHERE userId=$userId and password = $password and withdraw = false
  `;

    const params = {
        $userId: userId,
        $password: password,
    };

    db.all(sql, params, (err, rows) => {
        if (err) return handleError(res, err);

        if (rows.length < 1) {
            return res.status(401).json({
                status: "NO_USER",
                message: "일치하는 사용자가 없습니다.",
            });
        }

        res.json({
            status: "OK",
            data: rows,
        });
    });
});

export default router;
