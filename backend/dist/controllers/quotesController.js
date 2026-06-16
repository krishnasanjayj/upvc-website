"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createQuote = createQuote;
exports.getQuotes = getQuotes;
exports.updateQuoteStatus = updateQuoteStatus;
exports.deleteQuote = deleteQuote;
exports.exportLeadsToExcel = exportLeadsToExcel;
const exceljs_1 = __importDefault(require("exceljs"));
const db_1 = require("../config/db");
const mailer_1 = require("../config/mailer");
// Helper to calculate pricing on the server side
async function calculateQuotation(params) {
    const { productType, productStyle, width, height, quantity, glassType, frameColor, hardwareQuality, } = params;
    // Format style name for configuration keys (e.g. "Tilt & Turn" -> "tilt_turn")
    const formattedStyle = productStyle.toLowerCase().replace('&', '').replace(/\s+/g, '_').trim();
    const baseRateKey = `${productType.toLowerCase()}_${formattedStyle}_base_rate`;
    // Format glass type key (e.g. "Double Glazed" -> "double_glazed")
    const formattedGlass = glassType.toLowerCase().replace(/\s+/g, '_').trim();
    const glassMultKey = `glass_${formattedGlass}_multiplier`;
    // Format frame color key (e.g. "Black" -> "black")
    const formattedColor = frameColor.toLowerCase().replace(/\s+/g, '_').trim();
    const colorMultKey = `color_${formattedColor}_multiplier`;
    // Format hardware quality key (e.g. "Premium" -> "premium")
    const formattedHardware = hardwareQuality.toLowerCase().replace(/\s+/g, '_').trim();
    const hardwareMultKey = `hardware_${formattedHardware}_multiplier`;
    // Fetch configs from database with default fallbacks
    const baseRateVal = await db_1.ConfigRepository.get(baseRateKey, productType === 'WINDOW' ? '7500' : '10000');
    const glassMultVal = await db_1.ConfigRepository.get(glassMultKey, '1.0');
    const colorMultVal = await db_1.ConfigRepository.get(colorMultKey, '1.0');
    const hardwareMultVal = await db_1.ConfigRepository.get(hardwareMultKey, '1.0');
    const installationVal = await db_1.ConfigRepository.get('installation_base_rate', '800');
    const gstRateVal = await db_1.ConfigRepository.get('gst_rate_percent', '18');
    const baseRate = parseFloat(baseRateVal);
    const glassMultiplier = parseFloat(glassMultVal);
    const colorMultiplier = parseFloat(colorMultVal);
    const hardwareMultiplier = parseFloat(hardwareMultVal);
    const installationBaseRate = parseFloat(installationVal);
    const gstRate = parseFloat(gstRateVal);
    // Math calculations
    const areaSqm = (width / 1000) * (height / 1000);
    const productCost = areaSqm * baseRate * glassMultiplier * colorMultiplier * hardwareMultiplier * quantity;
    const installationCost = areaSqm * quantity * installationBaseRate;
    const gst = (productCost + installationCost) * (gstRate / 100);
    const totalEstimate = productCost + installationCost + gst;
    return {
        productCost: Math.round(productCost * 100) / 100,
        installationCost: Math.round(installationCost * 100) / 100,
        gst: Math.round(gst * 100) / 100,
        totalEstimate: Math.round(totalEstimate * 100) / 100
    };
}
async function createQuote(req, res) {
    const { name, email, phone, address, city, productType, productStyle, width, height, quantity, glassType, frameColor, hardwareQuality } = req.body;
    if (!name || !email || !phone || !address || !city ||
        !productType || !productStyle || !width || !height || !quantity ||
        !glassType || !frameColor || !hardwareQuality) {
        return res.status(400).json({ message: 'All details and selection parameters are required.' });
    }
    try {
        // Perform pricing calculations on the backend to avoid client tampering
        const pricing = await calculateQuotation({
            productType,
            productStyle,
            width: parseInt(width),
            height: parseInt(height),
            quantity: parseInt(quantity),
            glassType,
            frameColor,
            hardwareQuality
        });
        const quotation = await db_1.QuotationsRepository.create({
            name, email, phone, address, city,
            product_type: productType,
            product_style: productStyle,
            width: parseInt(width),
            height: parseInt(height),
            quantity: parseInt(quantity),
            glass_type: glassType,
            frame_color: frameColor,
            hardware_quality: hardwareQuality,
            product_cost: pricing.productCost,
            installation_cost: pricing.installationCost,
            gst: pricing.gst,
            total_estimate: pricing.totalEstimate
        });
        // Send email alert to admin
        const adminEmail = process.env.ADMIN_EMAIL || 'admin@upvcwebsite.com';
        const emailSubject = `New Smart Quotation Request from ${name}`;
        const emailHtml = `
      <h3>New Smart Quotation Request Received</h3>
      <p><strong>Name:</strong> ${name}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Phone:</strong> ${phone}</p>
      <p><strong>Location:</strong> ${address}, ${city}</p>
      <hr />
      <h4>Product Details:</h4>
      <ul>
        <li><strong>Item Type:</strong> ${productType}</li>
        <li><strong>Style:</strong> ${productStyle}</li>
        <li><strong>Dimensions:</strong> ${width}mm (W) x ${height}mm (H)</li>
        <li><strong>Quantity:</strong> ${quantity}</li>
        <li><strong>Glass Type:</strong> ${glassType}</li>
        <li><strong>Frame Color:</strong> ${frameColor}</li>
        <li><strong>Hardware Quality:</strong> ${hardwareQuality}</li>
      </ul>
      <hr />
      <h4>Cost Estimate:</h4>
      <p><strong>Product Cost:</strong> INR ${pricing.productCost.toLocaleString('en-IN')}</p>
      <p><strong>Installation Cost:</strong> INR ${pricing.installationCost.toLocaleString('en-IN')}</p>
      <p><strong>GST (18%):</strong> INR ${pricing.gst.toLocaleString('en-IN')}</p>
      <p><strong>Total Estimate:</strong> <strong>INR ${pricing.totalEstimate.toLocaleString('en-IN')}</strong></p>
      <p><em>Note: Final quotation may vary after site inspection.</em></p>
    `;
        (0, mailer_1.sendEmailNotification)(adminEmail, emailSubject, emailHtml).catch(err => {
            console.error('Failed to send admin quotation email:', err);
        });
        return res.status(201).json({
            success: true,
            message: 'Quotation created successfully.',
            data: quotation
        });
    }
    catch (err) {
        console.error('Error creating quote:', err);
        return res.status(500).json({ message: 'Failed to process quotation request.' });
    }
}
async function getQuotes(req, res) {
    try {
        const quotes = await db_1.QuotationsRepository.findAll();
        return res.json(quotes);
    }
    catch (err) {
        console.error('Error fetching quotes:', err);
        return res.status(500).json({ message: 'Failed to fetch quotations.' });
    }
}
async function updateQuoteStatus(req, res) {
    const id = parseInt(req.params.id);
    const { status } = req.body;
    if (!status || !['NEW', 'CONTACTED', 'SENT', 'CLOSED'].includes(status)) {
        return res.status(400).json({ message: 'Valid status (NEW, CONTACTED, SENT, CLOSED) is required.' });
    }
    try {
        const updated = await db_1.QuotationsRepository.updateStatus(id, status);
        if (!updated) {
            return res.status(404).json({ message: 'Quotation not found.' });
        }
        return res.json(updated);
    }
    catch (err) {
        console.error('Error updating quotation status:', err);
        return res.status(500).json({ message: 'Failed to update quotation status.' });
    }
}
async function deleteQuote(req, res) {
    const id = parseInt(req.params.id);
    try {
        const deleted = await db_1.QuotationsRepository.delete(id);
        if (!deleted) {
            return res.status(404).json({ message: 'Quotation not found.' });
        }
        return res.json({ success: true, message: 'Quotation deleted successfully.' });
    }
    catch (err) {
        console.error('Error deleting quote:', err);
        return res.status(500).json({ message: 'Failed to delete quotation.' });
    }
}
// Export Inquiries and Quotes to Excel Workbook
async function exportLeadsToExcel(req, res) {
    try {
        const workbook = new exceljs_1.default.Workbook();
        // 1. Quotations Sheet
        const quotesSheet = workbook.addWorksheet('Quotations');
        quotesSheet.columns = [
            { header: 'ID', key: 'id', width: 8 },
            { header: 'Name', key: 'name', width: 20 },
            { header: 'Phone', key: 'phone', width: 15 },
            { header: 'Email', key: 'email', width: 25 },
            { header: 'City', key: 'city', width: 15 },
            { header: 'Address', key: 'address', width: 30 },
            { header: 'Type', key: 'product_type', width: 12 },
            { header: 'Style', key: 'product_style', width: 15 },
            { header: 'Size (WxH mm)', key: 'dimensions', width: 18 },
            { header: 'Qty', key: 'quantity', width: 8 },
            { header: 'Glass', key: 'glass_type', width: 15 },
            { header: 'Color', key: 'frame_color', width: 12 },
            { header: 'Hardware', key: 'hardware_quality', width: 12 },
            { header: 'Prod Cost', key: 'product_cost', width: 15 },
            { header: 'Inst Cost', key: 'installation_cost', width: 15 },
            { header: 'GST', key: 'gst', width: 12 },
            { header: 'Total Est', key: 'total_estimate', width: 15 },
            { header: 'Status', key: 'status', width: 12 },
            { header: 'Date', key: 'created_at', width: 20 },
        ];
        const quotes = await db_1.QuotationsRepository.findAll();
        quotes.forEach(q => {
            quotesSheet.addRow({
                id: q.id,
                name: q.name,
                phone: q.phone,
                email: q.email,
                city: q.city,
                address: q.address,
                product_type: q.product_type,
                product_style: q.product_style,
                dimensions: `${q.width} x ${q.height}`,
                quantity: q.quantity,
                glass_type: q.glass_type,
                frame_color: q.frame_color,
                hardware_quality: q.hardware_quality,
                product_cost: q.product_cost,
                installation_cost: q.installation_cost,
                gst: q.gst,
                total_estimate: q.total_estimate,
                status: q.status,
                created_at: new Date(q.created_at).toLocaleString('en-IN')
            });
        });
        // Style the header row of quotes
        quotesSheet.getRow(1).font = { bold: true };
        quotesSheet.getRow(1).fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: 'FFE0E0E0' }
        };
        // 2. Inquiries Sheet
        const inquiriesSheet = workbook.addWorksheet('Inquiries');
        inquiriesSheet.columns = [
            { header: 'ID', key: 'id', width: 8 },
            { header: 'Name', key: 'name', width: 20 },
            { header: 'Phone', key: 'phone', width: 15 },
            { header: 'Email', key: 'email', width: 25 },
            { header: 'Message', key: 'message', width: 45 },
            { header: 'Status', key: 'status', width: 12 },
            { header: 'Date', key: 'created_at', width: 20 },
        ];
        const inquiries = await db_1.InquiriesRepository.findAll();
        inquiries.forEach(i => {
            inquiriesSheet.addRow({
                id: i.id,
                name: i.name,
                phone: i.phone,
                email: i.email,
                message: i.message,
                status: i.status,
                created_at: new Date(i.created_at).toLocaleString('en-IN')
            });
        });
        inquiriesSheet.getRow(1).font = { bold: true };
        inquiriesSheet.getRow(1).fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: 'FFE0E0E0' }
        };
        // Send the response
        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        res.setHeader('Content-Disposition', 'attachment; filename=uPVC_Leads_Report.xlsx');
        await workbook.xlsx.write(res);
        res.end();
    }
    catch (err) {
        console.error('Excel export error:', err);
        return res.status(500).json({ message: 'Failed to generate Excel report.' });
    }
}
