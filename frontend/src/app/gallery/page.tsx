'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { MapPin, Calendar, Layers } from 'lucide-react';
import { useLanguage } from '../../components/LanguageContext';

interface Project {
  id: number;
  title: string;
  location: string;
  category: 'Residential' | 'Commercial' | 'Apartments' | 'Villas';
  productUsed: string;
  date: string;
  image: string;
}

const projectsData: Project[] = [
  {
    id: 1,
    title: 'Seaside Luxury Villa',
    location: 'ECR, Chennai',
    category: 'Villas',
    productUsed: 'Double-glazed French doors & Sliding windows',
    date: 'March 2026',
    image: '/images/hero.png'
  },
  {
    id: 2,
    title: 'Vanguard Tech Park',
    location: 'OMR, Chennai',
    category: 'Commercial',
    productUsed: 'Heavy structural fixed glazing & casement entries',
    date: 'January 2026',
    image: '/images/hero.png'
  },
  {
    id: 3,
    title: 'Prestige Apartments Block C',
    location: 'Anna Nagar, Chennai',
    category: 'Apartments',
    productUsed: 'Standard white sliding windows with insect meshes',
    date: 'December 2025',
    image: '/images/after-window.png'
  },
  {
    id: 4,
    title: 'Elite Residency Custom Renovation',
    location: 'Adyar, Chennai',
    category: 'Residential',
    productUsed: 'Brown laminated casement and tilt & turn windows',
    date: 'February 2026',
    image: '/images/after-window.png'
  },
  {
    id: 5,
    title: 'Lakeside Corporate Office',
    location: 'Velachery, Chennai',
    category: 'Commercial',
    productUsed: 'Acoustic soundproof uPVC fixed glass windows',
    date: 'November 2025',
    image: '/images/hero.png'
  },
  {
    id: 6,
    title: 'Green Meadows Row Houses',
    location: 'Perungudi, Chennai',
    category: 'Villas',
    productUsed: 'French doors & sliding patio balconies',
    date: 'October 2025',
    image: '/images/hero.png'
  }
];

export default function Gallery() {
  const { t } = useLanguage();
  const [activeFilter, setActiveFilter] = useState<'All' | 'Residential' | 'Commercial' | 'Apartments' | 'Villas'>('All');

  const filteredProjects = projectsData.filter(
    p => activeFilter === 'All' || p.category === activeFilter
  );

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-10">
      
      {/* Header */}
      <div className="text-center space-y-2">
        <span className="text-xs font-bold uppercase tracking-widest text-blue-600 dark:text-blue-400">Portfolio</span>
        <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white sm:text-4xl">
          Completed Projects Gallery
        </h1>
        <p className="mx-auto max-w-2xl text-sm text-slate-500 dark:text-slate-400">
          Browse through some of our premium residential, commercial, and villa installations across Tamil Nadu.
        </p>
      </div>

      {/* Filter Menu */}
      <div className="flex flex-wrap justify-center gap-2">
        {(['All', 'Residential', 'Commercial', 'Apartments', 'Villas'] as const).map(filter => (
          <button
            key={filter}
            onClick={() => setActiveFilter(filter)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeFilter === filter
                ? 'bg-blue-600 text-white shadow-sm'
                : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 dark:bg-slate-800 dark:text-slate-200 dark:border-slate-700 dark:hover:bg-slate-700'
            }`}
          >
            {filter === 'All' ? 'All Projects' : filter}
          </button>
        ))}
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredProjects.map(project => (
          <div 
            key={project.id} 
            className="group overflow-hidden rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-md transition-all duration-300"
          >
            {/* Image wrapper */}
            <div className="relative h-64 w-full overflow-hidden bg-slate-100">
              <Image
                src={project.image}
                alt={project.title}
                fill
                className="object-cover transition-transform duration-550 group-hover:scale-102"
                sizes="(max-width: 768px) 100vw, 350px"
              />
              <span className="absolute top-3 left-3 bg-blue-600/90 backdrop-blur-sm text-white text-[10px] font-extrabold px-2.5 py-1 rounded-full uppercase shadow-xs">
                {project.category}
              </span>
            </div>

            {/* Description details */}
            <div className="p-6 space-y-3">
              <h3 className="text-base font-bold text-slate-900 dark:text-white group-hover:text-blue-500 transition-colors">
                {project.title}
              </h3>
              
              <div className="space-y-1.5 text-xs text-slate-500 dark:text-slate-400">
                <div className="flex items-center">
                  <MapPin className="h-4 w-4 text-amber-500 mr-2 shrink-0" />
                  <span>{project.location}</span>
                </div>
                <div className="flex items-center">
                  <Layers className="h-4 w-4 text-blue-500 mr-2 shrink-0" />
                  <span>{project.productUsed}</span>
                </div>
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 text-slate-400 mr-2 shrink-0" />
                  <span>{project.date}</span>
                </div>
              </div>
            </div>

          </div>
        ))}
      </div>

    </div>
  );
}
