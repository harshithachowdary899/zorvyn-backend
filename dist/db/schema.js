"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateSchema = generateSchema;
const index_1 = require("./index");
async function generateSchema() {
    console.log('Initializing database schema...');
    const createUserTable = `
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      email TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      role TEXT DEFAULT 'VIEWER',
      status TEXT DEFAULT 'ACTIVE',
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
      updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `;
    const createFinancialRecordTable = `
    CREATE TABLE IF NOT EXISTS financial_records (
      id TEXT PRIMARY KEY,
      amount REAL NOT NULL,
      type TEXT NOT NULL,
      category TEXT NOT NULL,
      date DATETIME NOT NULL,
      description TEXT,
      userId TEXT,
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
      updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (userId) REFERENCES users(id) ON DELETE SET NULL
    );
  `;
    try {
        await (0, index_1.run)(createUserTable);
        console.log('User table ensured.');
        await (0, index_1.run)(createFinancialRecordTable);
        console.log('FinancialRecord table ensured.');
        console.log('Schema generation complete.');
    }
    catch (error) {
        console.error('Error generating schema:', error);
    }
}
