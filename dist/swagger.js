"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.setupSwagger = void 0;
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
// Read JSON synchronously
const swaggerDocument = JSON.parse(fs_1.default.readFileSync(path_1.default.join(process.cwd(), 'src/swagger.json'), 'utf8'));
const setupSwagger = (app) => {
    app.use('/api-docs', swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(swaggerDocument));
    console.log('Swagger API Docs available at /api-docs');
};
exports.setupSwagger = setupSwagger;
