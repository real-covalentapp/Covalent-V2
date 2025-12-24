
import React, { useEffect, useState } from 'react';
import { FormResponse } from '../types';
import { storageService } from '../services/storageService';

const AdminFrame: React.FC = () => {
  const [responses, setResponses] = useState<FormResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [filter, setFilter] = useState('');

  const loadResponses = async (silent = false) => {
    if (!silent) setLoading(true);
    else setIsRefreshing(true);
    
    const data = await storageService.getAllResponses();
    setResponses(data);
    
    setLoading(false);
    setIsRefreshing(false);
  };

  useEffect(() => {
    loadResponses();
    // Optional: Auto-refresh every 30 seconds for real-time monitoring
    const interval = setInterval(() => loadResponses(true), 30000);
    return () => clearInterval(interval);
  }, []);

  const filteredResponses = responses.filter(r => 
    r.name.toLowerCase().includes(filter.toLowerCase()) ||
    r.email.toLowerCase().includes(filter.toLowerCase()) ||
    r.message.toLowerCase().includes(filter.toLowerCase())
  );

  const formatDate = (timestamp: number) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(new Date(timestamp));
  };

  const clearAll = async () => {
    if (confirm('DANGER: This will permanently delete ALL cloud responses for all devices. Proceed?')) {
      await storageService.clearResponses();
      loadResponses();
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Cloud Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gray-900 p-6 rounded-3xl text-white shadow-xl">
        <div>
          <h1 className="text-2xl font-bold flex items-center">
            Cloud Control Center
            <span className="ml-3 flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-3 w-3 rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
            </span>
          </h1>
          <p className="text-gray-400 text-sm mt-1">Live synchronization across all global instances.</p>
        </div>
        <div className="flex items-center space-x-3">
          <button 
            onClick={() => loadResponses(true)}
            disabled={isRefreshing}
            className="flex items-center space-x-2 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-xl transition-all disabled:opacity-50"
          >
            <svg className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            <span className="text-sm font-semibold">{isRefreshing ? 'Syncing...' : 'Refresh Cloud'}</span>
          </button>
          <button 
            onClick={clearAll}
            className="px-4 py-2 bg-red-500/20 text-red-400 hover:bg-red-500/30 rounded-xl transition-all text-sm font-semibold border border-red-500/30"
          >
            Wipe Cloud
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Cloud Syncs', value: responses.length, color: 'text-white bg-gray-800' },
          { label: 'Mobile Leads', value: responses.filter(r => r.device === 'Mobile').length, color: 'text-indigo-400 bg-indigo-900/20 border-indigo-500/20' },
          { label: 'Desktop Leads', value: responses.filter(r => r.device === 'Desktop').length, color: 'text-blue-400 bg-blue-900/20 border-blue-500/20' },
          { label: 'Cloud Status', value: 'Active', color: 'text-green-400 bg-green-900/20 border-green-500/20' },
        ].map((stat, i) => (
          <div key={i} className={`p-4 rounded-2xl border ${stat.color} shadow-sm`}>
            <p className="text-xs uppercase tracking-wider opacity-60 font-bold mb-1">{stat.label}</p>
            <p className="text-2xl font-black">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Data Table Area */}
      <div className="bg-white rounded-3xl border border-gray-100 shadow-xl overflow-hidden min-h-[400px]">
        <div className="p-6 border-b border-gray-100">
          <div className="relative max-w-md">
            <input 
              type="text"
              placeholder="Search synchronized database..."
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-4 focus:ring-indigo-50 outline-none w-full text-sm transition-all"
            />
            <svg className="w-5 h-5 text-gray-400 absolute left-3 top-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>

        <div className="overflow-x-auto">
          {loading ? (
            <div className="py-32 text-center">
              <div className="inline-block animate-spin w-10 h-10 border-[4px] border-indigo-600 border-t-transparent rounded-full mb-4"></div>
              <p className="text-gray-500 font-bold tracking-tight">Accessing Cloud Storage...</p>
            </div>
          ) : filteredResponses.length > 0 ? (
            <table className="w-full text-left">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest">User Identity</th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest">Category</th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest">Device Origin</th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest">Message Content</th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest text-right">Synced At</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filteredResponses.map((res) => (
                  <tr key={res.id} className="hover:bg-indigo-50/30 transition-all group">
                    <td className="px-6 py-5">
                      <div className="flex items-center">
                        <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold mr-3 group-hover:scale-110 transition-transform">
                          {res.name.charAt(0)}
                        </div>
                        <div>
                          <div className="font-bold text-gray-900">{res.name}</div>
                          <div className="text-xs text-gray-500">{res.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <span className={`inline-flex px-3 py-1 rounded-lg text-xs font-black uppercase tracking-tighter border ${
                        res.category === 'Sales' ? 'bg-green-50 text-green-700 border-green-100' :
                        res.category === 'Support' ? 'bg-orange-50 text-orange-700 border-orange-100' :
                        res.category === 'Feedback' ? 'bg-purple-50 text-purple-700 border-purple-100' :
                        'bg-blue-50 text-blue-700 border-blue-100'
                      }`}>
                        {res.category}
                      </span>
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex items-center text-xs font-bold text-gray-500 bg-gray-100 px-2 py-1 rounded-md w-fit">
                        {res.device === 'Mobile' ? (
                          <svg className="w-3.5 h-3.5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                          </svg>
                        ) : (
                          <svg className="w-3.5 h-3.5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                          </svg>
                        )}
                        {res.device}
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <p className="text-sm text-gray-600 line-clamp-2 max-w-sm italic">
                        "{res.message}"
                      </p>
                    </td>
                    <td className="px-6 py-5 text-right text-xs font-black text-gray-400">
                      {formatDate(res.timestamp)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="py-32 text-center text-gray-400">
              <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-10 h-10 text-gray-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                </svg>
              </div>
              <p className="text-xl font-bold">Cloud is Empty</p>
              <p className="text-sm mt-1">Pending user interaction...</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminFrame;
