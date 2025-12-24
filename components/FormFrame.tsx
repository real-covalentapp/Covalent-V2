
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    const result = await storageService.saveResponse(formData);
    
    if (result.success) {
      setIsSuccess(true);
      setFormData({ name: '', email: '', category: 'General', message: '' });
    } else {
      alert(result.message);
    }
    
    setIsSubmitting(false);
  };

  if (isSuccess) {
    return (
      <div className="max-w-md mx-auto mt-10 p-8 bg-white rounded-3xl border border-gray-100 shadow-2xl text-center">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Submission Received!</h2>
        <p className="text-gray-600 mb-8">Your information has been synced to the cloud and is now visible in the admin dashboard.</p>
        <div className="space-y-4">
          <button
            onClick={() => setIsSuccess(false)}
            className="w-full py-3 px-4 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 transition-colors"
          >
            Submit Another
          </button>
          <button
            onClick={onGoToAdmin}
            className="w-full py-3 px-4 bg-gray-50 text-indigo-600 font-bold rounded-xl hover:bg-gray-100 transition-colors"
          >
            Access Admin Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto py-10">
      <div className="mb-10 text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Cloud Data Entry</h2>
        <p className="text-gray-500">Fill out the form below to transmit your data securely.</p>
      </div>

      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-3xl border border-gray-100 shadow-xl space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700">Full Name</label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50/50 outline-none transition-all"
              placeholder="John Doe"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700">Email Address</label>
            <input
              type="email"
              required
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50/50 outline-none transition-all"
              placeholder="john@example.com"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-semibold text-gray-700">Category</label>
          <select
            value={formData.category}
            onChange={(e) => setFormData({ ...formData, category: e.target.value as any })}
            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50/50 outline-none transition-all appearance-none"
          >
            <option>General</option>
            <option>Sales</option>
            <option>Support</option>
            <option>Feedback</option>
          </select>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-semibold text-gray-700">Your Message</label>
          <textarea
            required
            rows={5}
            value={formData.message}
            onChange={(e) => setFormData({ ...formData, message: e.target.value })}
            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50/50 outline-none transition-all resize-none"
            placeholder="How can we help you?"
          />
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className={`w-full py-4 px-6 rounded-2xl bg-indigo-600 text-white font-bold text-lg shadow-lg shadow-indigo-100 transition-all active:scale-[0.98] ${
            isSubmitting ? 'opacity-70 cursor-not-allowed' : 'hover:bg-indigo-700'
          }`}
        >
          {isSubmitting ? (
            <div className="flex items-center justify-center">
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Syncing to Cloud...
            </div>
          ) : (
            'Transmit Securely'
          )}
        </button>
      </form>
    </div>
  );
};

export default FormFrame;
