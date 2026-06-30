import React, { useState, useRef } from 'react';

export const PdfUploadComponent: React.FC = () => {
  const [dragActive, setDragActive] = useState<boolean>(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Handle drag events
  const handleDrag = (e: React.DragEvent<HTMLDivElement>): void => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  // Handle drop event
  const handleDrop = (e: React.DragEvent<HTMLDivElement>): void => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (file.type === "application/pdf") {
        setSelectedFile(file);
      } else {
        alert("Please upload a valid PDF file.");
      }
    }
  };

  // Handle manual file selection
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.type === "application/pdf") {
        setSelectedFile(file);
      } else {
        alert("Please upload a valid PDF file.");
      }
    }
  };

  // Trigger hidden input click
  const onButtonClick = (): void => {
    if (inputRef.current) {
      inputRef.current.click();
    }
  };

  return (
    <div className="flex flex-col items-center justify-center w-full max-w-md p-6 bg-[#1A1A1A] rounded-lg border border-gray-800 font-sans text-gray-300">
      <div className="mb-4 text-left w-full">
        <h3 className="text-lg font-semibold text-white">Upload Policy Document</h3>
        <p className="text-sm text-gray-400 mt-1">Please upload the updated PDF for this policy.</p>
      </div>

      <div 
        className={`w-full p-8 border-2 border-dashed rounded-lg flex flex-col items-center justify-center transition-colors ${
          dragActive ? "border-[#00E676] bg-[#00E676]/10" : "border-gray-600 bg-[#242424]"
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <svg className="w-10 h-10 mb-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path>
        </svg>
        
        {selectedFile ? (
          <p className="text-sm font-medium text-[#00E676]">{selectedFile.name}</p>
        ) : (
          <>
            <p className="mb-2 text-sm text-gray-400">
              <span className="font-semibold text-white">Click to upload</span> or drag and drop
            </p>
            <p className="text-xs text-gray-500">PDF only (MAX. 10MB)</p>
          </>
        )}

        <input 
          ref={inputRef}
          type="file" 
          className="hidden" 
          accept="application/pdf"
          onChange={handleChange}
        />
      </div>

      <div className="w-full flex justify-end mt-6 gap-3">
        <button 
          className="px-4 py-2 text-sm font-medium text-gray-300 bg-transparent border border-gray-600 rounded-md hover:bg-gray-800 transition-colors"
          onClick={() => setSelectedFile(null)}
        >
          Cancel
        </button>
        <button 
          className="px-4 py-2 text-sm font-medium text-black bg-[#00E676] rounded-md hover:bg-[#00c565] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          onClick={onButtonClick}
          disabled={!!selectedFile}
        >
          {selectedFile ? 'File Selected' : 'Select PDF'}
        </button>
      </div>
    </div>
  );
};

export default PdfUploadComponent;