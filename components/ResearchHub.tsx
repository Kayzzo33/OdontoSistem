import React, { useState } from 'react';
import { searchMedicalInfo } from '../services/geminiService';
import ReactMarkdown from 'react-markdown'; // Assuming basic markdown support wanted, but native support is simpler. I'll use simple rendering.

const ResearchHub: React.FC = () => {
  const [query, setQuery] = useState('');
  const [result, setResult] = useState<{ text: string; sources: any[] } | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    setResult(null);
    try {
      const response = await searchMedicalInfo(query);
      setResult(response);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto min-h-screen">
      <div className="mb-8 text-center">
        <h2 className="text-3xl font-bold text-gray-800 mb-2">Clinical Research Hub</h2>
        <p className="text-gray-600">Access real-time medical data powered by Google Search Grounding</p>
      </div>

      <form onSubmit={handleSearch} className="mb-8 relative">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="e.g., 'Latest protocols for antibiotic prophylaxis in dentistry 2024'"
          className="w-full p-4 pr-12 rounded-full border border-gray-300 shadow-sm focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none text-gray-700 transition-shadow"
        />
        <button 
          type="submit" 
          disabled={loading}
          className="absolute right-2 top-2 p-2 bg-teal-600 text-white rounded-full hover:bg-teal-700 transition-colors disabled:opacity-50"
        >
          {loading ? (
             <svg className="animate-spin w-6 h-6" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/></svg>
          ) : (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          )}
        </button>
      </form>

      {result && (
        <div className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden animate-fade-in">
          <div className="p-8">
             <div className="prose max-w-none text-gray-800 leading-relaxed whitespace-pre-line">
                {result.text}
             </div>
          </div>
          
          {result.sources.length > 0 && (
            <div className="bg-gray-50 px-8 py-4 border-t border-gray-200">
              <h4 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">Sources & References</h4>
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {result.sources.map((source, idx) => (
                  <li key={idx}>
                    <a 
                      href={source.uri} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-center space-x-2 text-sm text-teal-700 hover:text-teal-900 truncate"
                    >
                      <span className="w-1.5 h-1.5 bg-teal-500 rounded-full flex-shrink-0"></span>
                      <span className="truncate">{source.title || source.uri}</span>
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ResearchHub;
