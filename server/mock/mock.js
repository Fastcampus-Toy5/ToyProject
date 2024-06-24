import database from '../database.js';
import mockUsers from './user-data.js';

// 모의 데이터 삽입 함수
const insertMockData = async () => {
  database.serialize(() => {
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
        user.imgUrl
      ]);
    }
  });
};

const initDb = async () => {
  try {
    await insertMockData();
    console.log('Database initialized with mock data');
  } catch (err) {
    console.error('Error initializing database', err);
  }
};

initDb();
