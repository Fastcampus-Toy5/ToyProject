const router = express.Router();

/**
 * 사용자 전체조회
 */
router.get("/", (req, res) => {
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
router.get("/:userId", (req, res) => {
  const { userId } = req.params;

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
router.post("/", (req, res) => {
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
router.put("/", (req, res) => {
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
      data: rows,
    });
  });
});

/**
 * 사용자 삭제
 */
router.delete("/", (req, res) => {
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

router.get("/login", (req, res) => {
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

export default router