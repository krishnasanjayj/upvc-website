'use client';

import React, { useState, useEffect } from 'react';
import { X, Gift } from 'lucide-react';
import { useLanguage } from './LanguageContext';
import { ApiService } from '../utils/api';

export default function ExitIntentPopup() {
  const { t } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Check if user already saw this popup in current session
    const hasSeen = sessionStorage.getItem('upvc_saw_exit_popup');
    if (hasSeen) return;

    // 1. Mouse Out trigger for Desktop
    const handleMouseLeave = (e: MouseEvent) => {
      if (e.clientY < 20) {
        triggerPopup();
      }
    };

    // 2. Timeout trigger for Mobile/Tablet (45 seconds)
    const mobileTimer = setTimeout(() => {
      triggerPopup();
    }, 45000);

    document.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      document.removeEventListener('mouseleave', handleMouseLeave);
      clearTimeout(mobileTimer);
    };
  }, []);

  const triggerPopup = () => {
    const hasSeen = sessionStorage.getItem('upvc_saw_exit_popup');
    if (!hasSeen) {
      setIsOpen(true);
      sessionStorage.setItem('upvc_saw_exit_popup', 'true');
    }
  };

  const handleClose = () => {
    setIsOpen(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !phone || !email) return;

    setLoading(true);
    try {
      await ApiService.submitInquiry({
        name,
        email,
        phone,
        message: 'CLAIMED 10% DISCOUNT - Lead submitted via exit intent coupon popup.'
      });
      setIsSubmitted(true);
    } catch (err) {
      console.error('Failed to submit coupon lead:', err);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm transition-all duration-300">
      <div className="relative w-full max-w-md overflow-hidden rounded-2xl bg-white text-slate-800 shadow-2xl dark:bg-slate-900 dark:text-slate-100 border border-slate-200 dark:border-slate-800 animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header Ribbon */}
        <div className="bg-gradient-to-r from-blue-600 to-amber-600 p-4 text-white text-center flex flex-col items-center">
          <Gift className="h-10 w-10 text-white animate-bounce mb-1" />
          <h3 className="text-xl font-bold">{t('common.exitTitle')}</h3>
        </div>

        {/* Close Button */}
        <button
          onClick={handleClose}
          className="absolute right-3 top-3 rounded-full bg-black/20 p-1 text-white hover:bg-black/30 focus:outline-none"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Form Body */}
        <div className="p-6">
          {!isSubmitted ? (
            <form onSubmit={handleSubmit} className="space-y-4">
              <p className="text-sm text-slate-600 dark:text-slate-300 text-center">
                {t('common.exitDesc')}
              </p>
              
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider mb-1">
                  {t('contact.name')}
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800"
                  placeholder="John Doe"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider mb-1">
                  {t('contact.phone')}
                </label>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800"
                  placeholder="+91 98765 43210"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider mb-1">
                  {t('contact.email')}
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800"
                  placeholder="john@example.com"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-lg bg-amber-600 py-3 text-sm font-bold text-white shadow-md transition-all duration-200 hover:bg-amber-700 active:scale-98 disabled:bg-slate-400"
              >
                {loading ? t('common.loading') : t('common.exitSubmit')}
              </button>
            </form>
          ) : (
            <div className="text-center py-6 space-y-3">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-100 text-green-600 dark:bg-green-950/20">
                ✓
              </div>
              <h4 className="text-lg font-bold text-green-600 dark:text-green-400">Coupon Claimed!</h4>
              <p className="text-sm text-slate-600 dark:text-slate-300">
                A 10% discount has been locked to your phone number. Our site measurement representative will apply this coupon to your final invoice.
              </p>
              <button
                onClick={handleClose}
                className="mt-4 rounded-lg border border-slate-300 px-5 py-2 text-xs font-bold hover:bg-slate-100 dark:border-slate-700 dark:hover:bg-slate-800"
              >
                Close
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
