"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getConfigs = getConfigs;
exports.updateConfig = updateConfig;
const db_1 = require("../config/db");
async function getConfigs(req, res) {
    try {
        const configs = await db_1.ConfigRepository.getAll();
        // Convert array to a clean key-value object
        const configObj = {};
        configs.forEach(c => {
            configObj[c.key] = c.value;
        });
        return res.json(configObj);
    }
    catch (err) {
        console.error('Error fetching system configurations:', err);
        return res.status(500).json({ message: 'Failed to fetch configurations.' });
    }
}
async function updateConfig(req, res) {
    const settings = req.body; // Key-value object, e.g. { "installation_base_rate": "850" }
    if (!settings || typeof settings !== 'object') {
        return res.status(400).json({ message: 'Invalid payload structure. Object expected.' });
    }
    try {
        const promises = Object.keys(settings).map(key => {
            const val = String(settings[key]);
            return db_1.ConfigRepository.set(key, val);
        });
        await Promise.all(promises);
        return res.json({ success: true, message: 'Pricing configuration updated successfully.' });
    }
    catch (err) {
        console.error('Error updating pricing configurations:', err);
        return res.status(500).json({ message: 'Failed to update configurations.' });
    }
}
