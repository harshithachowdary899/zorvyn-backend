"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateFinancialRecordSchema = exports.createFinancialRecordSchema = exports.loginSchema = exports.registerSchema = void 0;
const zod_1 = require("zod");
exports.registerSchema = zod_1.z.object({
    email: zod_1.z.string().email(),
    password: zod_1.z.string().min(6),
    role: zod_1.z.enum(['VIEWER', 'ANALYST', 'ADMIN']).optional(),
});
exports.loginSchema = zod_1.z.object({
    email: zod_1.z.string().email(),
    password: zod_1.z.string(),
});
exports.createFinancialRecordSchema = zod_1.z.object({
    amount: zod_1.z.number().positive(),
    type: zod_1.z.enum(['INCOME', 'EXPENSE']),
    category: zod_1.z.string().min(1),
    date: zod_1.z.string().datetime(),
    description: zod_1.z.string().optional(),
});
exports.updateFinancialRecordSchema = exports.createFinancialRecordSchema.partial();
