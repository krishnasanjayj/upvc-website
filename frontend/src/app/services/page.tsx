'use client';

import React from 'react';
import { 
  Building2, 
  Settings, 
  CheckSquare, 
  FileCheck, 
  HardHat, 
  Activity,
  MessageCircle,
  Eye,
  Sliders,
  Sparkles,
  FileSpreadsheet,
  Hammer
} from 'lucide-react';
import { useLanguage } from '../../components/LanguageContext';

export default function Services() {
  const { t } = useLanguage();

  const services = [
    {
      icon: <Building2 className="h-6 w-6 text-blue-600 dark:text-blue-400" />,
      title: t('services.mfgTitle'),
      desc: t('services.mfgDesc'),
      bullets: ['CNC precision corner welding', 'Heavy galvanized steel reinforcement insert', 'Multi-point lock hardware mounting', 'Strict air permeability and water leak tests']
    },
    {
      icon: <HardHat className="h-6 w-6 text-blue-600 dark:text-blue-400" />,
      title: t('services.instTitle'),
      desc: t('services.instTitle'),
      bullets: ['Millimeter-accurate wall anchor positioning', 'High density PU expand foam insulation filling', 'Heavy-duty weather sealant finishing', 'Complete trim and sash tuning']
    },
    {
      icon: <Eye className="h-6 w-6 text-blue-600 dark:text-blue-400" />,
      title: t('services.measTitle'),
      desc: t('services.measDesc'),
      bullets: ['Free diagnostic site visit', 'Precision digital laser measurement', 'Opening check for squareness and level', 'Customized style recommendation']
    },
    {
      icon: <Settings className="h-6 w-6 text-blue-600 dark:text-blue-400" />,
      title: t('services.repairTitle'),
      desc: t('services.repairDesc'),
      bullets: ['Sliding rollers replacement', 'EPDM rubber gasket refitting', 'Damaged locking handle repair', 'Soundproof tuning adjustments']
    },
    {
      icon: <Hammer className="h-6 w-6 text-blue-600 dark:text-blue-400" />,
      title: t('services.replTitle'),
      desc: t('services.replDesc'),
      bullets: ['Careful wood/aluminum frame dismantling', 'Zero masonry damage guarantee', 'Fast clean-up and disposal', 'Same-day new window fitting']
    },
    {
      icon: <Building2 className="h-6 w-6 text-blue-600 dark:text-blue-400" />,
      title: t('services.commTitle'),
      desc: t('services.commDesc'),
      bullets: ['High-wind load structural glass panels', 'Bulk institutional quantity pricing', 'Specialized safety glass variants', 'Dedicated site project manager']
    }
  ];

  const workflowSteps = [
    {
      num: '01',
      title: t('process.step1'),
      desc: t('process.step1Desc'),
      icon: <MessageCircle className="h-5 w-5 text-white" />
    },
    {
      num: '02',
      title: t('process.step2'),
      desc: t('process.step2Desc'),
      icon: <HardHat className="h-5 w-5 text-white" />
    },
    {
      num: '03',
      title: t('process.step3'),
      desc: t('process.step3Desc'),
      icon: <Sliders className="h-5 w-5 text-white" />
    },
    {
      num: '04',
      title: t('process.step4'),
      desc: t('process.step4Desc'),
      icon: <FileSpreadsheet className="h-5 w-5 text-white" />
    },
    {
      num: '05',
      title: t('process.step5'),
      desc: t('process.step5Desc'),
      icon: <Activity className="h-5 w-5 text-white" />
    },
    {
      num: '06',
      title: t('process.step6'),
      desc: t('process.step6Desc'),
      icon: <Sparkles className="h-5 w-5 text-white" />
    }
  ];

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-16">
      
      {/* Page Header */}
      <div className="text-center space-y-2">
        <span className="text-xs font-bold uppercase tracking-widest text-blue-600 dark:text-blue-400">Services</span>
        <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white sm:text-4xl">
          What We Do
        </h1>
        <p className="mx-auto max-w-2xl text-sm text-slate-500 dark:text-slate-400">
          From precise laser measurements to automated factory fabrication and clean dust-free on-site installations.
        </p>
      </div>

      {/* Services Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {services.map((svc, idx) => (
          <div 
            key={idx} 
            className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-6 rounded-2xl shadow-sm hover:shadow-md hover:border-blue-500/20 transition-all duration-200"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 dark:bg-blue-950/40 mb-4">
              {svc.icon}
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">{svc.title}</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-2 leading-relaxed">
              {svc.desc}
            </p>
            <ul className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-700/60 space-y-2 text-xs text-slate-600 dark:text-slate-350">
              {svc.bullets.map((bullet, bidx) => (
                <li key={bidx} className="flex items-start">
                  <span className="text-blue-500 mr-2 shrink-0">•</span>
                  <span>{bullet}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* Workflow Process Section */}
      <section className="bg-slate-100 dark:bg-slate-800/40 rounded-3xl p-8 border border-slate-200 dark:border-slate-800">
        <div className="text-center space-y-2 mb-12">
          <span className="text-xs font-bold uppercase tracking-widest text-amber-600 dark:text-amber-500">Timeline</span>
          <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white sm:text-3xl">
            {t('process.title')}
          </h2>
        </div>

        {/* Workflow Timeline Steps Layout */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-6 relative">
          {workflowSteps.map((step, idx) => (
            <div key={idx} className="relative flex flex-col items-center text-center p-4 bg-white dark:bg-slate-800 rounded-2xl shadow-xs border border-slate-200 dark:border-slate-700 hover:-translate-y-1 transition-transform">
              
              {/* Number Circle Icon */}
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-600 shadow-md">
                {step.icon}
              </div>

              <span className="text-[10px] font-extrabold text-blue-600 dark:text-blue-400 mt-3 uppercase tracking-wider">
                Step {step.num}
              </span>
              
              <h3 className="text-sm font-bold text-slate-900 dark:text-white mt-1">
                {step.title}
              </h3>
              
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 leading-relaxed">
                {step.desc}
              </p>

            </div>
          ))}
        </div>
      </section>

    </div>
  );
}
