"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const db_1 = require("./config/db");
const authController_1 = require("./controllers/authController");
const inquiriesController_1 = require("./controllers/inquiriesController");
const quotesController_1 = require("./controllers/quotesController");
const configController_1 = require("./controllers/configController");
const auth_1 = require("./middleware/auth");
// Load environment variables
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = process.env.PORT || 5000;
// Configure CORS
app.use((0, cors_1.default)({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));
// Body parser
app.use(express_1.default.json());
// Request logger middleware
app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
    next();
});
// --- ROUTES ---
// Health check
app.get('/api/health', (req, res) => {
    res.json({ status: 'OK', timestamp: new Date() });
});
// Auth Routes
app.post('/api/auth/login', authController_1.login);
app.get('/api/auth/verify', auth_1.authenticateToken, authController_1.verifyToken);
// Inquiries Routes
app.post('/api/inquiries', inquiriesController_1.createInquiry); // Public submission
app.get('/api/inquiries', auth_1.authenticateToken, inquiriesController_1.getInquiries); // Admin view
app.patch('/api/inquiries/:id/status', auth_1.authenticateToken, inquiriesController_1.updateInquiryStatus); // Admin update
app.delete('/api/inquiries/:id', auth_1.authenticateToken, inquiriesController_1.deleteInquiry); // Admin delete
// Quotes Routes
app.post('/api/quotes', quotesController_1.createQuote); // Public calculator submission
app.get('/api/quotes/export', auth_1.authenticateToken, quotesController_1.exportLeadsToExcel); // Admin Excel export
app.get('/api/quotes', auth_1.authenticateToken, quotesController_1.getQuotes); // Admin view
app.patch('/api/quotes/:id/status', auth_1.authenticateToken, quotesController_1.updateQuoteStatus); // Admin update
app.delete('/api/quotes/:id', auth_1.authenticateToken, quotesController_1.deleteQuote); // Admin delete
// Config / Pricing Config Routes
app.get('/api/config', configController_1.getConfigs); // Public (Frontend fetches configs for calculations)
app.put('/api/config', auth_1.authenticateToken, configController_1.updateConfig); // Admin update
// --- STARTUP ---
async function startServer() {
    try {
        await (0, db_1.initializeDatabase)();
        app.listen(PORT, () => {
            console.log(`==================================================`);
            console.log(` uPVC Doors & Windows Backend Running on Port ${PORT}`);
            console.log(` Local Environment Active - Ready for Connections `);
            console.log(`==================================================`);
        });
    }
    catch (err) {
        console.error('Failed to start the Express server:', err);
        process.exit(1);
    }
}
startServer();
