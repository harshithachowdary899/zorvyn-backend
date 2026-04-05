import { Router } from 'express';
import { all, get } from '../db';
import { authenticate, authorize } from '../middleware/auth';

const router = Router();

router.use(authenticate);
router.use(authorize(['ANALYST', 'ADMIN']));

router.get('/summary', async (req, res, next) => {
  try {
    const incomeObj: any = await get("SELECT SUM(amount) as total FROM financial_records WHERE type = 'INCOME'");
    const expenseObj: any = await get("SELECT SUM(amount) as total FROM financial_records WHERE type = 'EXPENSE'");
    
    const totalIncome = incomeObj?.total || 0;
    const totalExpenses = expenseObj?.total || 0;
    const netBalance = totalIncome - totalExpenses;

    res.json({
      totalIncome,
      totalExpenses,
      netBalance
    });
  } catch (err) {
    next(err);
  }
});

router.get('/category-totals', async (req, res, next) => {
  try {
    const totals = await all(`
      SELECT category, type, SUM(amount) as total 
      FROM financial_records 
      GROUP BY category, type
      ORDER BY total DESC
    `);
    
    res.json(totals);
  } catch (err) {
    next(err);
  }
});

router.get('/recent', async (req, res, next) => {
  try {
    const limit = parseInt(req.query.limit as string, 10) || 5;
    const recent = await all('SELECT * FROM financial_records ORDER BY date DESC LIMIT ?', [limit]);
    res.json(recent);
  } catch (err) {
    next(err);
  }
});

export default router;
