import express from "express";
import db from "../database.js";

const router = express.Router();

/**
 * 유효성 검사 미들웨어
 */
const validateUserData = (req, res, next) => {
  console.log("validate");
  const { userId } = req.params;
  const { password, email, name, team, position } = req.body;
  //imgUrl은 필수 아닌 것 같아서 뺌
  if (!userId || !password || !email || !name || !team || !position) {
    return res.status(400).json({
      status: "ERROR",
      error: "All fields are required",
    });
  }

  next();
};

/**
 * 에러 처리 함수
 */
const handleError = (res, err) => {
  console.error(err);
  return res.status(500).json({
    status: "ERROR",
    error: err.message,
  });
};

/**
 * 사용자 전체조회
 */
router.get("/", (req, res) => {
  const sql = `
    SELECT userId, email, name, team, position, isAdmin, imgUrl 
    FROM Users 
    WHERE isAdmin != true
  `;

  db.all(sql, [], (err, rows) => {
    if (err) return handleError(res, err)

    res.json({
      status: "OK",
      data: rows,
    });
  });
});

/**
 * 사용자 상세조회
 */
router.get("/:userId", (req, res) => {
  const { userId } = req.params;

  const sql = `
    SELECT userId, email, name, team, position, isAdmin, imgUrl 
    FROM Users 
    WHERE userId=?
  `;

  db.get(sql, [userId], (err, row) => {
    if (err) return handleError(res, err);

    res.json({
      status: "OK",
      message: `${row.userId}님의 정보를 갖고왔다이놈아콘솔서확인해`,
      data: row,
    });
  });
});

/**
 * 사용자 등록
 */
router.post("/:userId", validateUserData, (req, res) => {
  const { userId } = req.params;
  const { password, email, name, team, position, imgUrl } = req.body;

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
    if (err) return handleError(res, err)

    res.json({
      status: "REGISTER",
      message: `${userId}가 등록되었습니다.`,
    });
  });
});

/**
 * 사용자 수정
 */
router.put("/:userId", validateUserData, (req, res) => {
  const { userId } = req.params;
  const { password, email, name, team, position, imgUrl } = req.body;

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
 * 사용자 삭제
 */
router.delete("/:userId", (req, res) => {
  const { userId } = req.params;

  // TODO: 관리자인지 확인
  const sql = `
    DELETE FROM Users 
    WHERE userId = ? 
  `;

  db.run(sql, [userId], (err, rows) => {
    if (err) return handleError(res, err)

    res.json({
      status: "DELETE",
      message: "사용자가 삭제되었습니다.",
      data: rows,
    });
  });
});

router.get("/login", (req, res) => {
  const { userId, password } = req.body;

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

    if (rows < 1) {
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
