import { NextRequest, NextResponse } from 'next/server';
import ExcelJS from 'exceljs';
import { QuotationsRepository, InquiriesRepository } from '../../../../lib/db';
import { requireAuth } from '../../../../lib/auth';

// GET /api/quotes/export — Admin: export leads to Excel
export async function GET(req: NextRequest) {
  const authResult = requireAuth(req);
  if (authResult instanceof NextResponse) return authResult;

  try {
    const workbook = new ExcelJS.Workbook();

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

    const quotes = await QuotationsRepository.findAll();
    quotes.forEach((q) => {
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
        created_at: new Date(q.created_at).toLocaleString('en-IN'),
      });
    });

    quotesSheet.getRow(1).font = { bold: true };
    quotesSheet.getRow(1).fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FFE0E0E0' },
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

    const inquiries = await InquiriesRepository.findAll();
    inquiries.forEach((i) => {
      inquiriesSheet.addRow({
        id: i.id,
        name: i.name,
        phone: i.phone,
        email: i.email,
        message: i.message,
        status: i.status,
        created_at: new Date(i.created_at).toLocaleString('en-IN'),
      });
    });

    inquiriesSheet.getRow(1).font = { bold: true };
    inquiriesSheet.getRow(1).fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FFE0E0E0' },
    };

    // Write to buffer and return as response
    const buffer = await workbook.xlsx.writeBuffer();

    return new NextResponse(buffer as ArrayBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'Content-Disposition': 'attachment; filename=uPVC_Leads_Report.xlsx',
      },
    });
  } catch (err) {
    console.error('Excel export error:', err);
    return NextResponse.json({ message: 'Failed to generate Excel report.' }, { status: 500 });
  }
}
