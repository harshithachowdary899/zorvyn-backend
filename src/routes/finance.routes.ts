import { Router } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { run, all, get } from '../db';
import { validate } from '../middleware/validate';
import { createFinancialRecordSchema, updateFinancialRecordSchema } from '../validations/schemas';
import { authenticate, authorize, AuthRequest } from '../middleware/auth';

const router = Router();

// Apply auth middleware to all routes
router.use(authenticate);

// Get all records (Analyst, Admin)
router.get('/', authorize(['ANALYST', 'ADMIN']), async (req: AuthRequest, res, next) => {
  try {
    const { category, type, startDate, endDate } = req.query;
    let query = 'SELECT * FROM financial_records WHERE 1=1';
    const params: any[] = [];

    if (category) {
      query += ' AND category = ?';
      params.push(category);
    }
    if (type) {
      query += ' AND type = ?';
      params.push(type);
    }
    if (startDate) {
      query += ' AND date >= ?';
      params.push(startDate);
    }
    if (endDate) {
      query += ' AND date <= ?';
      params.push(endDate);
    }

    query += ' ORDER BY date DESC';

    const records = await all(query, params);
    res.json(records);
  } catch (err) {
    next(err);
  }
});

// Create record (Admin only)
router.post('/', authorize(['ADMIN']), validate(createFinancialRecordSchema), async (req: AuthRequest, res, next) => {
  try {
    const { amount, type, category, date, description } = req.body;
    const id = uuidv4();
    
    await run(
      'INSERT INTO financial_records (id, amount, type, category, date, description, userId) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [id, amount, type, category, date, description || null, req.user?.id]
    );

    const newRecord = await get('SELECT * FROM financial_records WHERE id = ?', [id]);
    res.status(201).json(newRecord);
  } catch (err) {
    next(err);
  }
});

// Update record (Admin only)
router.put('/:id', authorize(['ADMIN']), validate(updateFinancialRecordSchema), async (req: AuthRequest, res, next) => {
  try {
    const { id } = req.params;
    const { amount, type, category, date, description } = req.body;

    const existing = await get('SELECT id FROM financial_records WHERE id = ?', [id]);
    if (!existing) {
      res.status(404).json({ message: 'Record not found' });
      return;
    }

    const updates = [];
    const params = [];

    if (amount !== undefined) { updates.push('amount = ?'); params.push(amount); }
    if (type !== undefined) { updates.push('type = ?'); params.push(type); }
    if (category !== undefined) { updates.push('category = ?'); params.push(category); }
    if (date !== undefined) { updates.push('date = ?'); params.push(date); }
    if (description !== undefined) { updates.push('description = ?'); params.push(description); }

    if (updates.length > 0) {
      params.push(id);
      await run(`UPDATE financial_records SET ${updates.join(', ')}, updatedAt = CURRENT_TIMESTAMP WHERE id = ?`, params);
    }

    const updatedRecord = await get('SELECT * FROM financial_records WHERE id = ?', [id]);
    res.json(updatedRecord);
  } catch (err) {
    next(err);
  }
});

// Delete record (Admin only)
router.delete('/:id', authorize(['ADMIN']), async (req: AuthRequest, res, next) => {
  try {
    const { id } = req.params;
    const existing = await get('SELECT id FROM financial_records WHERE id = ?', [id]);
    if (!existing) {
      res.status(404).json({ message: 'Record not found' });
      return;
    }

    await run('DELETE FROM financial_records WHERE id = ?', [id]);
    res.status(204).send();
  } catch (err) {
    next(err);
  }
});

export default router;
