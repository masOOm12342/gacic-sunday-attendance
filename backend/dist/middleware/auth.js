"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.JWT_SECRET = void 0;
exports.authenticateToken = authenticateToken;
exports.requireSuperAdmin = requireSuperAdmin;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
exports.JWT_SECRET = process.env.JWT_SECRET || 'gacic_church_secret_key_2026_mumbai_glorious';
function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (!token) {
        return res.status(401).json({ success: false, message: 'Access token required.' });
    }
    try {
        const payload = jsonwebtoken_1.default.verify(token, exports.JWT_SECRET);
        req.user = payload;
        next();
    }
    catch (err) {
        return res.status(403).json({ success: false, message: 'Invalid or expired session token.' });
    }
}
function requireSuperAdmin(req, res, next) {
    if (!req.user || req.user.role !== 'SUPER_ADMIN') {
        return res.status(403).json({ success: false, message: 'Super Admin privileges required.' });
    }
    next();
}
