'use client';

import React, { useState, useEffect } from 'react';
import { 
  Lock, 
  LayoutDashboard, 
  FileText, 
  Calculator, 
  Sliders, 
  LogOut, 
  Download, 
  Trash2, 
  RefreshCw,
  TrendingUp,
  Mail,
  UserCheck
} from 'lucide-react';
import { ApiService } from '../../utils/api';

export default function Admin() {
  // Auth State
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [loggingIn, setLoggingIn] = useState(false);

  // Dashboard Tab state
  const [activeTab, setActiveTab] = useState<'dashboard' | 'inquiries' | 'quotes' | 'pricing'>('dashboard');

  // Leads & Inquiries Lists
  const [inquiries, setInquiries] = useState<any[]>([]);
  const [quotes, setQuotes] = useState<any[]>([]);
  
  // Pricing configuration state
  const [configs, setConfigs] = useState<{ [key: string]: string }>({});

  const [loadingData, setLoadingData] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  // Authenticate token on mount
  useEffect(() => {
    async function checkAuth() {
      const token = localStorage.getItem('upvc_admin_token');
      if (token) {
        try {
          const res = await ApiService.verifyToken();
          if (res.valid) {
            setIsLoggedIn(true);
            loadDashboardData();
          } else {
            localStorage.removeItem('upvc_admin_token');
          }
        } catch (e) {
          localStorage.removeItem('upvc_admin_token');
        }
      }
      setCheckingAuth(false);
    }
    checkAuth();
  }, []);

  const loadDashboardData = async () => {
    setLoadingData(true);
    try {
      const [inqList, qList, confList] = await Promise.all([
        ApiService.getInquiries(),
        ApiService.getQuotations(),
        ApiService.getConfigs()
      ]);
      setInquiries(inqList);
      setQuotes(qList);
      setConfigs(confList);
    } catch (err) {
      console.error('Failed to load dashboard data:', err);
    } finally {
      setLoadingData(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadDashboardData();
    setRefreshing(false);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    setLoggingIn(true);

    try {
      const res = await ApiService.login(username, password);
      localStorage.setItem('upvc_admin_token', res.token);
      setIsLoggedIn(true);
      await loadDashboardData();
    } catch (err: any) {
      setLoginError(err.message || 'Invalid username or password.');
    } finally {
      setLoggingIn(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('upvc_admin_token');
    setIsLoggedIn(false);
    setInquiries([]);
    setQuotes([]);
    setConfigs({});
  };

  // Inquiry actions
  const handleUpdateInquiryStatus = async (id: number, status: 'NEW' | 'CONTACTED' | 'CLOSED') => {
    try {
      const updated = await ApiService.updateInquiryStatus(id, status);
      setInquiries(prev => prev.map(i => i.id === id ? updated : i));
    } catch (err) {
      alert('Failed to update status.');
    }
  };

  const handleDeleteInquiry = async (id: number) => {
    if (!confirm('Are you sure you want to delete this inquiry?')) return;
    try {
      await ApiService.deleteInquiry(id);
      setInquiries(prev => prev.filter(i => i.id !== id));
    } catch (err) {
      alert('Failed to delete inquiry.');
    }
  };

  // Quotation actions
  const handleUpdateQuoteStatus = async (id: number, status: 'NEW' | 'CONTACTED' | 'SENT' | 'CLOSED') => {
    try {
      const updated = await ApiService.updateQuotationStatus(id, status);
      setQuotes(prev => prev.map(q => q.id === id ? updated : q));
    } catch (err) {
      alert('Failed to update status.');
    }
  };

  const handleDeleteQuote = async (id: number) => {
    if (!confirm('Are you sure you want to delete this quotation?')) return;
    try {
      await ApiService.deleteQuotation(id);
      setQuotes(prev => prev.filter(q => q.id !== id));
    } catch (err) {
      alert('Failed to delete quotation.');
    }
  };

  // Config actions
  const handleConfigChange = (key: string, val: string) => {
    setConfigs(prev => ({ ...prev, [key]: val }));
  };

  const handleSaveConfigs = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await ApiService.updateConfigs(configs);
      alert('Pricing configurations updated successfully.');
    } catch (err) {
      alert('Failed to save configurations.');
    }
  };

  const handleExcelExport = () => {
    ApiService.downloadExcelReport();
  };

  if (checkingAuth) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto" />
          <p className="mt-3 text-xs text-slate-500">Checking auth token...</p>
        </div>
      </div>
    );
  }

  // --- RENDER LOGIN VIEW ---
  if (!isLoggedIn) {
    return (
      <div className="mx-auto max-w-md px-4 py-16 flex justify-center">
        <div className="w-full bg-white dark:bg-slate-800 rounded-3xl p-8 border border-slate-200 dark:border-slate-700 shadow-lg space-y-6">
          <div className="text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100 text-blue-600 dark:bg-blue-950/20">
              <Lock className="h-6 w-6" />
            </div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mt-3">Admin Login</h2>
            <p className="text-xs text-slate-400 mt-1">Provide credentials to unlock administrator dashboard.</p>
          </div>

          {loginError && (
            <div className="p-3 bg-red-50 dark:bg-red-950/20 text-red-600 dark:text-red-400 rounded-xl text-xs font-semibold">
              {loginError}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider mb-1">Username</label>
              <input
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full rounded-xl border border-slate-350 px-4 py-2.5 text-sm dark:border-slate-700 dark:bg-slate-900"
                placeholder="admin"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider mb-1">Password</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-xl border border-slate-355 px-4 py-2.5 text-sm dark:border-slate-700 dark:bg-slate-900"
                placeholder="••••••••"
              />
            </div>
            <button
              type="submit"
              disabled={loggingIn}
              className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs shadow-md disabled:bg-slate-400"
            >
              {loggingIn ? 'Signing in...' : 'Sign In'}
            </button>
          </form>
          <div className="text-[10px] text-center text-slate-400">
            Default user is <code className="bg-slate-100 dark:bg-slate-900 px-1 py-0.5 rounded">admin</code> with password <code className="bg-slate-100 dark:bg-slate-900 px-1 py-0.5 rounded">AdminPass123</code>.
          </div>
        </div>
      </div>
    );
  }

  // --- RENDER DASHBOARD VIEW ---
  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-6">
      
      {/* Dashboard Topbar Banner */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-slate-900 text-white p-6 rounded-3xl border border-slate-800 shadow-md">
        <div>
          <h1 className="text-2xl font-extrabold flex items-center">
            <UserCheck className="h-6 w-6 text-amber-500 mr-2" />
            Administration Center
          </h1>
          <p className="text-xs text-slate-400 mt-1">Manage inquiries, quotation configurations, and download spreadsheet reports.</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleRefresh}
            disabled={refreshing}
            className="rounded-xl border border-slate-700 bg-slate-800/60 p-2.5 hover:bg-slate-750 text-white flex items-center gap-1.5 text-xs font-semibold"
          >
            <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
            Sync
          </button>
          <button
            onClick={handleExcelExport}
            className="rounded-xl bg-amber-600 py-2.5 px-4 hover:bg-amber-700 text-white flex items-center gap-1.5 text-xs font-bold shadow-md"
          >
            <Download className="h-4 w-4" />
            Excel Export
          </button>
          <button
            onClick={handleLogout}
            className="rounded-xl bg-slate-800 hover:bg-slate-700 p-2.5 text-red-400 border border-slate-700 flex items-center gap-1.5 text-xs font-semibold"
          >
            <LogOut className="h-4 w-4" />
            Log Out
          </button>
        </div>
      </div>

      {/* Tabs navigation panel */}
      <div className="flex border-b border-slate-200 dark:border-slate-800">
        <button
          onClick={() => setActiveTab('dashboard')}
          className={`flex items-center gap-2 px-5 py-3 border-b-2 font-bold text-xs transition-colors ${
            activeTab === 'dashboard'
              ? 'border-blue-600 text-blue-600 dark:border-blue-500 dark:text-blue-400'
              : 'border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
          }`}
        >
          <LayoutDashboard className="h-4 w-4" />
          Overview
        </button>
        <button
          onClick={() => setActiveTab('inquiries')}
          className={`flex items-center gap-2 px-5 py-3 border-b-2 font-bold text-xs transition-colors ${
            activeTab === 'inquiries'
              ? 'border-blue-600 text-blue-600 dark:border-blue-500 dark:text-blue-400'
              : 'border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
          }`}
        >
          <Mail className="h-4 w-4" />
          General Inquiries ({inquiries.length})
        </button>
        <button
          onClick={() => setActiveTab('quotes')}
          className={`flex items-center gap-2 px-5 py-3 border-b-2 font-bold text-xs transition-colors ${
            activeTab === 'quotes'
              ? 'border-blue-600 text-blue-600 dark:border-blue-500 dark:text-blue-400'
              : 'border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
          }`}
        >
          <Calculator className="h-4 w-4" />
          Smart Quotations ({quotes.length})
        </button>
        <button
          onClick={() => setActiveTab('pricing')}
          className={`flex items-center gap-2 px-5 py-3 border-b-2 font-bold text-xs transition-colors ${
            activeTab === 'pricing'
              ? 'border-blue-600 text-blue-600 dark:border-blue-500 dark:text-blue-400'
              : 'border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
          }`}
        >
          <Sliders className="h-4 w-4" />
          Pricing Manager
        </button>
      </div>

      {loadingData ? (
        <div className="text-center py-20">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-650 mx-auto" />
          <p className="mt-3 text-xs text-slate-500">Querying database information...</p>
        </div>
      ) : (
        <div className="animate-in fade-in duration-300">
          
          {/* TAB 1: OVERVIEW STATISTICS */}
          {activeTab === 'dashboard' && (
            <div className="space-y-8">
              {/* Counters Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                
                {/* Total Leads */}
                <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm flex items-center justify-between">
                  <div className="space-y-1">
                    <span className="block text-xs font-bold uppercase tracking-wider text-slate-400">Total Leads Logged</span>
                    <span className="block text-3xl font-extrabold text-slate-900 dark:text-white">{inquiries.length + quotes.length}</span>
                  </div>
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400">
                    <TrendingUp className="h-6 w-6" />
                  </div>
                </div>

                {/* Contact Inquiries */}
                <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm flex items-center justify-between">
                  <div className="space-y-1">
                    <span className="block text-xs font-bold uppercase tracking-wider text-slate-400">Contact Inquiries</span>
                    <span className="block text-3xl font-extrabold text-slate-900 dark:text-white">{inquiries.length}</span>
                  </div>
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-green-50 dark:bg-green-950/40 text-green-600 dark:text-green-400">
                    <Mail className="h-6 w-6" />
                  </div>
                </div>

                {/* Quotation Calculator Requests */}
                <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm flex items-center justify-between">
                  <div className="space-y-1">
                    <span className="block text-xs font-bold uppercase tracking-wider text-slate-400">Quotations Run</span>
                    <span className="block text-3xl font-extrabold text-slate-900 dark:text-white">{quotes.length}</span>
                  </div>
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400">
                    <Calculator className="h-6 w-6" />
                  </div>
                </div>

              </div>

              {/* Quick Table lists preview */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Recent Inquiries Preview */}
                <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6 shadow-sm">
                  <h3 className="text-base font-bold text-slate-900 dark:text-white mb-4">Recent Contact Inquiries</h3>
                  {inquiries.length === 0 ? (
                    <p className="text-slate-500 text-xs py-4">No recent inquiries.</p>
                  ) : (
                    <div className="divide-y divide-slate-100 dark:divide-slate-700 text-xs">
                      {inquiries.slice(0, 4).map(i => (
                        <div key={i.id} className="py-3 flex justify-between items-start">
                          <div>
                            <span className="block font-bold text-slate-850 dark:text-slate-200">{i.name}</span>
                            <span className="block text-[10px] text-slate-400">{i.phone} | {i.email}</span>
                          </div>
                          <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold ${
                            i.status === 'NEW' ? 'bg-blue-100 text-blue-800 dark:bg-blue-950/30 dark:text-blue-400' : 'bg-slate-100 text-slate-600 dark:bg-slate-700'
                          }`}>{i.status}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Recent Quotations Preview */}
                <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6 shadow-sm">
                  <h3 className="text-base font-bold text-slate-900 dark:text-white mb-4">Recent Quotations</h3>
                  {quotes.length === 0 ? (
                    <p className="text-slate-500 text-xs py-4">No recent quotations.</p>
                  ) : (
                    <div className="divide-y divide-slate-100 dark:divide-slate-700 text-xs">
                      {quotes.slice(0, 4).map(q => (
                        <div key={q.id} className="py-3 flex justify-between items-start">
                          <div>
                            <span className="block font-bold text-slate-850 dark:text-slate-200">{q.name} ({q.city})</span>
                            <span className="block text-[10px] text-slate-400">{q.product_type} {q.product_style} - {q.width}x{q.height}mm</span>
                          </div>
                          <span className="font-extrabold text-amber-600">₹{parseFloat(q.total_estimate).toLocaleString('en-IN')}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: INQUIRIES LOG TABLE */}
          {activeTab === 'inquiries' && (
            <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 overflow-hidden shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200 text-slate-400 font-bold uppercase tracking-wider dark:bg-slate-900/50 dark:border-slate-750">
                      <th className="p-4">Customer</th>
                      <th className="p-4">Message</th>
                      <th className="p-4">Status</th>
                      <th className="p-4">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-150 dark:divide-slate-700">
                    {inquiries.map(i => (
                      <tr key={i.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-750/30">
                        <td className="p-4 space-y-1">
                          <span className="block font-bold text-slate-800 dark:text-slate-200">{i.name}</span>
                          <span className="block text-slate-500">{i.phone}</span>
                          <span className="block text-slate-400 text-[10px]">{i.email}</span>
                          <span className="block text-[9px] text-slate-400">{new Date(i.created_at).toLocaleString('en-IN')}</span>
                        </td>
                        <td className="p-4">
                          <p className="whitespace-pre-line max-w-sm max-h-24 overflow-y-auto leading-relaxed text-slate-650 dark:text-slate-350">
                            {i.message}
                          </p>
                        </td>
                        <td className="p-4">
                          <select
                            value={i.status}
                            onChange={(e) => handleUpdateInquiryStatus(i.id, e.target.value as any)}
                            className={`px-2.5 py-1.5 rounded-lg font-bold text-[10px] border focus:outline-none ${
                              i.status === 'NEW' 
                                ? 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/20 dark:text-blue-400 dark:border-blue-800/40' 
                                : i.status === 'CONTACTED'
                                ? 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/20 dark:text-amber-400 dark:border-amber-800/40'
                                : 'bg-slate-50 text-slate-600 border-slate-200 dark:bg-slate-800 dark:text-slate-350 dark:border-slate-700'
                            }`}
                          >
                            <option value="NEW">New Lead</option>
                            <option value="CONTACTED">Contacted</option>
                            <option value="CLOSED">Closed / Archived</option>
                          </select>
                        </td>
                        <td className="p-4">
                          <button
                            onClick={() => handleDeleteInquiry(i.id)}
                            className="rounded-lg p-2 text-slate-400 hover:text-red-500 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                          >
                            <Trash2 className="h-4.5 w-4.5" />
                          </button>
                        </td>
                      </tr>
                    ))}
                    {inquiries.length === 0 && (
                      <tr>
                        <td colSpan={4} className="p-8 text-center text-slate-500">No contact inquiries found.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 3: QUOTATIONS LOG TABLE */}
          {activeTab === 'quotes' && (
            <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 overflow-hidden shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200 text-slate-400 font-bold uppercase tracking-wider dark:bg-slate-900/50 dark:border-slate-750">
                      <th className="p-4">Client / Site</th>
                      <th className="p-4">Configuration</th>
                      <th className="p-4">Pricing Breakdown</th>
                      <th className="p-4">Status</th>
                      <th className="p-4">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-150 dark:divide-slate-700">
                    {quotes.map(q => (
                      <tr key={q.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-750/30">
                        {/* Customer & Location */}
                        <td className="p-4 space-y-1">
                          <span className="block font-bold text-slate-800 dark:text-slate-200">{q.name}</span>
                          <span className="block text-slate-500">{q.phone}</span>
                          <span className="block text-slate-400 text-[10px]">{q.email}</span>
                          <span className="block text-slate-550 leading-tight">{q.address}, <strong>{q.city}</strong></span>
                          <span className="block text-[9px] text-slate-400">{new Date(q.created_at).toLocaleString('en-IN')}</span>
                        </td>
                        {/* Config Details */}
                        <td className="p-4 space-y-1">
                          <span className="inline-flex rounded bg-blue-100 text-blue-800 dark:bg-blue-950/40 dark:text-blue-400 px-2 py-0.5 font-bold text-[9px] uppercase">
                            {q.product_type}
                          </span>
                          <span className="block font-bold text-slate-750 dark:text-slate-200">{q.product_style}</span>
                          <span className="block text-slate-500">Dim: {q.width} x {q.height} mm (Qty: {q.quantity})</span>
                          <div className="flex flex-wrap gap-1 mt-1.5">
                            <span className="text-[9px] bg-slate-100 border border-slate-200 dark:bg-slate-900 dark:border-slate-750 px-1.5 rounded">{q.glass_type}</span>
                            <span className="text-[9px] bg-slate-100 border border-slate-200 dark:bg-slate-900 dark:border-slate-750 px-1.5 rounded">{q.frame_color}</span>
                            <span className="text-[9px] bg-slate-100 border border-slate-200 dark:bg-slate-900 dark:border-slate-750 px-1.5 rounded">{q.hardware_quality}</span>
                          </div>
                        </td>
                        {/* Cost Breakdown */}
                        <td className="p-4 text-xs font-semibold text-slate-650 dark:text-slate-350 space-y-0.5">
                          <div className="flex justify-between w-32">
                            <span className="text-slate-400 text-[10px]">Product:</span>
                            <span>₹{parseFloat(q.product_cost).toLocaleString('en-IN')}</span>
                          </div>
                          <div className="flex justify-between w-32">
                            <span className="text-slate-400 text-[10px]">Install:</span>
                            <span>₹{parseFloat(q.installation_cost).toLocaleString('en-IN')}</span>
                          </div>
                          <div className="flex justify-between w-32 pb-1 border-b border-slate-100 dark:border-slate-700">
                            <span className="text-slate-400 text-[10px]">GST (18%):</span>
                            <span>₹{parseFloat(q.gst).toLocaleString('en-IN')}</span>
                          </div>
                          <div className="flex justify-between w-32 font-bold text-slate-900 dark:text-white pt-1">
                            <span className="text-[10px]">Total Est:</span>
                            <span className="text-amber-600 dark:text-amber-500">₹{parseFloat(q.total_estimate).toLocaleString('en-IN')}</span>
                          </div>
                        </td>
                        {/* Status Select */}
                        <td className="p-4">
                          <select
                            value={q.status}
                            onChange={(e) => handleUpdateQuoteStatus(q.id, e.target.value as any)}
                            className={`px-2.5 py-1.5 rounded-lg font-bold text-[10px] border focus:outline-none ${
                              q.status === 'NEW' 
                                ? 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/20 dark:text-blue-400 dark:border-blue-800/40' 
                                : q.status === 'CONTACTED'
                                ? 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/20 dark:text-amber-400 dark:border-amber-800/40'
                                : q.status === 'SENT'
                                ? 'bg-green-50 text-green-700 border-green-200 dark:bg-green-950/20 dark:text-green-400 dark:border-green-800/40'
                                : 'bg-slate-50 text-slate-600 border-slate-200 dark:bg-slate-800 dark:text-slate-350 dark:border-slate-700'
                            }`}
                          >
                            <option value="NEW">New Quote</option>
                            <option value="CONTACTED">Site Contacted</option>
                            <option value="SENT">Quote Sent</option>
                            <option value="CLOSED">Closed / Invoiced</option>
                          </select>
                        </td>
                        {/* Delete action */}
                        <td className="p-4">
                          <button
                            onClick={() => handleDeleteQuote(q.id)}
                            className="rounded-lg p-2 text-slate-400 hover:text-red-500 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                          >
                            <Trash2 className="h-4.5 w-4.5" />
                          </button>
                        </td>
                      </tr>
                    ))}
                    {quotes.length === 0 && (
                      <tr>
                        <td colSpan={5} className="p-8 text-center text-slate-500">No quotation requests found.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 4: PRICING CONFIGURATION MANAGER */}
          {activeTab === 'pricing' && (
            <form onSubmit={handleSaveConfigs} className="bg-white dark:bg-slate-800 rounded-3xl p-6 md:p-8 border border-slate-200 dark:border-slate-700 shadow-sm space-y-6">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">Adjust Pricing Calculator Rates & Multipliers</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
                
                {/* Windows base rates */}
                <div className="space-y-4 bg-slate-50 dark:bg-slate-900/50 p-5 rounded-2xl border border-slate-150 dark:border-slate-750">
                  <h4 className="font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider text-[10px]">Windows Base Rates (per SQM in INR)</h4>
                  <div className="grid grid-cols-2 gap-4">
                    {Object.keys(configs).filter(k => k.startsWith('window_')).map(key => (
                      <div key={key}>
                        <label className="block text-[10px] font-bold text-slate-500 capitalize mb-1">
                          {key.replace('window_', '').replace('_base_rate', '').replace('_', ' ')}
                        </label>
                        <input
                          type="number"
                          value={configs[key] || ''}
                          onChange={(e) => handleConfigChange(key, e.target.value)}
                          className="w-full rounded-lg border border-slate-350 px-3 py-2 text-xs font-bold dark:border-slate-700 dark:bg-slate-800"
                        />
                      </div>
                    ))}
                  </div>
                </div>

                {/* Doors base rates */}
                <div className="space-y-4 bg-slate-50 dark:bg-slate-900/50 p-5 rounded-2xl border border-slate-150 dark:border-slate-750">
                  <h4 className="font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider text-[10px]">Doors Base Rates (per SQM in INR)</h4>
                  <div className="grid grid-cols-2 gap-4">
                    {Object.keys(configs).filter(k => k.startsWith('door_')).map(key => (
                      <div key={key}>
                        <label className="block text-[10px] font-bold text-slate-500 capitalize mb-1">
                          {key.replace('door_', '').replace('_base_rate', '').replace('_', ' ')}
                        </label>
                        <input
                          type="number"
                          value={configs[key] || ''}
                          onChange={(e) => handleConfigChange(key, e.target.value)}
                          className="w-full rounded-lg border border-slate-350 px-3 py-2 text-xs font-bold dark:border-slate-700 dark:bg-slate-800"
                        />
                      </div>
                    ))}
                  </div>
                </div>

                {/* Glass and Color multipliers */}
                <div className="space-y-4 bg-slate-50 dark:bg-slate-900/50 p-5 rounded-2xl border border-slate-150 dark:border-slate-750">
                  <h4 className="font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider text-[10px]">Material Factors Multipliers</h4>
                  <div className="grid grid-cols-2 gap-4">
                    {Object.keys(configs).filter(k => k.startsWith('glass_') || k.startsWith('color_')).map(key => (
                      <div key={key}>
                        <label className="block text-[9px] font-bold text-slate-500 capitalize mb-1 line-clamp-1">
                          {key.replace('glass_', '').replace('color_', '').replace('_multiplier', '').replace('_', ' ')}
                        </label>
                        <input
                          type="number"
                          step="0.01"
                          value={configs[key] || ''}
                          onChange={(e) => handleConfigChange(key, e.target.value)}
                          className="w-full rounded-lg border border-slate-350 px-3 py-2 text-xs font-bold dark:border-slate-700 dark:bg-slate-800"
                        />
                      </div>
                    ))}
                  </div>
                </div>

                {/* Hardware, install and GST */}
                <div className="space-y-4 bg-slate-50 dark:bg-slate-900/50 p-5 rounded-2xl border border-slate-150 dark:border-slate-750">
                  <h4 className="font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider text-[10px]">Hardware & Install Constants</h4>
                  <div className="grid grid-cols-2 gap-4">
                    {/* Hardware standard & premium */}
                    {Object.keys(configs).filter(k => k.startsWith('hardware_')).map(key => (
                      <div key={key}>
                        <label className="block text-[9px] font-bold text-slate-500 capitalize mb-1">
                          Hardware {key.replace('hardware_', '').replace('_multiplier', '').replace('_', ' ')}
                        </label>
                        <input
                          type="number"
                          step="0.01"
                          value={configs[key] || ''}
                          onChange={(e) => handleConfigChange(key, e.target.value)}
                          className="w-full rounded-lg border border-slate-350 px-3 py-2 text-xs font-bold dark:border-slate-700 dark:bg-slate-800"
                        />
                      </div>
                    ))}
                    {/* Installation and GST */}
                    {['installation_base_rate', 'gst_rate_percent'].map(key => (
                      <div key={key}>
                        <label className="block text-[9px] font-bold text-slate-500 capitalize mb-1">
                          {key.replace('_percent', '').replace(/_/g, ' ')}
                        </label>
                        <input
                          type="number"
                          value={configs[key] || ''}
                          onChange={(e) => handleConfigChange(key, e.target.value)}
                          className="w-full rounded-lg border border-slate-350 px-3 py-2 text-xs font-bold dark:border-slate-700 dark:bg-slate-800"
                        />
                      </div>
                    ))}
                  </div>
                </div>

              </div>

              <div className="pt-4 flex justify-end">
                <button
                  type="submit"
                  className="px-6 py-3 bg-blue-600 hover:bg-blue-750 text-white rounded-xl text-xs font-bold shadow-md transition-colors"
                >
                  Save New Rates
                </button>
              </div>

            </form>
          )}

        </div>
      )}

    </div>
  );
}
