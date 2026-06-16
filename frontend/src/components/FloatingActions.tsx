'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowUp, Phone, MessageSquare, Calculator } from 'lucide-react';
import { useLanguage } from './LanguageContext';

export default function FloatingActions() {
  const { t } = useLanguage();
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 300);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const whatsappUrl = 'https://wa.me/919876543210?text=Hi!%20I%20am%20interested%20in%20getting%20a%20quote%20for%20uPVC%20Doors%20and%20Windows.';

  return (
    <>
      {/* 1. Floating WhatsApp Button & Back to Top (Desktop and Tablet) */}
      <div className="fixed bottom-20 right-6 z-30 flex flex-col items-center space-y-3 md:bottom-6">
        {/* Back To Top */}
        {showScrollTop && (
          <button
            onClick={scrollToTop}
            className="flex h-11 w-11 items-center justify-center rounded-full bg-slate-900 text-white shadow-lg border border-slate-700 hover:bg-slate-800 transition-all duration-300 transform hover:-translate-y-1 dark:bg-slate-800 dark:hover:bg-slate-700"
            title={t('common.backToTop')}
          >
            <ArrowUp className="h-5 w-5" />
          </button>
        )}

        {/* WhatsApp Icon */}
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex h-12 w-12 items-center justify-center rounded-full bg-green-500 text-white shadow-xl hover:bg-green-600 transition-all duration-300 transform hover:scale-110"
          title="WhatsApp Us"
        >
          <svg
            className="h-6 w-6 fill-current"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.724-1.455L0 24zm6.59-4.846c1.6.95 3.488 1.459 5.407 1.461 5.432.001 9.853-4.417 9.856-9.853.002-2.634-1.024-5.11-2.885-6.971C17.165 1.93 14.685.908 12.052.908 6.623.908 2.202 5.326 2.2 10.762c-.001 1.815.474 3.591 1.38 5.168L2.57 21.611l5.867-1.537z" />
            <path d="M17.472 14.382c-.301-.15-1.78-.879-2.057-.981-.277-.101-.478-.15-.68.151-.2.302-.779.982-.955 1.185-.177.202-.353.226-.654.076-.301-.15-1.272-.469-2.419-1.494-.89-.795-1.49-1.778-1.666-2.079-.177-.302-.018-.465.132-.615.136-.135.301-.35.452-.526.15-.177.2-.302.301-.503.101-.2.05-.378-.026-.53-.076-.15-.68-1.637-.932-2.247-.246-.59-.496-.51-.68-.52-.176-.009-.377-.01-.58-.01-.2 0-.526.075-.801.378-.276.301-1.055 1.031-1.055 2.516 0 1.485 1.08 2.92 1.23 3.122.15.202 2.122 3.24 5.141 4.542.717.31 1.278.495 1.714.634.721.23 1.377.198 1.897.12.58-.088 1.78-.728 2.03-1.43.25-.702.25-1.303.175-1.43-.075-.127-.275-.203-.576-.353z" />
          </svg>
        </a>
      </div>

      {/* 2. Sticky Mobile Action Bar (Visible only on Mobile screens) */}
      <div className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 border-t border-slate-200 shadow-[0_-4px_10px_rgba(0,0,0,0.05)] md:hidden dark:bg-slate-900/95 dark:border-slate-800 backdrop-blur-md">
        <div className="flex w-full items-center justify-around p-2.5">
          {/* Quick Call */}
          <a
            href="tel:+919876543210"
            className="flex flex-col items-center justify-center flex-1 py-1 text-slate-700 dark:text-slate-200 active:scale-95 transition-transform"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 text-blue-600 dark:bg-slate-800 dark:text-blue-400">
              <Phone className="h-5 w-5" />
            </div>
            <span className="text-[10px] font-bold mt-1 uppercase tracking-wider">{t('hero.ctaCall')}</span>
          </a>

          {/* Smart Quote (Center Accent Button) */}
          <Link
            href="/quote"
            className="flex flex-col items-center justify-center flex-1 py-1 text-slate-700 dark:text-slate-200 active:scale-95 transition-transform"
          >
            <div className="flex h-11 w-11 -mt-4 items-center justify-center rounded-full bg-amber-600 text-white shadow-lg ring-4 ring-white dark:ring-slate-900">
              <Calculator className="h-6 w-6" />
            </div>
            <span className="text-[10px] font-extrabold mt-1 text-amber-600 dark:text-amber-400 uppercase tracking-wider">
              {t('nav.quote')}
            </span>
          </Link>

          {/* Quick WhatsApp */}
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-col items-center justify-center flex-1 py-1 text-slate-700 dark:text-slate-200 active:scale-95 transition-transform"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-500 text-white">
              <MessageSquare className="h-5 w-5" />
            </div>
            <span className="text-[10px] font-bold mt-1 uppercase tracking-wider">WhatsApp</span>
          </a>
        </div>
      </div>
    </>
  );
}
