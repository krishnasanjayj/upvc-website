'use client';

import React, { useState } from 'react';
import { Phone, Mail, MessageSquare, MapPin, AlertCircle, Clock } from 'lucide-react';
import { useLanguage } from '../../components/LanguageContext';
import { ApiService } from '../../utils/api';

export default function Contact() {
  const { t } = useLanguage();

  // Form State
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !phone || !email || !message) return;

    setErrorMsg('');
    setLoading(true);

    try {
      await ApiService.submitInquiry({ name, email, phone, message });
      setSuccess(true);
      setName('');
      setPhone('');
      setEmail('');
      setMessage('');
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || 'Failed to send message. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const whatsappUrl = 'https://wa.me/919876543210?text=Hello,%20I%20have%2520some%20questions%20about%20your%20uPVC%20products.';

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-12">
      
      {/* Header */}
      <div className="text-center space-y-2">
        <span className="text-xs font-bold uppercase tracking-widest text-blue-600 dark:text-blue-400">Reach Us</span>
        <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white sm:text-4xl">
          {t('contact.title')}
        </h1>
        <p className="mx-auto max-w-2xl text-sm text-slate-500 dark:text-slate-400">
          {t('contact.subtitle')}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Contact Information & Map */}
        <div className="lg:col-span-1 space-y-6">
          
          {/* Quick Info Box */}
          <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 border border-slate-200 dark:border-slate-700 shadow-sm space-y-6">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">{t('contact.infoTitle')}</h3>
            
            <div className="space-y-4 text-sm">
              {/* Call */}
              <a 
                href="tel:+9194454 77574" 
                className="flex items-center p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-750 transition-colors border border-slate-100 dark:border-slate-700"
              >
                <Phone className="h-5 w-5 text-blue-600 dark:text-blue-400 mr-3 shrink-0" />
                <div>
                  <span className="block text-[10px] uppercase font-bold text-slate-400">{t('contact.phoneTitle')}</span>
                  <span className="font-semibold text-slate-800 dark:text-slate-200">+91 94454 77574</span>
                </div>
              </a>

              {/* WhatsApp */}
              <a 
                href={whatsappUrl} 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-750 transition-colors border border-slate-100 dark:border-slate-700"
              >
                <MessageSquare className="h-5 w-5 text-green-500 mr-3 shrink-0" />
                <div>
                  <span className="block text-[10px] uppercase font-bold text-slate-400">{t('contact.whatsappTitle')}</span>
                  <span className="font-semibold text-slate-800 dark:text-slate-200">Chat with Experts</span>
                </div>
              </a>

              {/* Email */}
              <a 
                href="mailto:cndoorsandwindows.com" 
                className="flex items-center p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-750 transition-colors border border-slate-100 dark:border-slate-700"
              >
                <Mail className="h-5 w-5 text-amber-500 mr-3 shrink-0" />
                <div>
                  <span className="block text-[10px] uppercase font-bold text-slate-400">{t('contact.emailTitle')}</span>
                  <span className="font-semibold text-slate-800 dark:text-slate-200">cndoorsandwindows@gmail.com</span>
                </div>
              </a>

              {/* Address */}
              <div className="flex items-start p-3 rounded-xl border border-slate-100 dark:border-slate-700">
                <MapPin className="h-5 w-5 text-red-500 mr-3 shrink-0 mt-0.5" />
                <div>
                  <span className="block text-[10px] uppercase font-bold text-slate-400">{t('contact.addressTitle')}</span>
                  <span className="text-slate-800 dark:text-slate-200 leading-relaxed">
                     tirupur main Road,Avanashi,Tamil Nadu - 641654
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Business Hours */}
          <div className="bg-slate-900 text-white rounded-3xl p-5 border border-slate-850 shadow-sm flex items-center space-x-3 text-xs">
            <Clock className="h-6 w-6 text-amber-500 shrink-0" />
            <div>
              <span className="block font-bold">{t('contact.hoursTitle')}</span>
              <span className="block text-slate-400">{t('contact.hoursWeekdays')}</span>
            </div>
          </div>

        </div>

        {/* Contact Form Area */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-800 rounded-3xl p-6 md:p-8 border border-slate-200 dark:border-slate-700 shadow-sm space-y-6">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">{t('contact.formTitle')}</h3>
          
          {success ? (
            <div className="p-6 text-center space-y-3 bg-green-50 dark:bg-green-950/20 text-green-800 dark:text-green-300 rounded-2xl">
              <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-green-150 text-green-600 dark:bg-green-900">✓</div>
              <h4 className="font-bold text-base">Message Sent!</h4>
              <p className="text-xs">{t('contact.success')}</p>
              <button 
                onClick={() => setSuccess(false)}
                className="mt-2 text-xs font-bold text-blue-600 hover:underline dark:text-blue-400"
              >
                Send another message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              
              {errorMsg && (
                <div className="flex items-center p-4 bg-red-50 dark:bg-red-950/20 text-red-600 dark:text-red-400 rounded-xl text-xs font-semibold">
                  <AlertCircle className="h-5 w-5 mr-2" />
                  {errorMsg}
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">{t('contact.name')} *</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter your name"
                    className="w-full rounded-xl border border-slate-300 px-4 py-2.5 text-sm focus:border-blue-500 focus:outline-none dark:border-slate-750 dark:bg-slate-900"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">{t('contact.phone')} *</label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="e.g. +91 98765 43210"
                    className="w-full rounded-xl border border-slate-300 px-4 py-2.5 text-sm focus:border-blue-500 focus:outline-none dark:border-slate-750 dark:bg-slate-900"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">{t('contact.email')} *</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter email address"
                  className="w-full rounded-xl border border-slate-300 px-4 py-2.5 text-sm focus:border-blue-500 focus:outline-none dark:border-slate-750 dark:bg-slate-900"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">{t('contact.message')} *</label>
                <textarea
                  required
                  rows={4}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Tell us about your requirements (number of windows, sizing etc.)"
                  className="w-full rounded-xl border border-slate-300 px-4 py-2.5 text-sm focus:border-blue-500 focus:outline-none dark:border-slate-750 dark:bg-slate-900"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs shadow-md transition-colors disabled:bg-slate-400"
              >
                {loading ? t('common.loading') : t('contact.submit')}
              </button>

            </form>
          )}

        </div>

      </div>

      {/* Embedded Google Map Frame */}
      <div className="w-full h-80 rounded-3xl overflow-hidden border border-slate-200 dark:border-slate-800 shadow-sm">
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3886.13689408933!2d80.15579997455018!3d13.090538912275727!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a5263ca9e285d85%3A0xc3fecff0e4d0a649!2sSIDCO%20Industrial%20Estate%252C%20Ambattur%252C%20Chennai%252C%20Tamil%20Nadu!5e0!3m2!1sen!2sin!4v1718131333333!5m2!1sen!2sin"
          width="100%"
          height="100%"
          style={{ border: 0 }}
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        />
      </div>

    </div>
  );
}
