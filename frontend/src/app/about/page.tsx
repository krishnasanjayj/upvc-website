'use client';

import React from 'react';
import { Target, Eye, ShieldCheck,Award, Users2, Calendar } from 'lucide-react';
import { useLanguage } from '../../components/LanguageContext';

export default function About() {
  const { t } = useLanguage();

  const values = [
    {
      icon: <Award className="h-6 w-6 text-amber-500" />,
      title: 'Precision Engineering',
      desc: 'All window profiles are manufactured using automated double-head CNC welding machines to ensure exact alignments down to the millimeter.'
    },
    {
      icon: <ShieldCheck className="h-6 w-6 text-blue-500" />,
      title: 'German Quality Standards',
      desc: 'Partnered with international lead-free uPVC profile providers to formulate weather-resistant material blends tailored for the South Asian climate.'
    },
    {
      icon: <Users2 className="h-6 w-6 text-green-500" />,
      title: 'Customer-First Fitting',
      desc: 'Certified in-house installation crew. We do not outsource to raw third-party contractors, guaranteeing high fidelity workmanship.'
    }
  ];

  const milestones = [
    { year: '2012', title: 'Company Foundation', desc: 'Started with a single fabrication assembly line in Chennai.' },
    { year: '2016', title: 'Lamination Facility Expansion', desc: 'Introduced premium woodgrain hot-melt foil lamination lines.' },
    { year: '2020', title: 'ISO 9001 & Weather Testing', desc: 'Achieved ISO certification and storm-cyclone wind load safety clearances.' },
    { year: '2025', title: 'Next-Gen CNC Automation', desc: 'Transitioned to fully automated cutting and corner-cleaning factories.' }
  ];

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-16">
      
      {/* Header */}
      <div className="text-center space-y-2">
        <span className="text-xs font-bold uppercase tracking-widest text-blue-600 dark:text-blue-400">About Us</span>
        <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white sm:text-4xl">
          Our Company Profile
        </h1>
        <p className="mx-auto max-w-2xl text-sm text-slate-500 dark:text-slate-400">
          Over 14 years of engineering, custom manufacturing, and installing high-performance uPVC door and window systems.
        </p>
      </div>

      {/* Grid: Story + Vision & Mission */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Our Story</h2>
          <p className="text-sm text-slate-650 dark:text-slate-350 leading-relaxed">
            Shasti Doors and Windows was founded with a singular vision: to replace noisy, drafty, and high-maintenance wood and metal window frames with modern, energy-efficient uPVC systems. Since our inception, we have installed over 50,000 windows and doors across residences, offices, and commercial establishments in Tamil Nadu.
          </p>
          <p className="text-sm text-slate-650 dark:text-slate-350 leading-relaxed">
            We operate out of our modern 15,000 sq.ft. automated factory in Ambattur, Chennai. By sourcing lead-free uPVC raw profiles and integrating premium steel reinforcements, we ensure every product represents the peak of structural durability.
          </p>
        </div>

        <div className="space-y-6 bg-slate-100 dark:bg-slate-800/40 p-8 rounded-3xl border border-slate-200 dark:border-slate-800">
          {/* Mission */}
          <div className="flex gap-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-blue-600 text-white shadow-sm">
              <Target className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 dark:text-white text-base">Our Mission</h3>
              <p className="text-xs text-slate-500 dark:text-slate-450 mt-1 leading-relaxed">
                To fabricate and install the highest quality, noise-proofing, and thermal-insulating uPVC products that enhance the comfort, beauty, and security of homes.
              </p>
            </div>
          </div>
          
          {/* Vision */}
          <div className="flex gap-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-amber-600 text-white shadow-sm">
              <Eye className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 dark:text-white text-base">Our Vision</h3>
              <p className="text-xs text-slate-500 dark:text-slate-450 mt-1 leading-relaxed">
                To be the most trusted and customer-focused manufacturer of eco-friendly building solutions in South India, setting benchmarks in technical precision.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Core Values */}
      <section className="space-y-8 pt-8">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white text-center">Our Core Values</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {values.map((v, i) => (
            <div key={i} className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-xs">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-slate-50 dark:bg-slate-900 mb-4 border border-slate-100 dark:border-slate-750">
                {v.icon}
              </div>
              <h3 className="font-bold text-slate-900 dark:text-white text-base">{v.title}</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 leading-relaxed">
                {v.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Corporate Timeline / Milestones */}
      <section className="space-y-8 pt-8">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white text-center">Company Milestones</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {milestones.map((m, i) => (
            <div key={i} className="p-5 bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 rounded-2xl relative">
              <span className="text-xl font-extrabold text-blue-600 dark:text-blue-400 flex items-center">
                <Calendar className="h-4 w-4 mr-1.5" />
                {m.year}
              </span>
              <h3 className="font-bold text-slate-900 dark:text-white text-sm mt-2">{m.title}</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                {m.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

    </div>
  );
}
