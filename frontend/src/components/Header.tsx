'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X, Globe, Sun, Moon, PhoneCall } from 'lucide-react';
import { useLanguage } from './LanguageContext';

export default function Header() {
  const { language, setLanguage, t } = useLanguage();
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isDark, setIsDark] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Load and apply dark theme
  useEffect(() => {
    const savedTheme = localStorage.getItem('upvc_pref_theme');
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    if (savedTheme === 'dark' || (!savedTheme && systemPrefersDark)) {
      setIsDark(true);
      document.documentElement.classList.add('dark');
    } else {
      setIsDark(false);
      document.documentElement.classList.remove('dark');
    }
  }, []);

  // Monitor scrolling to add background color to nav
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on page transition
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  const toggleTheme = () => {
    if (isDark) {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('upvc_pref_theme', 'light');
      setIsDark(false);
    } else {
      document.documentElement.classList.add('dark');
      localStorage.setItem('upvc_pref_theme', 'dark');
      setIsDark(true);
    }
  };

  const navLinks = [
    { href: '/', label: t('nav.home') },
    { href: '/products', label: t('nav.products') },
    { href: '/services', label: t('nav.services') },
    { href: '/gallery', label: t('nav.gallery') },
    { href: '/about', label: t('nav.about') },
    { href: '/contact', label: t('nav.contact') },
  ];

  return (
    <header className={`sticky top-0 z-40 w-full transition-all duration-300 ${
      scrolled 
        ? 'bg-slate-900/90 text-white shadow-md backdrop-blur-md dark:bg-slate-950/95' 
        : 'bg-white text-slate-900 border-b border-slate-200 dark:bg-slate-900 dark:text-slate-100 dark:border-slate-800'
    }`}>
      <div className="mx-auto flex max-w-7xl items-center justify-between p-4 lg:px-8">
        {/* Logo */}
        <Link href="/" className="flex items-center space-x-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-600 text-white font-bold text-lg shadow-md">
            uP
          </div>
          <span className="font-extrabold text-xl tracking-tight bg-gradient-to-r from-blue-600 to-amber-600 bg-clip-text text-transparent dark:from-blue-400 dark:to-amber-500">
            V-Tech Profiles
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex space-x-6 lg:space-x-8 font-medium">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`transition-colors duration-200 hover:text-amber-500 ${
                  isActive 
                    ? 'text-amber-600 dark:text-amber-400 font-semibold' 
                    : scrolled ? 'text-slate-300' : 'text-slate-600 dark:text-slate-300'
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* Toolbar (Language, Dark Mode, CTA) */}
        <div className="hidden md:flex items-center space-x-4">
          {/* Language Selector */}
          <div className="relative flex items-center bg-slate-100 dark:bg-slate-800 rounded-lg p-1">
            <Globe className="h-4 w-4 text-slate-500 ml-1.5" />
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value as 'en' | 'ta')}
              className="bg-transparent text-xs font-semibold py-1 px-1.5 focus:outline-none cursor-pointer text-slate-700 dark:text-slate-300"
            >
              <option value="en" className="text-slate-800 bg-white">English</option>
              <option value="ta" className="text-slate-800 bg-white">தமிழ்</option>
            </select>
          </div>

          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800 transition-colors"
            title={isDark ? t('common.lightMode') : t('common.darkMode')}
          >
            {isDark ? <Sun className="h-5 w-5 text-amber-400" /> : <Moon className="h-5 w-5 text-slate-600" />}
          </button>

          {/* Call To Action */}
          <Link
            href="/quote"
            className="inline-flex items-center justify-center rounded-lg bg-amber-600 px-4 py-2 text-sm font-bold text-white shadow-md transition-all duration-200 hover:bg-amber-700 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
          >
            {t('nav.quote')}
          </Link>
        </div>

        {/* Mobile menu trigger */}
        <div className="flex md:hidden items-center space-x-2">
          {/* Language Selector */}
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value as 'en' | 'ta')}
            className="bg-slate-100 dark:bg-slate-800 text-xs font-bold py-1.5 px-2 rounded-lg focus:outline-none cursor-pointer text-slate-800 dark:text-slate-200"
          >
            <option value="en">EN</option>
            <option value="ta">தமிழ்</option>
          </select>

          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="rounded-lg p-1.5 text-slate-500 dark:text-slate-400 transition-colors"
          >
            {isDark ? <Sun className="h-5 w-5 text-amber-400" /> : <Moon className="h-5 w-5 text-slate-600" />}
          </button>

          {/* Hamburger Menu */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="rounded-lg p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white dark:bg-slate-900 dark:border-slate-800 p-4 space-y-3 animate-in fade-in slide-in-from-top-4 duration-200">
          <nav className="flex flex-col space-y-3 font-semibold text-slate-800 dark:text-slate-200">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`py-2 px-3 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 ${
                  pathname === link.href ? 'text-amber-600 bg-amber-50 dark:text-amber-400 dark:bg-amber-950/20' : ''
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>
          <div className="pt-4 border-t border-slate-200 dark:border-slate-800">
            <Link
              href="/quote"
              className="flex w-full items-center justify-center rounded-lg bg-amber-600 py-3 text-base font-bold text-white shadow-md hover:bg-amber-700"
            >
              {t('nav.quote')}
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
