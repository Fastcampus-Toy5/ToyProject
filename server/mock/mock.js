import database from "../database.js";
import mockUsers from "./user-data.js";
import mockAttends from "./attend-data.js";
import mockCommutes from "./commute-data.js";
import mockNotices from "./notice-data.js";

// 모의 데이터 삽입 함수
const insertMockData = async () => {
  database.serialize(() => {
    // user data
    for (const user of mockUsers) {
      const sql = `
        INSERT INTO Users (userId, password, email, name, team, position, imgUrl)
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `;
      database.run(sql, [
        user.userId,
        user.password,
        user.email,
        user.name,
        user.team,
        user.position,
        user.imgUrl,
      ]);
    }

    // attend data
    for (const attend of mockAttends) {
      const sql = `
        INSERT INTO Attends (userId, subject, content, startDate, endDate, type)
        VALUES (?, ?, ?, ?, ?, ?)
      `;
      database.run(sql, [
        attend.userId,
        attend.subject,
        attend.content,
        attend.startDate,
        attend.endDate,
        attend.type,
      ]);
    }

    // commute data
    for (const commute of mockCommutes) {
      const sql = `
      INSERT INTO Commutes (id, userId, date, arriveTime, leaveTime)
      VALUES (?, ?, ?, ?, ?)
    `;
      database.run(sql, [
        commute.id,
        commute.userId,
        commute.date,
        commute.arriveTime,
        commute.leaveTime,
      ]);
    }

    // notice data
    for (const notice of mockNotices) {
      const sql = `
      INSERT INTO notices (subject, content, imgUrl, date)
      VALUES (?, ?, ?, ?)
    `;
      database.run(sql, [
        notice.subject,
        notice.content,
        notice.imgUrl,
        notice.date,
      ]);
    }
  });
};

const initDb = async () => {
  try {
    await insertMockData();
    console.log("Database initialized with mock data");
  } catch (err) {
    console.error("Error initializing database", err);
  }
};

initDb();
