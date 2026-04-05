import { run } from './db/index';
import bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';

async function seed() {
  console.log('Seeding Database...');
  
  const pw = await bcrypt.hash('password123', 10);
  
  const viewerId = uuidv4();
  const analystId = uuidv4();
  const adminId = uuidv4();

  // Insert Users
  await run('INSERT OR IGNORE INTO users (id, email, password, role) VALUES (?, ?, ?, ?)', [viewerId, 'viewer@test.com', pw, 'VIEWER']);
  await run('INSERT OR IGNORE INTO users (id, email, password, role) VALUES (?, ?, ?, ?)', [analystId, 'analyst@test.com', pw, 'ANALYST']);
  await run('INSERT OR IGNORE INTO users (id, email, password, role) VALUES (?, ?, ?, ?)', [adminId, 'admin@test.com', pw, 'ADMIN']);

  console.log('Inserted Users (viewer@test.com, analyst@test.com, admin@test.com) / Password: password123');

  // Insert Records
  const records = [
    [uuidv4(), 5000, 'INCOME', 'Salary', new Date().toISOString(), 'Monthly salary', adminId],
    [uuidv4(), 1200, 'EXPENSE', 'Rent', new Date().toISOString(), 'Monthly rent', adminId],
    [uuidv4(), 200, 'EXPENSE', 'Groceries', new Date().toISOString(), 'Walmart shopping', adminId],
    [uuidv4(), 1500, 'INCOME', 'Bonus', new Date(Date.now() - 86400000 * 5).toISOString(), 'Q1 Bonus', adminId]
  ];

  for (const r of records) {
    await run('INSERT OR IGNORE INTO financial_records (id, amount, type, category, date, description, userId) VALUES (?, ?, ?, ?, ?, ?, ?)', r);
  }

  console.log('Inserted Financial Records.');
}

seed().catch(console.error);
