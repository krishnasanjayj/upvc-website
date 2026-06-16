'use client';

import React, { useState, useEffect } from 'react';
import { Star, ChevronLeft, ChevronRight, Quote } from 'lucide-react';

interface Review {
  id: number;
  name: string;
  role: string;
  rating: number;
  content: string;
  location: string;
}

const reviews: Review[] = [
  {
    id: 1,
    name: 'Senthil Nathan',
    role: 'Home Owner',
    rating: 5,
    content: "We installed uPVC sliding windows and French doors in our new villa in ECR. The sound insulation is incredible. We can't hear the highway noise at all! Highly recommend their professional installation service.",
    location: 'Chennai'
  },
  {
    id: 2,
    name: 'Priyanka Sasi',
    role: 'Interior Designer',
    rating: 5,
    content: 'As a designer, I am very picky about frame finishes. Their laminated wooden finish uPVC casement windows look premium and feel solid. Excellent hardware quality and seamless fit.',
    location: 'Coimbatore'
  },
  {
    id: 3,
    name: 'Dr. Abdul Rahman',
    role: 'Clinic Owner',
    rating: 5,
    content: 'Very energy efficient windows. Our clinic air conditioning costs have gone down by 25% after replacing the old metal frames with uPVC double glazed windows. The team did clean work in a single day.',
    location: 'Madurai'
  }
];

export default function TestimonialsCarousel() {
  const [activeIndex, setActiveIndex] = useState(0);

  const handlePrev = () => {
    setActiveIndex((prev) => (prev === 0 ? reviews.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setActiveIndex((prev) => (prev === reviews.length - 1 ? 0 : prev + 1));
  };

  useEffect(() => {
    const timer = setInterval(() => {
      handleNext();
    }, 8000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="py-16 bg-slate-900 text-white dark:bg-slate-950">
      <div className="mx-auto max-w-4xl px-4 text-center">
        <span className="text-xs font-bold uppercase tracking-widest text-amber-500">Reviews</span>
        <h2 className="mt-2 text-3xl font-extrabold sm:text-4xl">
          What Our Clients Say
        </h2>

        {/* Carousel Container */}
        <div className="relative mt-12 bg-slate-800/50 rounded-3xl p-6 md:p-12 border border-slate-800 backdrop-blur-sm">
          
          {/* Quote Icon */}
          <div className="absolute top-6 left-6 text-slate-700/60 dark:text-slate-800/40">
            <Quote className="h-12 w-12 rotate-180" />
          </div>

          {/* Testimonial Content */}
          <div className="min-h-[160px] flex flex-col justify-center animate-in fade-in duration-500">
            {/* Stars */}
            <div className="flex justify-center space-x-1 mb-4">
              {Array.from({ length: reviews[activeIndex].rating }).map((_, i) => (
                <Star key={i} className="h-5 w-5 fill-amber-500 text-amber-500" />
              ))}
            </div>

            {/* Content text */}
            <p className="text-base md:text-lg italic text-slate-200">
              "{reviews[activeIndex].content}"
            </p>

            {/* Author details */}
            <div className="mt-6">
              <h4 className="font-bold text-white text-lg">{reviews[activeIndex].name}</h4>
              <p className="text-xs text-slate-400">
                {reviews[activeIndex].role} • {reviews[activeIndex].location}
              </p>
            </div>
          </div>

          {/* Navigation Controls */}
          <div className="flex justify-between items-center mt-8 pt-4 border-t border-slate-700/40">
            {/* Left Button */}
            <button
              onClick={handlePrev}
              className="rounded-full bg-slate-800 p-2 text-white hover:bg-slate-750 focus:outline-none transition-colors border border-slate-700"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>

            {/* Dots indicator */}
            <div className="flex space-x-2">
              {reviews.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setActiveIndex(i)}
                  className={`h-2.5 w-2.5 rounded-full transition-all duration-300 ${
                    i === activeIndex ? 'bg-amber-500 w-6' : 'bg-slate-600 hover:bg-slate-500'
                  }`}
                />
              ))}
            </div>

            {/* Right Button */}
            <button
              onClick={handleNext}
              className="rounded-full bg-slate-800 p-2 text-white hover:bg-slate-750 focus:outline-none transition-colors border border-slate-700"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>

        </div>
      </div>
    </section>
  );
}
