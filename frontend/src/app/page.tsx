'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  ShieldCheck,
  Wrench,
  CloudSun,
  VolumeX,
  Coins,
  Flame,
  ArrowRight,
  Phone,
  MessageSquare,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { useLanguage } from '../components/LanguageContext';
import BeforeAfterSlider from '../components/BeforeAfterSlider';
import TestimonialsCarousel from '../components/TestimonialsCarousel';

// FAQ Accordion component
function FaqItem({ question, answer }: { question: string; answer: string }) {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="border-b border-slate-200 py-4 dark:border-slate-800">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex w-full items-center justify-between text-left focus:outline-none"
      >
        <span className="text-base font-bold text-slate-800 dark:text-slate-200">{question}</span>
        {isOpen ? <ChevronUp className="h-5 w-5 text-amber-500" /> : <ChevronDown className="h-5 w-5 text-amber-500" />}
      </button>
      {isOpen && (
        <p className="mt-2 text-sm text-slate-600 dark:text-slate-400 leading-relaxed animate-in fade-in duration-300">
          {answer}
        </p>
      )}
    </div>
  );
}

export default function Home() {
  const { t } = useLanguage();

  const features = [
    {
      icon: <ShieldCheck className="h-6 w-6 text-blue-600 dark:text-blue-400" />,
      title: t('whyUs.materialsTitle'),
      desc: t('whyUs.materialsDesc')
    },
    {
      icon: <Wrench className="h-6 w-6 text-blue-600 dark:text-blue-400" />,
      title: t('whyUs.installationTitle'),
      desc: t('whyUs.installationDesc')
    },
    {
      icon: <CloudSun className="h-6 w-6 text-blue-600 dark:text-blue-400" />,
      title: t('whyUs.weatherTitle'),
      desc: t('whyUs.weatherDesc')
    },
    {
      icon: <VolumeX className="h-6 w-6 text-blue-600 dark:text-blue-400" />,
      title: t('whyUs.soundTitle'),
      desc: t('whyUs.soundDesc')
    },
    {
      icon: <Flame className="h-6 w-6 text-blue-600 dark:text-blue-400" />,
      title: t('whyUs.energyTitle'),
      desc: t('whyUs.energyDesc')
    },
    {
      icon: <Coins className="h-6 w-6 text-blue-600 dark:text-blue-400" />,
      title: t('whyUs.pricingTitle'),
      desc: t('whyUs.pricingDesc')
    }
  ];

  const featuredProducts = [
    {
      title: t('products.slidingWindows'),
      desc: t('products.slidingWindowsDesc'),
      image: '/images/after-window.png',
      category: 'Window'
    },
    {
      title: t('products.casementWindows'),
      desc: t('products.casementWindowsDesc'),
      image: '/images/hero.png', // Fallback to hero
      category: 'Window'
    },
    {
      title: t('products.slidingDoors'),
      desc: t('products.slidingDoorsDesc'),
      image: '/images/hero.png',
      category: 'Door'
    },
    {
      title: t('products.frenchDoors'),
      desc: t('products.frenchDoorsDesc'),
      image: '/images/hero.png',
      category: 'Door'
    }
  ];

  return (
    <div className="space-y-16">

      {/* 1. HERO SECTION */}
      <section className="relative min-h-[85vh] flex items-center justify-center bg-slate-950 text-white overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0 z-0 opacity-40">
          <Image
            src="/images/hero.png"
            alt="uPVC installation hero banner"
            fill
            className="object-cover"
            priority
          />
        </div>

        {/* Backdrop Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/60 to-slate-950/40 z-0" />

        {/* Content */}
        <div className="relative z-10 mx-auto max-w-5xl px-4 py-20 text-center space-y-6">
          <span className="inline-flex items-center rounded-full bg-blue-500/10 px-3 py-1 text-xs font-bold text-blue-400 ring-1 ring-inset ring-blue-400/20">
            German Engineered Profiles
          </span>
          <h1 className="text-4xl font-extrabold tracking-tight sm:text-6xl text-white">
            {t('hero.title')}
          </h1>
          <p className="mx-auto max-w-2xl text-lg text-slate-300 font-semibold sm:text-xl">
            {t('hero.subtitle')}
          </p>

          <div className="flex flex-col sm:flex-row justify-center items-center gap-4 pt-6 max-w-lg mx-auto">
            <Link
              href="/quote"
              className="w-full sm:w-auto inline-flex items-center justify-center rounded-xl bg-amber-600 px-6 py-4 text-base font-extrabold text-white shadow-lg transition-all duration-200 hover:bg-amber-700 hover:scale-102 focus:outline-none"
            >
              {t('hero.ctaQuote')}
              <ArrowRight className="h-5 w-5 ml-2" />
            </Link>

            <a
              href="tel:+91 9445477574"
              className="w-full sm:w-auto inline-flex items-center justify-center rounded-xl bg-slate-800 px-6 py-4 text-base font-bold text-white shadow-md transition-all duration-200 hover:bg-slate-700 hover:scale-102 border border-slate-700"
            >
              <Phone className="h-5 w-5 mr-2 text-blue-400" />
              {t('hero.ctaCall')}
            </a>

            <a
              href="https://wa.me/919445477574"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto inline-flex items-center justify-center rounded-xl bg-green-600 px-6 py-4 text-base font-bold text-white shadow-md transition-all duration-200 hover:bg-green-700 hover:scale-102"
            >
              <MessageSquare className="h-5 w-5 mr-2" />
              WhatsApp
            </a>
          </div>
        </div>
      </section>

      {/* 2. WHY CHOOSE US */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-3">
          <span className="text-xs font-bold uppercase tracking-widest text-blue-600 dark:text-blue-400">Features</span>
          <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white sm:text-4xl">
            {t('whyUs.title')}
          </h2>
          <p className="mx-auto max-w-2xl text-slate-500 dark:text-slate-400">
            {t('whyUs.subtitle')}
          </p>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, i) => (
            <div
              key={i}
              className="relative flex flex-col p-6 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm transition-all duration-300 hover:shadow-md hover:-translate-y-1 hover:border-blue-500/30"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 dark:bg-blue-950/40 mb-4">
                {feature.icon}
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">{feature.title}</h3>
              <p className="mt-2 text-sm text-slate-500 dark:text-slate-400 leading-relaxed flex-grow">
                {feature.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* 3. FEATURED PRODUCTS */}
      <section className="bg-slate-100 py-16 dark:bg-slate-900/30 border-y border-slate-200/50 dark:border-slate-800/30">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-3">
            <span className="text-xs font-bold uppercase tracking-widest text-amber-600 dark:text-amber-500">Portfolio</span>
            <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white sm:text-4xl">
              {t('products.title')}
            </h2>
            <p className="mx-auto max-w-2xl text-slate-500 dark:text-slate-400">
              {t('products.subtitle')}
            </p>
          </div>

          <div className="mt-12 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {featuredProducts.map((prod, i) => (
              <div key={i} className="group overflow-hidden rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm transition-all duration-300 hover:shadow-lg">
                <div className="relative h-48 w-full overflow-hidden bg-slate-200">
                  <Image
                    src={prod.image}
                    alt={prod.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    sizes="(max-width: 768px) 100vw, 250px"
                  />
                </div>
                <div className="p-5 flex flex-col h-48 justify-between">
                  <div>
                    <span className="text-[10px] font-bold text-blue-600 dark:text-blue-400 uppercase tracking-widest">{prod.category}</span>
                    <h3 className="text-base font-bold text-slate-900 dark:text-white mt-1">{prod.title}</h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 line-clamp-3 leading-relaxed">
                      {prod.desc}
                    </p>
                  </div>
                  <div className="flex gap-2 pt-4">
                    <Link
                      href={`/products?category=${prod.category}`}
                      className="flex-1 text-center py-2 rounded-lg text-xs font-bold border border-slate-300 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
                    >
                      {t('products.viewDetails')}
                    </Link>
                    <Link
                      href="/quote"
                      className="flex-1 text-center py-2 rounded-lg text-xs font-bold bg-amber-600 text-white hover:bg-amber-700 transition-colors"
                    >
                      {t('products.getQuote')}
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. BEFORE AFTER WINDOWrenovation */}
      <BeforeAfterSlider />

      {/* 5. TESTIMONIALS CAROUSEL */}
      <TestimonialsCarousel />

      {/* 6. FAQ SECTION */}
      <section className="mx-auto max-w-4xl px-4 py-8">
        <div className="text-center space-y-2 mb-10">
          <span className="text-xs font-bold uppercase tracking-widest text-blue-600 dark:text-blue-400">Questions</span>
          <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white">
            Frequently Asked Questions
          </h2>
        </div>

        <div className="bg-white dark:bg-slate-800/40 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm divide-y divide-slate-100 dark:divide-slate-800">
          <FaqItem
            question="What are the benefits of uPVC over aluminum and wood?"
            answer="uPVC offers superior heat insulation (energy efficiency), high noise proofing, weatherproofing, and zero maintenance. Unlike wood, it doesn't rot, warp, or suffer termites. Unlike aluminum, it has low thermal conductivity (so rooms stay cooler) and does not corrode in high humidity or coastal areas."
          />
          <FaqItem
            question="Does uPVC block traffic and street noise?"
            answer="Yes. Our multi-chambered uPVC profiles coupled with double-glazed glass and custom EPDM rubber gaskets can reduce incoming sound by up to 30dB to 40dB, creating a quiet, peaceful indoor environment."
          />
          <FaqItem
            question="How long does the installation process take?"
            answer="For a typical residence (5 to 10 windows), the installation is completed within 1 to 2 days. The dismantling of old wood or metal frames is done carefully by our technicians to avoid any major damage to plastering or masonry."
          />
          <FaqItem
            question="Is there a warranty on uPVC doors and windows?"
            answer="Yes, we provide a 10-year warranty on uPVC profiles against discoloration, cracking, or warping, and a 2-year warranty on double-glazed glass units and premium hardware locking mechanisms."
          />
        </div>
      </section>

      {/* 7. NEED A QUOTE CTA */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mb-12">
        <div className="bg-gradient-to-r from-blue-900 to-slate-900 rounded-3xl p-8 md:p-12 text-center text-white border border-slate-800 shadow-xl relative overflow-hidden">
          <div className="absolute right-0 top-0 h-48 w-48 rounded-full bg-blue-500/10 blur-3xl" />
          <div className="absolute left-0 bottom-0 h-48 w-48 rounded-full bg-amber-500/10 blur-3xl" />

          <div className="relative z-10 max-w-2xl mx-auto space-y-4">
            <h2 className="text-3xl font-extrabold">Need a Premium uPVC Installation?</h2>
            <p className="text-slate-300 text-sm md:text-base leading-relaxed">
              Contact our product experts today for free consult, site measurements, and quotation calculations.
            </p>
            <div className="flex flex-wrap justify-center gap-4 pt-4">
              <Link
                href="/quote"
                className="rounded-xl bg-amber-600 px-6 py-3 font-bold hover:bg-amber-700 shadow-md transition-colors"
              >
                {t('calculator.submitInquiry')}
              </Link>
              <a
                href="tel:+919445477574"
                className="rounded-xl bg-slate-800 border border-slate-700 px-6 py-3 font-bold hover:bg-slate-700 transition-colors flex items-center"
              >
                <Phone className="h-5 w-5 mr-2" />
                +91 9445477574
              </a>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
