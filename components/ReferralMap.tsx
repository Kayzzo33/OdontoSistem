import React, { useState, useEffect } from 'react';
import { findLocations } from '../services/geminiService';

const ReferralMap: React.FC = () => {
  const [query, setQuery] = useState('');
  const [responseHtml, setResponseHtml] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [location, setLocation] = useState<{ lat: number; lng: number } | undefined>(undefined);
  const [locError, setLocError] = useState<string | null>(null);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
        },
        (error) => {
          setLocError("Location access denied. Results may not be nearby.");
          // Default to San Francisco for demo if denied
          setLocation({ lat: 37.7749, lng: -122.4194 });
        }
      );
    }
  }, []);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const result = await findLocations(query, location);
      setResponseHtml(result.text);
    } catch (e) {
      console.error(e);
      setResponseHtml("Error finding locations.");
    } finally {
      setLoading(false);
    }
  };

  // Function to convert basic markdown links to anchor tags safely for the demo
  const renderContent = (content: string) => {
    // Very basic replacement to make links clickable in the demo
    // In production, use a robust Markdown renderer like react-markdown
    const processed = content.replace(
      /\[([^\]]+)\]\(([^)]+)\)/g, 
      '<a href="$2" target="_blank" class="text-teal-600 font-medium underline hover:text-teal-800">$1</a>'
    );
    return { __html: processed };
  };

  return (
    <div className="p-6 max-w-4xl mx-auto h-[calc(100vh-64px)] flex flex-col">
      <div className="mb-6">
         <h2 className="text-2xl font-bold text-gray-800">Referral Network</h2>
         <p className="text-gray-600">Find nearby specialists, pharmacies, or labs using Maps Grounding.</p>
         {locError && <p className="text-amber-600 text-xs mt-1">{locError}</p>}
      </div>

      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 flex-1 flex flex-col">
        <form onSubmit={handleSearch} className="flex gap-2 mb-6">
          <input 
            type="text" 
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="e.g. 'Endodontists near me' or '24h Pharmacies'"
            className="flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-teal-500 outline-none"
          />
          <button 
            type="submit" 
            disabled={loading}
            className="bg-teal-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-teal-700 disabled:opacity-50"
          >
            {loading ? 'Searching...' : 'Find'}
          </button>
        </form>

        <div className="flex-1 overflow-y-auto bg-gray-50 rounded-lg p-6 border border-gray-200">
           {responseHtml ? (
             <div 
                className="prose prose-teal max-w-none text-gray-800"
                dangerouslySetInnerHTML={renderContent(responseHtml)}
             />
           ) : (
             <div className="h-full flex flex-col items-center justify-center text-gray-400">
               <svg className="w-12 h-12 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
               </svg>
               <p>Enter a query to find locations on the map</p>
             </div>
           )}
        </div>
      </div>
    </div>
  );
};

export default ReferralMap;
