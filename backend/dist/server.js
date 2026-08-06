"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const dotenv_1 = __importDefault(require("dotenv"));
const db_1 = require("./db");
const auth_1 = __importDefault(require("./routes/auth"));
const members_1 = __importDefault(require("./routes/members"));
const attendance_1 = __importDefault(require("./routes/attendance"));
const dashboard_1 = __importDefault(require("./routes/dashboard"));
const adminRequests_1 = __importDefault(require("./routes/adminRequests"));
const export_1 = __importDefault(require("./routes/export"));
const database_1 = __importDefault(require("./routes/database"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = process.env.PORT || 5000;
// Security & Middleware
app.use((0, helmet_1.default)({ crossOriginResourcePolicy: false }));
app.use((0, cors_1.default)({
    origin: '*', // Allows access from mobile browsers on same WiFi network
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
}));
app.use(express_1.default.json({ limit: '10mb' }));
app.use(express_1.default.urlencoded({ extended: true, limit: '10mb' }));
// Health Check Route
app.get('/api/health', (req, res) => {
    res.json({
        status: 'ONLINE',
        organization: 'Glorious Apostolic Church India Council',
        system: 'Sunday Attendance Management System',
        timestamp: new Date().toISOString()
    });
});
// API Routes
app.use('/api/auth', auth_1.default);
app.use('/api/members', members_1.default);
app.use('/api/attendance', attendance_1.default);
app.use('/api/dashboard', dashboard_1.default);
app.use('/api/admin/requests', adminRequests_1.default);
app.use('/api/export', export_1.default);
app.use('/api/database', database_1.default);
// Global Error Handler
app.use((err, req, res, next) => {
    console.error('[Server Error]', err);
    res.status(500).json({
        success: false,
        message: err.message || 'Internal Server Error'
    });
});
// Initialize Database & Start Server
(0, db_1.initDatabase)().then(() => {
    app.listen(PORT, () => {
        console.log(`===================================================================`);
        console.log(` Glorious Apostolic Church India Council - Backend Server Running`);
        console.log(` Environment: Production Ready | Timezone: IST (UTC+5:30)`);
        console.log(` Server URL:  http://localhost:${PORT}`);
        console.log(` Super Admin Email: gacic_admin@gmail.com`);
        console.log(`===================================================================`);
    });
}).catch(err => {
    console.error('Failed to initialize database server:', err);
});
