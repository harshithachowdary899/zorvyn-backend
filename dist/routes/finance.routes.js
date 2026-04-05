"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const uuid_1 = require("uuid");
const db_1 = require("../db");
const validate_1 = require("../middleware/validate");
const schemas_1 = require("../validations/schemas");
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)();
// Apply auth middleware to all routes
router.use(auth_1.authenticate);
// Get all records (Analyst, Admin)
router.get('/', (0, auth_1.authorize)(['ANALYST', 'ADMIN']), async (req, res, next) => {
    try {
        const { category, type, startDate, endDate } = req.query;
        let query = 'SELECT * FROM financial_records WHERE 1=1';
        const params = [];
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
        const records = await (0, db_1.all)(query, params);
        res.json(records);
    }
    catch (err) {
        next(err);
    }
});
// Create record (Admin only)
router.post('/', (0, auth_1.authorize)(['ADMIN']), (0, validate_1.validate)(schemas_1.createFinancialRecordSchema), async (req, res, next) => {
    try {
        const { amount, type, category, date, description } = req.body;
        const id = (0, uuid_1.v4)();
        await (0, db_1.run)('INSERT INTO financial_records (id, amount, type, category, date, description, userId) VALUES (?, ?, ?, ?, ?, ?, ?)', [id, amount, type, category, date, description || null, req.user?.id]);
        const newRecord = await (0, db_1.get)('SELECT * FROM financial_records WHERE id = ?', [id]);
        res.status(201).json(newRecord);
    }
    catch (err) {
        next(err);
    }
});
// Update record (Admin only)
router.put('/:id', (0, auth_1.authorize)(['ADMIN']), (0, validate_1.validate)(schemas_1.updateFinancialRecordSchema), async (req, res, next) => {
    try {
        const { id } = req.params;
        const { amount, type, category, date, description } = req.body;
        const existing = await (0, db_1.get)('SELECT id FROM financial_records WHERE id = ?', [id]);
        if (!existing) {
            res.status(404).json({ message: 'Record not found' });
            return;
        }
        const updates = [];
        const params = [];
        if (amount !== undefined) {
            updates.push('amount = ?');
            params.push(amount);
        }
        if (type !== undefined) {
            updates.push('type = ?');
            params.push(type);
        }
        if (category !== undefined) {
            updates.push('category = ?');
            params.push(category);
        }
        if (date !== undefined) {
            updates.push('date = ?');
            params.push(date);
        }
        if (description !== undefined) {
            updates.push('description = ?');
            params.push(description);
        }
        if (updates.length > 0) {
            params.push(id);
            await (0, db_1.run)(`UPDATE financial_records SET ${updates.join(', ')}, updatedAt = CURRENT_TIMESTAMP WHERE id = ?`, params);
        }
        const updatedRecord = await (0, db_1.get)('SELECT * FROM financial_records WHERE id = ?', [id]);
        res.json(updatedRecord);
    }
    catch (err) {
        next(err);
    }
});
// Delete record (Admin only)
router.delete('/:id', (0, auth_1.authorize)(['ADMIN']), async (req, res, next) => {
    try {
        const { id } = req.params;
        const existing = await (0, db_1.get)('SELECT id FROM financial_records WHERE id = ?', [id]);
        if (!existing) {
            res.status(404).json({ message: 'Record not found' });
            return;
        }
        await (0, db_1.run)('DELETE FROM financial_records WHERE id = ?', [id]);
        res.status(204).send();
    }
    catch (err) {
        next(err);
    }
});
exports.default = router;
