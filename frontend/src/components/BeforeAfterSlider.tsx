'use client';

import React, { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import { useLanguage } from './LanguageContext';

export default function BeforeAfterSlider() {
  const { t } = useLanguage();
  const [sliderPosition, setSliderPosition] = useState(50); // percentage (0 to 100)
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMove = (clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const position = Math.max(0, Math.min(100, (x / rect.width) * 100));
    setSliderPosition(position);
  };

  const handleTouchMove = (e: TouchEvent) => {
    if (!isDragging) return;
    handleMove(e.touches[0].clientX);
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!isDragging) return;
    handleMove(e.clientX);
  };

  useEffect(() => {
    const handleMouseUp = () => setIsDragging(false);

    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
      window.addEventListener('touchmove', handleTouchMove);
      window.addEventListener('touchend', handleMouseUp);
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleMouseUp);
    };
  }, [isDragging]);

  return (
    <section className="py-12 bg-slate-50 dark:bg-slate-900/50">
      <div className="mx-auto max-w-4xl px-4 text-center">
        <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white sm:text-4xl">
          {t('common.comparisonTitle')}
        </h2>
        <p className="mx-auto mt-3 max-w-2xl text-slate-500 dark:text-slate-400">
          {t('common.comparisonDesc')}
        </p>

        {/* Interactive Comparison Widget */}
        <div 
          ref={containerRef}
          className="relative mt-10 h-[300px] md:h-[450px] w-full overflow-hidden rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800 select-none cursor-ew-resize"
          onMouseDown={() => setIsDragging(true)}
          onTouchStart={() => setIsDragging(true)}
        >
          {/* Before Image (Background) */}
          <div className="absolute inset-0 h-full w-full">
            <Image
              src="/images/before-window.png"
              alt="Before - Old Wood Window"
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 800px"
              priority
            />
            <div className="absolute bottom-4 left-4 rounded bg-slate-900/70 px-3 py-1 text-xs font-bold text-white uppercase tracking-wider backdrop-blur-sm">
              {t('common.before')}
            </div>
          </div>

          {/* After Image (Foreground, clipped) */}
          <div 
            className="absolute inset-0 h-full w-full overflow-hidden"
            style={{ width: `${sliderPosition}%` }}
          >
            <div className="absolute inset-0 h-[300px] md:h-[450px] w-full min-w-[340px] md:min-w-[800px]">
              <Image
                src="/images/after-window.png"
                alt="After - Premium uPVC Window"
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 800px"
                priority
              />
              <div className="absolute bottom-4 right-4 rounded bg-amber-600/95 px-3 py-1 text-xs font-bold text-white uppercase tracking-wider backdrop-blur-sm">
                {t('common.after')}
              </div>
            </div>
          </div>

          {/* Slider Divider Bar */}
          <div 
            className="absolute bottom-0 top-0 w-1 bg-white cursor-ew-resize"
            style={{ left: `${sliderPosition}%` }}
          >
            {/* Center handle */}
            <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 flex h-10 w-10 items-center justify-center rounded-full bg-white text-slate-800 shadow-xl border border-slate-300">
              <span className="text-sm font-bold">↔</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
