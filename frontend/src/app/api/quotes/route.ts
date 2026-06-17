import { NextRequest, NextResponse } from 'next/server';
import { QuotationsRepository, ConfigRepository } from '../../../lib/db';
import { requireAuth } from '../../../lib/auth';

// Helper to calculate pricing on the server side
async function calculateQuotation(params: {
  productType: 'WINDOW' | 'DOOR';
  productStyle: string;
  width: number;
  height: number;
  quantity: number;
  glassType: string;
  frameColor: string;
  hardwareQuality: string;
}) {
  const { productType, productStyle, width, height, quantity, glassType, frameColor, hardwareQuality } = params;

  // Format style name for configuration keys (e.g. "Tilt & Turn" -> "tilt_turn")
  const formattedStyle = productStyle.toLowerCase().replace('&', '').replace(/\s+/g, '_').trim();
  const baseRateKey = `${productType.toLowerCase()}_${formattedStyle}_base_rate`;

  const formattedGlass = glassType.toLowerCase().replace(/\s+/g, '_').trim();
  const glassMultKey = `glass_${formattedGlass}_multiplier`;

  const formattedColor = frameColor.toLowerCase().replace(/\s+/g, '_').trim();
  const colorMultKey = `color_${formattedColor}_multiplier`;

  const formattedHardware = hardwareQuality.toLowerCase().replace(/\s+/g, '_').trim();
  const hardwareMultKey = `hardware_${formattedHardware}_multiplier`;

  // Fetch configs from database with default fallbacks
  const baseRateVal = await ConfigRepository.get(baseRateKey, productType === 'WINDOW' ? '7500' : '10000');
  const glassMultVal = await ConfigRepository.get(glassMultKey, '1.0');
  const colorMultVal = await ConfigRepository.get(colorMultKey, '1.0');
  const hardwareMultVal = await ConfigRepository.get(hardwareMultKey, '1.0');
  const installationVal = await ConfigRepository.get('installation_base_rate', '800');
  const gstRateVal = await ConfigRepository.get('gst_rate_percent', '18');

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
    totalEstimate: Math.round(totalEstimate * 100) / 100,
  };
}

// POST /api/quotes — Public: submit a new quotation
export async function POST(req: NextRequest) {
  try {
    const {
      name, email, phone, address, city,
      productType, productStyle, width, height, quantity,
      glassType, frameColor, hardwareQuality,
    } = await req.json();

    if (
      !name || !email || !phone || !address || !city ||
      !productType || !productStyle || !width || !height || !quantity ||
      !glassType || !frameColor || !hardwareQuality
    ) {
      return NextResponse.json({ message: 'All details and selection parameters are required.' }, { status: 400 });
    }

    // Perform pricing calculations on the backend to avoid client tampering
    const pricing = await calculateQuotation({
      productType,
      productStyle,
      width: parseInt(width),
      height: parseInt(height),
      quantity: parseInt(quantity),
      glassType,
      frameColor,
      hardwareQuality,
    });

    const quotation = await QuotationsRepository.create({
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
      total_estimate: pricing.totalEstimate,
    });

    return NextResponse.json(
      { success: true, message: 'Quotation created successfully.', data: quotation },
      { status: 201 }
    );
  } catch (err) {
    console.error('Error creating quote:', err);
    return NextResponse.json({ message: 'Failed to process quotation request.' }, { status: 500 });
  }
}

// GET /api/quotes — Admin: list all quotations
export async function GET(req: NextRequest) {
  const authResult = requireAuth(req);
  if (authResult instanceof NextResponse) return authResult;

  try {
    const quotes = await QuotationsRepository.findAll();
    return NextResponse.json(quotes);
  } catch (err) {
    console.error('Error fetching quotes:', err);
    return NextResponse.json({ message: 'Failed to fetch quotations.' }, { status: 500 });
  }
}
