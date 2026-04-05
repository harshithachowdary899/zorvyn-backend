"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const index_1 = require("./db/index");
const bcrypt_1 = __importDefault(require("bcrypt"));
const uuid_1 = require("uuid");
async function seed() {
    console.log('Seeding Database...');
    const pw = await bcrypt_1.default.hash('password123', 10);
    const viewerId = (0, uuid_1.v4)();
    const analystId = (0, uuid_1.v4)();
    const adminId = (0, uuid_1.v4)();
    // Insert Users
    await (0, index_1.run)('INSERT OR IGNORE INTO users (id, email, password, role) VALUES (?, ?, ?, ?)', [viewerId, 'viewer@test.com', pw, 'VIEWER']);
    await (0, index_1.run)('INSERT OR IGNORE INTO users (id, email, password, role) VALUES (?, ?, ?, ?)', [analystId, 'analyst@test.com', pw, 'ANALYST']);
    await (0, index_1.run)('INSERT OR IGNORE INTO users (id, email, password, role) VALUES (?, ?, ?, ?)', [adminId, 'admin@test.com', pw, 'ADMIN']);
    console.log('Inserted Users (viewer@test.com, analyst@test.com, admin@test.com) / Password: password123');
    // Insert Records
    const records = [
        [(0, uuid_1.v4)(), 5000, 'INCOME', 'Salary', new Date().toISOString(), 'Monthly salary', adminId],
        [(0, uuid_1.v4)(), 1200, 'EXPENSE', 'Rent', new Date().toISOString(), 'Monthly rent', adminId],
        [(0, uuid_1.v4)(), 200, 'EXPENSE', 'Groceries', new Date().toISOString(), 'Walmart shopping', adminId],
        [(0, uuid_1.v4)(), 1500, 'INCOME', 'Bonus', new Date(Date.now() - 86400000 * 5).toISOString(), 'Q1 Bonus', adminId]
    ];
    for (const r of records) {
        await (0, index_1.run)('INSERT OR IGNORE INTO financial_records (id, amount, type, category, date, description, userId) VALUES (?, ?, ?, ?, ?, ?, ?)', r);
    }
    console.log('Inserted Financial Records.');
}
seed().catch(console.error);
