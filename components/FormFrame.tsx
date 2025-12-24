import React, { useState } from 'react';
import { storageService } from '../services/storageService';

interface FormFrameProps {
  onGoToAdmin: () => void;
}

const FormFrame: React.FC<FormFrameProps> = ({ onGoToAdmin }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    category: 'General' as const,
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;

    setIsSubmitting(true);
    setError(null);
    
    try {
      const result = await storageService.saveResponse(formData);
      
      if (result.success) {
        setIsSuccess(true);
        setFormData({ name: '', email: '', category: 'General', message: '' });
      } else {
        setError(result.message);
      }
    } catch (err) {
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="max-w-md mx-auto mt-10 p-8 bg-white rounded-3xl border border-gray-100 shadow-2xl text-center">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Sync Complete</h2>
        <p className="text-gray-600 mb-8">Data is now visible on all devices via the Admin Dashboard.</p>
        <div className="space-y-3">
          <button
            onClick={() => setIsSuccess(false)}
            className="w-full py-4 px-4 bg-indigo-600 text-white font-bold rounded-2xl hover:bg-indigo-700 active:scale-95 transition-all shadow-lg shadow-indigo-100"
          >
            Submit New Form
          </button>
          <button
            onClick={onGoToAdmin}
            className="w-full py-4 px-4 bg-gray-50 text-indigo-700 font-bold rounded-2xl hover:bg-gray-100 transition-colors"
          >
            Go to Admin Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto py-4 sm:py-8 px-2">
      <div className="mb-8 text-center px-4">
        <h2 className="text-3xl font-black text-gray-900 mb-2 tracking-tight">Cloud Submission</h2>
        <p className="text-gray-500 text-sm">Real-time cross-device data synchronization.</p>
      </div>

      <form onSubmit={handleSubmit} className="bg-white p-6 sm:p-10 rounded-[2.5rem] border border-gray-100 shadow-2xl space-y-6">
        {error && (
          <div className="p-4 bg-red-50 border border-red-100 rounded-2xl text-red-700 text-sm font-medium flex items-center">
            <svg className="w-5 h-5 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            {error}
          </div>
        )}

        <div className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Identity</label>
            <input
              type="text"
              required
              disabled={isSubmitting}
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-5 py-4 rounded-2xl border border-gray-100 bg-gray-50/50 focus:bg-white focus:ring-4 focus:ring-indigo-50 focus:border-indigo-500 outline-none transition-all"
              placeholder="Your Name"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Electronic Mail</label>
            <input
              type="email"
              required
              disabled={isSubmitting}
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full px-5 py-4 rounded-2xl border border-gray-100 bg-gray-50/50 focus:bg-white focus:ring-4 focus:ring-indigo-50 focus:border-indigo-500 outline-none transition-all"
              placeholder="email@example.com"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Interest Area</label>
            <select
              value={formData.category}
              disabled={isSubmitting}
              onChange={(e) => setFormData({ ...formData, category: e.target.value as any })}
              className="w-full px-5 py-4 rounded-2xl border border-gray-100 bg-gray-50/50 focus:bg-white focus:ring-4 focus:ring-indigo-50 focus:border-indigo-500 outline-none transition-all appearance-none cursor-pointer"
            >
              <option>General</option>
              <option>Sales</option>
              <option>Support</option>
              <option>Feedback</option>
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Message Content</label>
            <textarea
              required
              rows={4}
              disabled={isSubmitting}
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              className="w-full px-5 py-4 rounded-2xl border border-gray-100 bg-gray-50/50 focus:bg-white focus:ring-4 focus:ring-indigo-50 focus:border-indigo-500 outline-none transition-all resize-none"
              placeholder="How can we help you?"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className={`w-full py-5 px-6 rounded-2xl bg-indigo-600 text-white font-bold text-lg shadow-xl shadow-indigo-100 transition-all active:scale-[0.97] flex items-center justify-center space-x-3 ${
            isSubmitting ? 'opacity-70 cursor-wait' : 'hover:bg-indigo-700'
          }`}
        >
          {isSubmitting ? (
            <>
              <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span>Syncing to Cloud...</span>
            </>
          ) : (
            <span>Submit Data</span>
          )}
        </button>
      </form>
    </div>
  );
};

export default FormFrame;