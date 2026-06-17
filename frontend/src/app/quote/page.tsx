'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Calculator, Sparkles, AlertCircle, Phone, ArrowLeft, ArrowRight, Check, MessageCircle } from 'lucide-react';
import { useLanguage } from '../../components/LanguageContext';
import { ApiService } from '../../utils/api';

// Config structures
interface ConfigState {
  [key: string]: number;
}

function QuoteFormContent() {
  const { t } = useLanguage();
  const searchParams = useSearchParams();

  // Pricing constants loaded from backend
  const [pricingConfig, setPricingConfig] = useState<ConfigState>({
    // Window Base Rates per SQM (INR)
    window_sliding_base_rate: 7500,
    window_casement_base_rate: 8500,
    window_fixed_base_rate: 6000,
    window_tilt_turn_base_rate: 9500,
    window_bay_base_rate: 11000,
    // Door Base Rates per SQM (INR)
    door_sliding_base_rate: 10000,
    door_french_base_rate: 12000,
    door_casement_base_rate: 11000,
    door_balcony_base_rate: 10500,
    door_entrance_base_rate: 14000,
    // Multipliers
    glass_clear_multiplier: 1.0,
    glass_toughened_multiplier: 1.25,
    glass_double_glazed_multiplier: 1.5,
    color_white_multiplier: 1.0,
    color_black_multiplier: 1.15,
    color_brown_multiplier: 1.15,
    color_custom_multiplier: 1.25,
    hardware_standard_multiplier: 1.0,
    hardware_premium_multiplier: 1.3,
    // Installation and Taxes
    installation_base_rate: 800,
    gst_rate_percent: 18
  });

  // Step state
  const [step, setStep] = useState(1);

  // Form State
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');

  const [productType, setProductType] = useState<'WINDOW' | 'DOOR'>('WINDOW');
  const [productStyle, setProductStyle] = useState('Sliding');
  const [width, setWidth] = useState(1200); // mm
  const [height, setHeight] = useState(1200); // mm
  const [quantity, setQuantity] = useState(1);

  const [glassType, setGlassType] = useState('Clear Glass');
  const [frameColor, setFrameColor] = useState('White');
  const [hardwareQuality, setHardwareQuality] = useState('Standard Quality');

  // Math totals
  const [productCost, setProductCost] = useState(0);
  const [installationCost, setInstallationCost] = useState(0);
  const [gstAmount, setGstAmount] = useState(0);
  const [totalCost, setTotalCost] = useState(0);

  const [loadingConfig, setLoadingConfig] = useState(true);
  const [submittingLead, setSubmittingLead] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [partyPoppers, setPartyPoppers] = useState(false);

  // Load configs from API on mount
  useEffect(() => {
    async function fetchConfigs() {
      try {
        const fetched = await ApiService.getConfigs();
        const parsed: ConfigState = {};
        Object.keys(fetched).forEach(k => {
          parsed[k] = parseFloat(fetched[k]);
        });
        // Merge with initial state
        setPricingConfig(prev => ({ ...prev, ...parsed }));
      } catch (err) {
        console.error('Failed to load configs from backend, using fallbacks:', err);
      } finally {
        setLoadingConfig(false);
      }
    }
    fetchConfigs();
  }, []);

  // Pre-fill parameters from URL
  useEffect(() => {
    const styleParam = searchParams.get('style');
    const typeParam = searchParams.get('type');

    if (typeParam === 'WINDOW' || typeParam === 'Window') {
      setProductType('WINDOW');
      setProductStyle(styleParam || 'Sliding');
    } else if (typeParam === 'DOOR' || typeParam === 'Door') {
      setProductType('DOOR');
      setProductStyle(styleParam || 'Sliding');
    }
  }, [searchParams]);

  // Recalculate cost when inputs change
  useEffect(() => {
    // 1. Base rate check
    const formattedStyle = productStyle.toLowerCase().replace('&', '').replace(/\s+/g, '_').trim();
    const baseRateKey = `${productType.toLowerCase()}_${formattedStyle}_base_rate`;
    const baseRate = pricingConfig[baseRateKey] || (productType === 'WINDOW' ? 7500 : 10000);

    // 2. Glass multiplier check
    const glassMap: { [key: string]: string } = {
      'Clear Glass': 'glass_clear_multiplier',
      'Toughened Glass': 'glass_toughened_multiplier',
      'Double Glazed Glass': 'glass_double_glazed_multiplier'
    };
    const glassKey = glassMap[glassType] || 'glass_clear_multiplier';
    const glassMultiplier = pricingConfig[glassKey] || 1.0;

    // 3. Color multiplier check
    const colorMap: { [key: string]: string } = {
      'White': 'color_white_multiplier',
      'Black': 'color_black_multiplier',
      'Brown': 'color_brown_multiplier',
      'Custom Laminated': 'color_custom_multiplier'
    };
    const colorKey = colorMap[frameColor] || 'color_white_multiplier';
    const colorMultiplier = pricingConfig[colorKey] || 1.0;

    // 4. Hardware multiplier check
    const hwMap: { [key: string]: string } = {
      'Standard Quality': 'hardware_standard_multiplier',
      'Premium Quality (Imported)': 'hardware_premium_multiplier'
    };
    const hwKey = hwMap[hardwareQuality] || 'hardware_standard_multiplier';
    const hardwareMultiplier = pricingConfig[hwKey] || 1.0;

    // 5. Inst rates
    const installationBaseRate = pricingConfig['installation_base_rate'] || 800;
    const gstRatePercent = pricingConfig['gst_rate_percent'] || 18;

    // 6. Cost Math
    const areaSqm = (width / 1000) * (height / 1000);
    const prodVal = areaSqm * baseRate * glassMultiplier * colorMultiplier * hardwareMultiplier * quantity;
    const instVal = areaSqm * quantity * installationBaseRate;
    const gstVal = (prodVal + instVal) * (gstRatePercent / 100);
    const totalVal = prodVal + instVal + gstVal;

    setProductCost(Math.round(prodVal));
    setInstallationCost(Math.round(instVal));
    setGstAmount(Math.round(gstVal));
    setTotalCost(Math.round(totalVal));
  }, [productType, productStyle, width, height, quantity, glassType, frameColor, hardwareQuality, pricingConfig]);

  // Reset styles when product type changes
  const handleProductTypeChange = (type: 'WINDOW' | 'DOOR') => {
    setProductType(type);
    setProductStyle('Sliding');
  };

  const handleNextStep = () => {
    if (step === 1) {
      if (!fullName || !phone || !email || !address || !city) {
        setErrorMsg('Please fill in all customer contact details.');
        return;
      }
      setErrorMsg('');
      setStep(2);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSubmittingLead(true);

    try {
      await ApiService.submitQuotation({
        name: fullName,
        email,
        phone,
        address,
        city,
        productType,
        productStyle,
        width,
        height,
        quantity,
        glassType,
        frameColor,
        hardwareQuality
      });
      setSuccess(true);
      setPartyPoppers(true);
      // Clean poppers after 5s
      setTimeout(() => setPartyPoppers(false), 5000);
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || 'Failed to submit quote inquiry. Please try again.');
    } finally {
      setSubmittingLead(false);
    }
  };

  const getWhatsAppShareUrl = () => {
    const message = `Hello! Here is your calculated uPVC Doors & Windows Smart Quotation estimate:

👤 *Customer Name*: ${fullName}
📞 *Phone*: ${phone}
📧 *Email*: ${email}
📍 *Location*: ${address}, ${city}

📐 *Product*: ${productType} (${productStyle})
📏 *Dimensions*: ${width}mm (W) x ${height}mm (H)
🔢 *Quantity*: ${quantity}
🎨 *Color*: ${frameColor}
💎 *Glass*: ${glassType}
🛠️ *Hardware*: ${hardwareQuality}

💰 *Estimated Costs*:
• Product Cost: ₹${productCost.toLocaleString('en-IN')}
• Installation Cost: ₹${installationCost.toLocaleString('en-IN')}
• GST (18%): ₹${gstAmount.toLocaleString('en-IN')}
━━━━━━━━━━━━━━━
✨ *Total Estimated Quote*: ₹${totalCost.toLocaleString('en-IN')}

Thank you! Feel free to reply if you have any questions or to schedule a physical site measurement.`;

    // Clean phone number for WhatsApp url (digits only)
    const cleanedPhone = phone.replace(/\D/g, '');
    // Default to prefixing with '91' (India) if it's 10 digits
    const targetPhone = cleanedPhone.length === 10 ? `91${cleanedPhone}` : cleanedPhone;

    return `https://wa.me/${targetPhone}?text=${encodeURIComponent(message)}`;
  };

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8 relative">
      
      {/* Visual emoji explosion for success */}
      {partyPoppers && (
        <div className="fixed inset-0 z-50 pointer-events-none flex items-center justify-center overflow-hidden">
          <div className="text-4xl animate-bounce">🎉 🥳 💥 ✨ 🎊 💥 🥳 🎉</div>
        </div>
      )}

      {/* Page header */}
      <div className="text-center space-y-2 mb-10">
        <Calculator className="h-10 w-10 text-amber-600 dark:text-amber-500 mx-auto" />
        <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white sm:text-4xl">
          {t('calculator.title')}
        </h1>
        <p className="mx-auto max-w-2xl text-sm text-slate-500 dark:text-slate-400">
          Configure dimensions, color options, glass types, and get a realistic factory cost estimate in seconds.
        </p>
      </div>

      {success ? (
        /* Success screen card */
        <div className="max-w-2xl mx-auto bg-white dark:bg-slate-800 rounded-3xl p-8 border border-slate-200 dark:border-slate-700 shadow-lg text-center space-y-6">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-100 text-green-600 dark:bg-green-950/20">
            <Check className="h-8 w-8" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Request Submitted Successfully!</h2>
          <p className="text-slate-600 dark:text-slate-350 leading-relaxed text-sm">
            {t('calculator.successMessage')}
          </p>
          <div className="bg-slate-50 dark:bg-slate-900 rounded-2xl p-4 border border-slate-150 dark:border-slate-800 text-left space-y-2 text-xs">
            <h4 className="font-bold text-slate-800 dark:text-slate-200">Quote Configuration:</h4>
            <p><strong>Item:</strong> {productType} ({productStyle})</p>
            <p><strong>Size:</strong> {width}mm x {height}mm (Qty: {quantity})</p>
            <p><strong>Estimated Total:</strong> <span className="font-extrabold text-amber-600">INR {totalCost.toLocaleString('en-IN')}</span></p>
          </div>
          <div className="space-y-3">
            <a
              href={getWhatsAppShareUrl()}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-md transition-colors inline-flex items-center justify-center space-x-2 text-xs"
            >
              <MessageCircle className="h-5 w-5 fill-current" />
              <span>Share Quotation on WhatsApp</span>
            </a>
            <div className="flex gap-4">
              <button
                onClick={() => {
                  setSuccess(false);
                  setStep(1);
                  setFullName('');
                  setPhone('');
                  setEmail('');
                  setAddress('');
                  setCity('');
                }}
                className="flex-1 py-3 text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-md transition-colors"
              >
                Calculate Another Window
              </button>
              <a
                href="tel:+919445477574"
                className="flex-1 py-3 text-xs font-bold border border-slate-300 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 rounded-xl transition-colors inline-flex items-center justify-center"
              >
                <Phone className="h-4 w-4 mr-2" />
                Call Support
              </a>
            </div>
          </div>
        </div>
      ) : (
        /* Form wizard */
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Form Area */}
          <div className="lg:col-span-2 bg-white dark:bg-slate-800 rounded-3xl p-6 md:p-8 border border-slate-200 dark:border-slate-700 shadow-sm space-y-6">
            
            {/* Step indicators */}
            <div className="flex items-center space-x-4">
              <span className={`h-8 w-8 flex items-center justify-center rounded-full font-bold text-xs ${
                step === 1 ? 'bg-blue-600 text-white' : 'bg-green-600 text-white'
              }`}>
                {step === 1 ? '1' : '✓'}
              </span>
              <span className="text-xs font-bold text-slate-400">/</span>
              <span className={`h-8 w-8 flex items-center justify-center rounded-full font-bold text-xs ${
                step === 2 ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-400 dark:bg-slate-700 dark:text-slate-400'
              }`}>
                2
              </span>
              <span className="text-sm font-bold text-slate-800 dark:text-slate-200">
                {step === 1 ? t('calculator.customerDetails') : t('calculator.formTitle')}
              </span>
            </div>

            {errorMsg && (
              <div className="flex items-center p-4 bg-red-50 dark:bg-red-950/20 text-red-600 dark:text-red-400 rounded-xl text-xs font-semibold">
                <AlertCircle className="h-5 w-5 mr-2" />
                {errorMsg}
              </div>
            )}

            {/* Step 1: Customer Details */}
            {step === 1 && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">{t('calculator.fullName')} *</label>
                    <input
                      type="text"
                      required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="Enter full name"
                      className="w-full rounded-xl border border-slate-300 px-4 py-2.5 text-sm focus:border-blue-500 focus:outline-none dark:border-slate-750 dark:bg-slate-900"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">{t('calculator.phone')} *</label>
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="e.g. +91 98765 43210"
                      className="w-full rounded-xl border border-slate-300 px-4 py-2.5 text-sm focus:border-blue-500 focus:outline-none dark:border-slate-750 dark:bg-slate-900"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">{t('calculator.email')} *</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter email address"
                    className="w-full rounded-xl border border-slate-300 px-4 py-2.5 text-sm focus:border-blue-500 focus:outline-none dark:border-slate-750 dark:bg-slate-900"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="md:col-span-2">
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">{t('calculator.address')} *</label>
                    <input
                      type="text"
                      required
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      placeholder="Street address / apartment"
                      className="w-full rounded-xl border border-slate-300 px-4 py-2.5 text-sm focus:border-blue-500 focus:outline-none dark:border-slate-750 dark:bg-slate-900"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">{t('calculator.city')} *</label>
                    <input
                      type="text"
                      required
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      placeholder="Chennai"
                      className="w-full rounded-xl border border-slate-300 px-4 py-2.5 text-sm focus:border-blue-500 focus:outline-none dark:border-slate-750 dark:bg-slate-900"
                    />
                  </div>
                </div>

                <div className="pt-4 flex justify-end">
                  <button
                    type="button"
                    onClick={handleNextStep}
                    className="px-6 py-3 bg-blue-600 text-white rounded-xl text-xs font-bold hover:bg-blue-700 shadow-sm flex items-center"
                  >
                    <span>Configure Dimensions</span>
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </button>
                </div>
              </div>
            )}

            {/* Step 2: Dimensions & Options */}
            {step === 2 && (
              <form onSubmit={handleSubmit} className="space-y-6">
                
                {/* Product Type selection */}
                <div>
                  <span className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">{t('calculator.productType')}</span>
                  <div className="grid grid-cols-2 gap-4">
                    <button
                      type="button"
                      onClick={() => handleProductTypeChange('WINDOW')}
                      className={`py-3 rounded-xl border text-sm font-bold transition-all ${
                        productType === 'WINDOW'
                          ? 'border-blue-600 bg-blue-50/20 text-blue-600 dark:border-blue-500 dark:bg-blue-950/10 dark:text-blue-400'
                          : 'border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-750'
                      }`}
                    >
                      {t('calculator.window')}
                    </button>
                    <button
                      type="button"
                      onClick={() => handleProductTypeChange('DOOR')}
                      className={`py-3 rounded-xl border text-sm font-bold transition-all ${
                        productType === 'DOOR'
                          ? 'border-blue-600 bg-blue-50/20 text-blue-600 dark:border-blue-500 dark:bg-blue-950/10 dark:text-blue-400'
                          : 'border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-750'
                      }`}
                    >
                      {t('calculator.door')}
                    </button>
                  </div>
                </div>

                {/* Style and dimensions */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  
                  {/* Style */}
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                      {t('calculator.productStyle')}
                    </label>
                    <select
                      value={productStyle}
                      onChange={(e) => setProductStyle(e.target.value)}
                      className="w-full rounded-xl border border-slate-300 px-4 py-2.5 text-sm dark:border-slate-750 dark:bg-slate-900"
                    >
                      {productType === 'WINDOW' ? (
                        <>
                          <option value="Sliding">{t('products.slidingWindows')}</option>
                          <option value="Casement">{t('products.casementWindows')}</option>
                          <option value="Fixed">{t('products.fixedWindows')}</option>
                          <option value="Tilt & Turn">{t('products.tiltTurnWindows')}</option>
                          <option value="Bay">{t('products.bayWindows')}</option>
                        </>
                      ) : (
                        <>
                          <option value="Sliding">{t('products.slidingDoors')}</option>
                          <option value="French">{t('products.frenchDoors')}</option>
                          <option value="Casement">{t('products.casementDoors')}</option>
                          <option value="Balcony">{t('products.balconyDoors')}</option>
                          <option value="Entrance">{t('products.entranceDoors')}</option>
                        </>
                      )}
                    </select>
                  </div>

                  {/* Quantity */}
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                      {t('calculator.quantity')}
                    </label>
                    <input
                      type="number"
                      required
                      min={1}
                      value={quantity}
                      onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                      className="w-full rounded-xl border border-slate-300 px-4 py-2.5 text-sm dark:border-slate-750 dark:bg-slate-900"
                    />
                  </div>

                </div>

                {/* Dimensions inputs */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-slate-50 dark:bg-slate-900/50 p-4 rounded-2xl border border-slate-150 dark:border-slate-800">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                      {t('calculator.width')} (min: 400, max: 4500)
                    </label>
                    <div className="flex items-center space-x-2">
                      <input
                        type="range"
                        min={400}
                        max={4500}
                        value={width}
                        onChange={(e) => setWidth(parseInt(e.target.value))}
                        className="flex-grow accent-blue-600"
                      />
                      <input
                        type="number"
                        min={400}
                        max={4500}
                        value={width}
                        onChange={(e) => setWidth(Math.max(400, Math.min(4500, parseInt(e.target.value) || 400)))}
                        className="w-20 rounded-lg border border-slate-300 px-2 py-1 text-xs text-center dark:border-slate-700 dark:bg-slate-850"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                      {t('calculator.height')} (min: 400, max: 2400)
                    </label>
                    <div className="flex items-center space-x-2">
                      <input
                        type="range"
                        min={400}
                        max={2400}
                        value={height}
                        onChange={(e) => setHeight(parseInt(e.target.value))}
                        className="flex-grow accent-blue-600"
                      />
                      <input
                        type="number"
                        min={400}
                        max={2400}
                        value={height}
                        onChange={(e) => setHeight(Math.max(400, Math.min(2400, parseInt(e.target.value) || 400)))}
                        className="w-20 rounded-lg border border-slate-300 px-2 py-1 text-xs text-center dark:border-slate-700 dark:bg-slate-850"
                      />
                    </div>
                  </div>
                </div>

                {/* Additional custom options */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  
                  {/* Glass */}
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                      {t('calculator.glassType')}
                    </label>
                    <select
                      value={glassType}
                      onChange={(e) => setGlassType(e.target.value)}
                      className="w-full rounded-xl border border-slate-300 px-3 py-2.5 text-xs dark:border-slate-750 dark:bg-slate-900"
                    >
                      <option value="Clear Glass">{t('calculator.glassClear')}</option>
                      <option value="Toughened Glass">{t('calculator.glassToughened')}</option>
                      <option value="Double Glazed Glass">{t('calculator.glassDouble')}</option>
                    </select>
                  </div>

                  {/* Color */}
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                      {t('calculator.frameColor')}
                    </label>
                    <select
                      value={frameColor}
                      onChange={(e) => setFrameColor(e.target.value)}
                      className="w-full rounded-xl border border-slate-300 px-3 py-2.5 text-xs dark:border-slate-750 dark:bg-slate-900"
                    >
                      <option value="White">{t('calculator.colorWhite')}</option>
                      <option value="Black">{t('calculator.colorBlack')}</option>
                      <option value="Brown">{t('calculator.colorBrown')}</option>
                      <option value="Custom Laminated">{t('calculator.colorCustom')}</option>
                    </select>
                  </div>

                  {/* Hardware */}
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                      {t('calculator.hardware')}
                    </label>
                    <select
                      value={hardwareQuality}
                      onChange={(e) => setHardwareQuality(e.target.value)}
                      className="w-full rounded-xl border border-slate-300 px-3 py-2.5 text-xs dark:border-slate-750 dark:bg-slate-900"
                    >
                      <option value="Standard Quality">{t('calculator.hwStandard')}</option>
                      <option value="Premium Quality (Imported)">{t('calculator.hwPremium')}</option>
                    </select>
                  </div>

                </div>

                {/* Back / Submit buttons */}
                <div className="pt-4 flex justify-between gap-4">
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="px-6 py-3 border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-350 rounded-xl text-xs font-bold hover:bg-slate-100 dark:hover:bg-slate-750 flex items-center transition-colors"
                  >
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    <span>Back</span>
                  </button>
                  <button
                    type="submit"
                    disabled={submittingLead}
                    className="flex-grow py-3 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-xl text-sm shadow-md flex items-center justify-center transition-colors disabled:bg-slate-400"
                  >
                    {submittingLead ? t('common.loading') : t('calculator.submitInquiry')}
                  </button>
                </div>

              </form>
            )}

          </div>

          {/* Pricing Estimation Sidebar */}
          <div className="bg-slate-900 text-white rounded-3xl p-6 md:p-8 border border-slate-800 shadow-md space-y-6 flex flex-col justify-between">
            <div className="space-y-4">
              <h3 className="text-xl font-bold flex items-center">
                <Sparkles className="h-5 w-5 text-amber-500 mr-2" />
                {t('calculator.estimateSummary')}
              </h3>
              
              <div className="space-y-3 pt-4 border-t border-slate-800 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-400">{t('calculator.costProduct')}</span>
                  <span>₹{productCost.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">{t('calculator.costInstall')}</span>
                  <span>₹{installationCost.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">{t('calculator.costGst')}</span>
                  <span>₹{gstAmount.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between pt-3 border-t border-slate-800 text-base font-bold text-white">
                  <span>{t('calculator.costTotal')}</span>
                  <span className="text-amber-500">₹{totalCost.toLocaleString('en-IN')}</span>
                </div>
              </div>
            </div>

            <div className="space-y-3 pt-6">
              <div className="flex items-start p-3 bg-slate-800/60 rounded-xl border border-slate-700/60 text-[10px] text-slate-400">
                <AlertCircle className="h-4 w-4 text-amber-500 mr-2 shrink-0 mt-0.5" />
                <p>{t('calculator.disclaimer')}</p>
              </div>
            </div>

          </div>

        </div>
      )}

    </div>
  );
}

export default function Quote() {
  return (
    <Suspense fallback={
      <div className="text-center py-20">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-amber-600 mx-auto" />
        <p className="mt-4 text-sm text-slate-500">Initializing pricing engine...</p>
      </div>
    }>
      <QuoteFormContent />
    </Suspense>
  );
}
