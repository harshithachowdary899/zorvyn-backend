"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const uuid_1 = require("uuid");
const db_1 = require("../db");
const validate_1 = require("../middleware/validate");
const schemas_1 = require("../validations/schemas");
const router = (0, express_1.Router)();
const JWT_SECRET = process.env.JWT_SECRET || 'secret-key-for-dev';
router.post('/register', (0, validate_1.validate)(schemas_1.registerSchema), async (req, res, next) => {
    try {
        const { email, password, role = 'VIEWER' } = req.body;
        const existing = await (0, db_1.get)('SELECT id FROM users WHERE email = ?', [email]);
        if (existing) {
            res.status(400).json({ message: 'Email already exists' });
            return;
        }
        const hashedPassword = await bcrypt_1.default.hash(password, 10);
        const id = (0, uuid_1.v4)();
        await (0, db_1.run)('INSERT INTO users (id, email, password, role, status) VALUES (?, ?, ?, ?, ?)', [id, email, hashedPassword, role, 'ACTIVE']);
        res.status(201).json({ message: 'User registered successfully', userId: id });
    }
    catch (error) {
        next(error);
    }
});
router.post('/login', (0, validate_1.validate)(schemas_1.loginSchema), async (req, res, next) => {
    try {
        const { email, password } = req.body;
        const user = await (0, db_1.get)('SELECT * FROM users WHERE email = ?', [email]);
        if (!user) {
            res.status(401).json({ message: 'Invalid credentials' });
            return;
        }
        const isMatch = await bcrypt_1.default.compare(password, user.password);
        if (!isMatch) {
            res.status(401).json({ message: 'Invalid credentials' });
            return;
        }
        const token = jsonwebtoken_1.default.sign({ id: user.id, email: user.email, role: user.role, status: user.status }, JWT_SECRET, { expiresIn: '1d' });
        res.json({ token, role: user.role });
    }
    catch (error) {
        next(error);
    }
});
exports.default = router;
