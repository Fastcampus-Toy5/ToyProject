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
      withdraw Boolean DEFAULT false,
      isAdmin Boolean DEFAULT false
    );
  `).run(`
    CREATE TABLE IF NOT EXISTS Notices (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      subject TEXT NOT NULL,
      content TEXT,
      imgUrl TEXT,
      date DATE NOT NULL
    );
  `).run(`
    CREATE TABLE IF NOT EXISTS Commutes (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      userId TEXT NOT NULL,
      date DATE NOT NULL,
      arriveTime TIME NOT NULL,
      leaveTime TIME,
      FOREIGN KEY (userId) REFERENCES Users(userId)
    );
  `).run(`
    CREATE TABLE IF NOT EXISTS Attends (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      userId TEXT NOT NULL,
      subject TEXT NOT NULL,
      content TEXT NOT NULL,
      startDate DATE NOT NULL,
      endDate DATE NOT NULL,
      type TEXT NOT NULL,
      FOREIGN KEY (userId) REFERENCES Users(userId)
    );
  `);
});

export default database;
