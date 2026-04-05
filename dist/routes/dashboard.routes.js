"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const db_1 = require("../db");
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)();
router.use(auth_1.authenticate);
router.use((0, auth_1.authorize)(['ANALYST', 'ADMIN']));
router.get('/summary', async (req, res, next) => {
    try {
        const incomeObj = await (0, db_1.get)("SELECT SUM(amount) as total FROM financial_records WHERE type = 'INCOME'");
        const expenseObj = await (0, db_1.get)("SELECT SUM(amount) as total FROM financial_records WHERE type = 'EXPENSE'");
        const totalIncome = incomeObj?.total || 0;
        const totalExpenses = expenseObj?.total || 0;
        const netBalance = totalIncome - totalExpenses;
        res.json({
            totalIncome,
            totalExpenses,
            netBalance
        });
    }
    catch (err) {
        next(err);
    }
});
router.get('/category-totals', async (req, res, next) => {
    try {
        const totals = await (0, db_1.all)(`
      SELECT category, type, SUM(amount) as total 
      FROM financial_records 
      GROUP BY category, type
      ORDER BY total DESC
    `);
        res.json(totals);
    }
    catch (err) {
        next(err);
    }
});
router.get('/recent', async (req, res, next) => {
    try {
        const limit = parseInt(req.query.limit, 10) || 5;
        const recent = await (0, db_1.all)('SELECT * FROM financial_records ORDER BY date DESC LIMIT ?', [limit]);
        res.json(recent);
    }
    catch (err) {
        next(err);
    }
});
exports.default = router;
