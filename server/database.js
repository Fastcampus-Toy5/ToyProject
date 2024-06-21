import sqlite3 from "sqlite3";

const databaseName = "toyprj1";
const database = new sqlite3.Database(`./${databaseName}.db`);

database.serialize(() => {
  database.run(`
    CREATE TABLE IF NOT EXISTS Users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      userId TEXT NOT NULL,
      password TEXT NOT NULL,
      email TEXT,
      name TEXT,
      team TEXT,
      position TEXT,
      imgUrl TEXT,
      withdraw Boolean,
      isAdmin Boolean DEFAULT false
    );
  `).run(`
    CREATE TABLE IF NOT EXISTS notices (
      no INTEGER PRIMARY KEY AUTOINCREMENT,
      subject TEXT NOT NULL,
      content TEXT,
      imgUrl TEXT,
      regDate DATE NOT NULL
    );
  `).run(`
    CREATE TABLE IF NOT EXISTS commutes (
      no INTEGER PRIMARY KEY AUTOINCREMENT,
      userId TEXT NOT NULL,
      startTime DATE NOT NULL,
      endTime DATE
    );
  `).run(`
      CREATE TABLE IF NOT EXISTS attends (
      no INTEGER PRIMARY KEY AUTOINCREMENT,
      userId TEXT NOT NULL,
      subject TEXT NOT NULL,
      content TEXT NOT NULL,
      startDate DATE NOT NULL,
      endDate DATE NOT NULL,
      type TEXT NOT NULL
    );
  `);
});

export default database;
