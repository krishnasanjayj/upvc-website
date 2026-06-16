"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.login = login;
exports.verifyToken = verifyToken;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const db_1 = require("../config/db");
const JWT_SECRET = process.env.JWT_SECRET || 'upvc_premium_secret_key_2026';
async function login(req, res) {
    const { username, password } = req.body;
    if (!username || !password) {
        return res.status(400).json({ message: 'Username and password are required.' });
    }
    try {
        const user = await db_1.AdminRepository.findByUsername(username);
        if (!user) {
            return res.status(401).json({ message: 'Invalid username or password.' });
        }
        const isMatch = bcryptjs_1.default.compareSync(password, user.password_hash);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid username or password.' });
        }
        const token = jsonwebtoken_1.default.sign({ id: user.id, username: user.username }, JWT_SECRET, { expiresIn: '8h' });
        return res.json({
            message: 'Login successful',
            token,
            user: {
                id: user.id,
                username: user.username
            }
        });
    }
    catch (err) {
        console.error('Login error:', err);
        return res.status(500).json({ message: 'Internal server error during login.' });
    }
}
async function verifyToken(req, res) {
    // If request passed the authenticateToken middleware, token is valid
    const user = req.user;
    return res.json({
        valid: true,
        user
    });
}
