
import React from 'react';

interface IntroFrameProps {
  onGetStarted: () => void;
}

const IntroFrame: React.FC<IntroFrameProps> = ({ onGetStarted }) => {
  return (
    <div className="max-w-4xl mx-auto text-center py-12 px-4 sm:py-20">
      <div className="inline-block px-4 py-1.5 mb-6 text-sm font-semibold tracking-wide text-indigo-600 uppercase bg-indigo-50 rounded-full">
        Next Generation Data Collection
      </div>
      <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 sm:text-6xl mb-6">
        Sync Your Data to the <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-blue-500">Cloud Instantly</span>
      </h1>
      <p className="max-w-2xl mx-auto text-lg text-gray-600 mb-10 leading-relaxed">
        CloudSubmit Pro provides a seamless bridge between your users and your administration team.
        Real-time syncing, mobile optimization, and secure reporting built for modern teams.
      </p>
      <div className="flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-4">
        <button
          onClick={onGetStarted}
          className="w-full sm:w-auto px-8 py-4 text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl font-bold text-lg shadow-lg shadow-indigo-200 transition-all active:scale-95"
        >
          Get Started Now
        </button>
        <button
          className="w-full sm:w-auto px-8 py-4 text-gray-700 bg-white border border-gray-200 hover:bg-gray-50 rounded-xl font-bold text-lg transition-all"
        >
          View Features
        </button>
      </div>

      <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
        <div className="p-6 bg-white rounded-2xl border border-gray-100 shadow-sm">
          <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
            <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">Real-time Sync</h3>
          <p className="text-gray-500">Your data is pushed to the cloud dashboard the moment a user hits submit.</p>
        </div>
        <div className="p-6 bg-white rounded-2xl border border-gray-100 shadow-sm">
          <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mb-4">
            <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">Secure Storage</h3>
          <p className="text-gray-500">Industry-standard encryption and password-protected admin access.</p>
        </div>
        <div className="p-6 bg-white rounded-2xl border border-gray-100 shadow-sm">
          <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
            <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">Detailed Insights</h3>
          <p className="text-gray-500">Track source devices, submission times, and categories with ease.</p>
        </div>
      </div>
    </div>
  );
};

export default IntroFrame;
