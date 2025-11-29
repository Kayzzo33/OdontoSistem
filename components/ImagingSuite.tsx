import React, { useState, useRef } from 'react';
import { editDentalImage } from '../services/geminiService';

const ImagingSuite: React.FC = () => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [prompt, setPrompt] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result as string);
        setGeneratedImage(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleEdit = async () => {
    if (!selectedImage || !prompt) return;

    setIsProcessing(true);
    try {
      const result = await editDentalImage(selectedImage, prompt);
      if (result) {
        setGeneratedImage(result);
      }
    } catch (error) {
      alert("Failed to edit image. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto h-[calc(100vh-64px)] flex flex-col">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800">AI Imaging Suite</h2>
        <p className="text-gray-600">Visualize aesthetic changes or enhance radiographs using Gemini Vision.</p>
      </div>

      <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-6 min-h-0">
        {/* Controls */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 h-fit">
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">1. Upload Patient Image</label>
            <div 
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:bg-gray-50 cursor-pointer transition-colors"
            >
              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleImageUpload} 
                className="hidden" 
                accept="image/*"
              />
              <span className="text-gray-500 text-sm">Click to upload photo or X-Ray</span>
            </div>
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">2. Describe Enhancement</label>
            <textarea
              className="w-full border border-gray-300 rounded-lg p-3 text-sm focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none resize-none h-32"
              placeholder="E.g., 'Make the teeth whiter', 'Simulate porcelain veneers on the front teeth', 'Highlight the cavity in red'"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
            />
          </div>

          <button
            onClick={handleEdit}
            disabled={!selectedImage || !prompt || isProcessing}
            className={`w-full py-3 px-4 rounded-lg text-white font-medium shadow-md transition-all ${
              !selectedImage || !prompt || isProcessing
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-teal-600 hover:bg-teal-700 active:scale-[0.98]'
            }`}
          >
            {isProcessing ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Processing...
              </span>
            ) : (
              'Generate Preview'
            )}
          </button>
        </div>

        {/* Canvas Area */}
        <div className="lg:col-span-2 flex flex-col gap-4 overflow-y-auto">
           {selectedImage ? (
             <div className="grid grid-cols-1 md:grid-cols-2 gap-4 h-full">
                {/* Original */}
                <div className="bg-gray-100 rounded-xl overflow-hidden relative group">
                  <img src={selectedImage} alt="Original" className="w-full h-full object-cover" />
                  <div className="absolute top-2 left-2 bg-black/60 text-white text-xs px-2 py-1 rounded">Original</div>
                </div>

                {/* Generated */}
                <div className="bg-gray-100 rounded-xl overflow-hidden relative flex items-center justify-center border-2 border-dashed border-gray-200">
                  {generatedImage ? (
                    <>
                      <img src={generatedImage} alt="AI Result" className="w-full h-full object-cover" />
                      <div className="absolute top-2 left-2 bg-teal-600/90 text-white text-xs px-2 py-1 rounded shadow-sm">AI Enhanced</div>
                    </>
                  ) : (
                    <div className="text-gray-400 text-sm p-4 text-center">
                      AI Generated result will appear here
                    </div>
                  )}
                </div>
             </div>
           ) : (
             <div className="h-full bg-gray-50 rounded-xl border-2 border-dashed border-gray-300 flex items-center justify-center flex-col p-10 text-gray-400">
                <svg className="w-16 h-16 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <p>Upload an image to start editing</p>
             </div>
           )}
        </div>
      </div>
    </div>
  );
};

export default ImagingSuite;
