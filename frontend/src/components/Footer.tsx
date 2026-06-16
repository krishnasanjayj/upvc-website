'use client';

import React from 'react';
import Link from 'next/link';
import { Phone, Mail, MapPin, Clock } from 'lucide-react';
import { useLanguage } from './LanguageContext';

export default function Footer() {
  const { t } = useLanguage();

  return (
    <footer className="bg-slate-900 text-slate-300 dark:bg-slate-950">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">

          {/* Company Brief */}
          <div className="space-y-4">
            <Link href="/" className="flex items-center space-x-2">
              <div className="flex h-8 w-8 items-center justify-center rounded bg-blue-600 text-white font-bold text-base">
                uP
              </div>
              <span className="font-bold text-lg text-white tracking-tight">
                Shasti Doors and Windows
              </span>
            </Link>
            <p className="text-sm text-slate-400">
              {t('whyUs.subtitle')} Manufacturing premium quality, German-engineered uPVC doors and windows for residential & commercial builds since 2012.
            </p>
          </div>

          {/* Quick Links / Products */}
          <div>
            <h3 className="text-white font-bold text-base mb-4">{t('nav.products')}</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/products?category=Window" className="hover:text-amber-500 transition-colors">
                  {t('products.slidingWindows')}
                </Link>
              </li>
              <li>
                <Link href="/products?category=Window" className="hover:text-amber-500 transition-colors">
                  {t('products.casementWindows')}
                </Link>
              </li>
              <li>
                <Link href="/products?category=Door" className="hover:text-amber-500 transition-colors">
                  {t('products.slidingDoors')}
                </Link>
              </li>
              <li>
                <Link href="/products?category=Door" className="hover:text-amber-500 transition-colors">
                  {t('products.frenchDoors')}
                </Link>
              </li>
            </ul>
          </div>

          {/* Services Quick Directory */}
          <div>
            <h3 className="text-white font-bold text-base mb-4">{t('nav.services')}</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/services" className="hover:text-amber-500 transition-colors">
                  {t('services.mfgTitle')}
                </Link>
              </li>
              <li>
                <Link href="/services" className="hover:text-amber-500 transition-colors">
                  {t('services.instTitle')}
                </Link>
              </li>
              <li>
                <Link href="/services" className="hover:text-amber-500 transition-colors">
                  {t('services.measTitle')}
                </Link>
              </li>
              <li>
                <Link href="/services" className="hover:text-amber-500 transition-colors">
                  {t('services.repairTitle')}
                </Link>
              </li>
            </ul>
          </div>

          {/* Contacts Information */}
          <div className="space-y-3">
            <h3 className="text-white font-bold text-base mb-3">{t('contact.infoTitle')}</h3>
            <ul className="space-y-3 text-sm text-slate-400">
              <li className="flex items-start">
                <MapPin className="h-5 w-5 text-amber-500 mr-2 shrink-0 mt-0.5" />
                <span>Tirupur Main Road,Avinashi,Tamil Nadu 641654</span>
              </li>
              <li className="flex items-center">
                <Phone className="h-5 w-5 text-amber-500 mr-2 shrink-0" />
                <a href="tel:+919876543210" className="hover:text-white transition-colors">
                  +91 94454 77574
                </a>
              </li>
              <li className="flex items-center">
                <Mail className="h-5 w-5 text-amber-500 mr-2 shrink-0" />
                <a href="mailto:cndoorsandwindows@gmail.com" className="hover:text-white transition-colors">
                  cndoorsandwindows@gmail.com
                </a>
              </li>
              <li className="flex items-start">
                <Clock className="h-5 w-5 text-amber-500 mr-2 shrink-0 mt-0.5" />
                <div>
                  <span className="block text-xs text-slate-300 font-semibold">{t('contact.hoursTitle')}</span>
                  <span className="block text-xs">{t('contact.hoursWeekdays')}</span>
                </div>
              </li>
            </ul>
          </div>

        </div>

        <div className="mt-12 pt-8 border-t border-slate-800 text-xs text-slate-500 flex flex-col md:flex-row justify-between items-center gap-4">
          <p>© {new Date().getFullYear()} Shasti Doors and Windows. All rights reserved.</p>
          <div className="flex space-x-4">
            <Link href="/contact" className="hover:underline hover:text-slate-400">{t('nav.contact')}</Link>
            <Link href="/admin" className="hover:underline hover:text-slate-400">{t('nav.admin')}</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
