import React, { useEffect, useState } from 'react';
import { getQuickSummary } from '../services/geminiService';
import { QuickStat } from '../types';

const MOCK_APPOINTMENTS = `
- 09:00 AM: John Doe (Checkup)
- 10:30 AM: Sarah Smith (Root Canal)
- 01:00 PM: Mike Johnson (Cleaning)
- 02:30 PM: Emily Davis (Whitening Consultation)
- 04:00 PM: Robert Wilson (Emergency - Tooth Pain)
`;

const Dashboard: React.FC = () => {
  const [dailySummary, setDailySummary] = useState<string>('Analyzing schedule...');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    const fetchSummary = async () => {
      try {
        const result = await getQuickSummary(
          `Review this dental schedule and give me a very brief, motivating 2-sentence summary for the team morning huddle. Mention the most critical case. Schedule: ${MOCK_APPOINTMENTS}`
        );
        if (isMounted) {
          setDailySummary(result);
          setLoading(false);
        }
      } catch (e) {
        if (isMounted) setLoading(false);
      }
    };
    fetchSummary();
    return () => { isMounted = false; };
  }, []);

  const stats: QuickStat[] = [
    { label: 'Appointments', value: '5', trend: '+2 vs yesterday', color: 'bg-blue-100 text-blue-700' },
    { label: 'Revenue Est.', value: '$3.2k', trend: 'On target', color: 'bg-green-100 text-green-700' },
    { label: 'New Patients', value: '1', trend: '', color: 'bg-purple-100 text-purple-700' },
    { label: 'Inventory Alert', value: 'Gloves', trend: 'Low Stock', color: 'bg-red-100 text-red-700' },
  ];

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">Clinic Dashboard</h2>
        <span className="px-3 py-1 bg-teal-100 text-teal-800 rounded-full text-xs font-semibold">Live System</span>
      </div>

      {/* AI Summary Card - Low Latency */}
      <div className="bg-gradient-to-r from-blue-600 to-teal-500 rounded-2xl p-6 shadow-lg text-white">
        <div className="flex items-center gap-3 mb-2">
          <svg className="w-5 h-5 text-yellow-300" fill="currentColor" viewBox="0 0 20 20">
            <path d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" />
          </svg>
          <h3 className="font-semibold text-lg">Morning Intelligence Brief</h3>
        </div>
        <p className="text-blue-50 leading-relaxed min-h-[3rem]">
          {loading ? (
            <span className="animate-pulse">Generating insights with Gemini Flash Lite...</span>
          ) : (
            dailySummary
          )}
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, idx) => (
          <div key={idx} className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 flex flex-col justify-between">
            <div>
              <p className="text-gray-500 text-sm font-medium">{stat.label}</p>
              <h4 className="text-3xl font-bold text-gray-800 mt-2">{stat.value}</h4>
            </div>
            {stat.trend && (
              <span className={`mt-4 inline-block px-2 py-1 rounded text-xs font-medium self-start ${stat.color}`}>
                {stat.trend}
              </span>
            )}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-bold text-gray-800 mb-4">Today's Schedule</h3>
          <ul className="space-y-3">
            {MOCK_APPOINTMENTS.trim().split('\n').map((appt, i) => (
              <li key={i} className="flex items-center p-3 hover:bg-gray-50 rounded-lg transition-colors border-b border-gray-50 last:border-0">
                <div className="w-2 h-2 rounded-full bg-teal-500 mr-4"></div>
                <span className="text-gray-700">{appt.replace('-', '').trim()}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-bold text-gray-800 mb-4">Pending Tasks</h3>
          <div className="space-y-2">
            <label className="flex items-center space-x-3 cursor-pointer">
              <input type="checkbox" className="form-checkbox h-5 w-5 text-teal-600 rounded" />
              <span className="text-gray-600">Review lab results for Sarah</span>
            </label>
            <label className="flex items-center space-x-3 cursor-pointer">
              <input type="checkbox" className="form-checkbox h-5 w-5 text-teal-600 rounded" />
              <span className="text-gray-600">Approve inventory order</span>
            </label>
            <label className="flex items-center space-x-3 cursor-pointer">
              <input type="checkbox" className="form-checkbox h-5 w-5 text-teal-600 rounded" />
              <span className="text-gray-600">Call back potential lead</span>
            </label>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
