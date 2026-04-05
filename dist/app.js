"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const auth_routes_1 = __importDefault(require("./routes/auth.routes"));
const finance_routes_1 = __importDefault(require("./routes/finance.routes"));
const dashboard_routes_1 = __importDefault(require("./routes/dashboard.routes"));
const errorHandler_1 = require("./middleware/errorHandler");
const swagger_1 = require("./swagger");
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use(express_1.default.json());
// Initialize Swagger docs before routes
(0, swagger_1.setupSwagger)(app);
app.get('/health', (req, res) => {
    res.json({ status: 'OK' });
});
app.use('/api/auth', auth_routes_1.default);
app.use('/api/finance', finance_routes_1.default);
app.use('/api/dashboard', dashboard_routes_1.default);
app.use(errorHandler_1.errorHandler);
exports.default = app;
