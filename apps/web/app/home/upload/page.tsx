"use client";

import React, { useState, useRef, useCallback, useEffect, DragEvent, ChangeEvent } from "react";

interface SelectedFile {
  file: File;
  name: string;
  size: string;
}

type UploadState = "idle" | "selected" | "uploading" | "done" | "error";

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

const MAX_SIZE = 10 * 1024 * 1024; // 10 MB

const DesktopPdfUpload: React.FC = () => {
  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState<SelectedFile | null>(null);
  const [uploadState, setUploadState] = useState<UploadState>("idle");
  const [progress, setProgress] = useState(0);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const progressRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    return () => {
      if (progressRef.current) clearInterval(progressRef.current);
    };
  }, []);

  const validateAndSet = useCallback((file: File) => {
    setErrorMsg(null);
    if (file.type !== "application/pdf") {
      setErrorMsg("Only PDF files are accepted.");
      return;
    }
    if (file.size > MAX_SIZE) {
      setErrorMsg("File exceeds the 10 MB limit.");
      return;
    }
    setSelectedFile({ file, name: file.name, size: formatBytes(file.size) });
    setUploadState("selected");
    setProgress(0);
  }, []);

  const handleDrag = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(e.type === "dragenter" || e.type === "dragover");
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    

    if (uploadState === "uploading" || uploadState === "done") return;
    
    const file = e.dataTransfer.files?.[0];
    if (file) validateAndSet(file);
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) validateAndSet(file);
  };

  const handleClear = () => {
    if (progressRef.current) clearInterval(progressRef.current);
    setSelectedFile(null);
    setUploadState("idle");
    setProgress(0);
    setErrorMsg(null);
    if (inputRef.current) inputRef.current.value = "";
  };

  const handleUpload = async () => {
   if(!selectedFile || uploadState !== "selected") return;
   setUploadState("uploading");
   setProgress(0);

   const formData = new FormData();;
    formData.append('file', selectedFile.file);
    await new Promise<void>((resolve,reject)=>{
      const xhr = new XMLHttpRequest();
      xhr.upload.addEventListener("progress", (e)=>{
        if(e.lengthComputable){
          const pct = Math.round((e.loaded / e.total)* 100);
          setProgress(pct)
        }
      });

      xhr.addEventListener("load",()=>{
        if(xhr.status >= 200 && xhr.status < 300){
          setProgress(100);
          setUploadState("done");
          resolve();
        }else{
          setErrorMsg(`upload failed with ${xhr.status} ${xhr.statusText}`);
          setUploadState("error");
          reject();
        }
      });

      xhr.addEventListener('error', ()=>{
        setErrorMsg("Network Error - Uplaod failed");
        setUploadState("error");
        reject();
      });
      xhr.addEventListener("abort", ()=>{
        setUploadState("selected");
        setProgress(0)
        reject();
      })
      xhr.open("POST","https://elysia-on-cloudflare.ranjitdas2048.workers.dev/uplaod-pdf" );
      xhr.send(formData)
    });


  };

  const isSelected = uploadState === "selected";
  const isUploading = uploadState === "uploading";
  const isDone = uploadState === "done";

  return (
    <div className="min-h-screen bg-[#0A0A0C] flex items-center justify-center p-8 font-sans antialiased selection:bg-[#00E676]/30">
      <div className="w-full max-w-5xl">
        <div className="mb-6">
          <p className="text-[11px] font-semibold text-neutral-500 uppercase tracking-wider mb-1.5">
            Workspace / Policies & Quizzes
          </p>
          <h1 className="text-2xl font-bold text-white tracking-tight">Upload Policy Document</h1>
        </div>

        
        <div className="bg-[#141416] border border-neutral-800/80 rounded-2xl overflow-hidden shadow-2xl shadow-black/40">
          <div className="flex divide-x divide-neutral-800/80 min-h-[380px]">

            <div className="flex-1 p-8 flex flex-col justify-between gap-8">
              <div>
                <p className="text-sm text-neutral-400 leading-relaxed">
                  Attach your updated company documentation below. The file contents will instantly version change logs, sync with active workflows, and issue alerts across integrated systems.
                </p>

             
                <ul className="mt-6 space-y-3">
                  {[
                    { label: "Strictly PDF format configuration", path: "M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" },
                    { label: "Strict maximum ceiling threshold of 10 MB", path: "M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5" },
                    { label: "End-to-end AES-256 payload encryption", path: "M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" }
                  ].map((item, idx) => (
                    <li key={idx} className="flex items-center gap-3 text-xs text-neutral-400">
                      <svg className="w-4 h-4 text-neutral-600 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d={item.path} />
                      </svg>
                      {item.label}
                    </li>
                  ))}
                </ul>
              </div>

              {selectedFile && (
                <div className="border border-neutral-800 bg-[#1A1A1E] rounded-xl p-4 shadow-inner transition-all duration-300">
                  <div className="flex items-start gap-3.5">
                    <div className="w-10 h-10 rounded-lg bg-red-500/10 flex items-center justify-center flex-shrink-0 border border-red-500/10">
                      <svg className="w-5 h-5 text-red-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                      </svg>
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <p className="text-sm font-semibold text-neutral-200 truncate">
                          {selectedFile.name}
                        </p>
                        <p className="text-xs font-mono text-neutral-500 flex-shrink-0">
                          {selectedFile.size}
                        </p>
                      </div>

      
                      <div className="mt-3 h-1.5 bg-neutral-800 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all duration-300 ease-out ${
                            isDone ? "bg-[#00E676]" : "bg-[#00E676]"
                          }`}
                          style={{ width: `${progress}%`, boxShadow: isUploading ? '0 0 8px #00E676' : 'none' }}
                        />
                      </div>
                      
                      <div className="flex items-center justify-between mt-2">
                        <p className="text-xs font-medium text-neutral-400">
                          {isDone ? "Document synced successfully" : isUploading ? "Streaming blocks to server..." : "Staged payload ready"}
                        </p>
                        <p className="text-xs font-semibold text-neutral-300">
                          {isDone ? "100%" : isUploading ? `${progress}%` : "Pending"}
                        </p>
                      </div>
                    </div>

         
                    {!isUploading && !isDone && (
                      <button
                        onClick={handleClear}
                        aria-label="Purge file staging"
                        className="text-neutral-500 hover:text-red-400 transition-colors p-1 hover:bg-white/5 rounded-md"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    )}
                  </div>
                </div>
              )}

 
              {errorMsg && (
                <div className="flex items-center gap-2.5 text-xs font-medium text-red-400 bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3 animate-headShake">
                  <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                  {errorMsg}
                </div>
              )}


              <div className="flex gap-3 mt-auto">
                <button
                  onClick={handleClear}
                  disabled={isUploading}
                  className="flex-1 py-2.5 text-xs font-bold uppercase tracking-wider text-neutral-400 border border-neutral-800 rounded-xl hover:bg-neutral-900 hover:text-white transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  Cancel
                </button>
                <button
                  onClick={handleUpload}
                  disabled={!isSelected || isUploading || isDone}
                  className={`flex-[2] py-2.5 text-xs font-bold uppercase tracking-wider rounded-xl flex items-center justify-center gap-2 transition-all shadow-lg ${
                    isDone
                      ? "bg-[#00E676]/10 text-[#00E676] border border-[#00E676]/20 shadow-none cursor-default"
                      : isSelected
                      ? "bg-[#00E676] text-black hover:bg-[#15ffa0] hover:shadow-[#00E676]/10"
                      : "bg-neutral-800/40 text-neutral-600 border border-neutral-800/20 cursor-not-allowed shadow-none"
                  }`}
                >
                  {isDone ? (
                    <>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                      Success
                    </>
                  ) : isUploading ? (
                    <>
                      <svg className="animate-spin w-4 h-4 text-black" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                      </svg>
                      Processing
                    </>
                  ) : (
                    <>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                      </svg>
                      Execute Upload
                    </>
                  )}
                </button>
              </div>
            </div>

       
            <div className="w-90 flex-shrink-0 p-8 flex flex-col items-stretch justify-center bg-[#18181B]/40">
              <input
                ref={inputRef}
                type="file"
                accept="application/pdf"
                className="hidden"
                onChange={handleChange}
                disabled={isUploading || isDone}
              />
              <div
                role="button"
                tabIndex={isUploading || isDone ? -1 : 0}
                aria-label="Drop terminal area. Target workspace for binary PDF documents."
                onKeyDown={(e) => {
                  if ((e.key === "Enter" || e.key === " ") && !isUploading && !isDone) {
                    inputRef.current?.click();
                  }
                }}
                onClick={() => {
                  if (!isUploading && !isDone) inputRef.current?.click();
                }}
                onDragEnter={handleDrag}
                onDragOver={handleDrag}
                onDragLeave={handleDrag}
                onDrop={handleDrop}
                className={`
                  w-full h-full min-h-[280px] rounded-2xl border border-dashed
                  flex flex-col items-center justify-center gap-4 text-center px-6
                  transition-all duration-200 select-none
                  ${isUploading ? "cursor-not-allowed border-neutral-800 bg-neutral-900/10 opacity-50" : ""}
                  ${dragActive
                    ? "border-[#00E676] bg-[#00E676]/5 scale-[1.01] shadow-xl shadow-[#00E676]/5"
                    : isDone
                    ? "border-[#00E676]/30 bg-[#00E676]/5 cursor-default"
                    : isUploading 
                    ? ""
                    : "border-neutral-800 hover:border-neutral-700 bg-[#161618]/50 hover:bg-[#1A1A1E] cursor-pointer"
                  }
                `}
              >
                {isDone ? (
                  <>
                    <div className="w-12 h-12 rounded-full bg-[#00E676]/10 flex items-center justify-center border border-[#00E676]/20">
                      <svg className="w-6 h-6 text-[#00E676]" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-white">Upload Confirmed</p>
                      <p className="text-xs text-neutral-500 mt-1">Instance version generated</p>
                    </div>
                    <button
                      onClick={(e) => { e.stopPropagation(); handleClear(); }}
                      className="text-xs text-[#00E676] hover:text-[#2eff95] font-medium transition-colors underline underline-offset-4"
                    >
                      Stage another asset
                    </button>
                  </>
                ) : (
                  <>
                    <div
                      className={`w-12 h-12 rounded-xl flex items-center justify-center border transition-all duration-200 ${
                        dragActive 
                          ? "bg-[#00E676]/10 border-[#00E676]/30 text-[#00E676]" 
                          : "bg-neutral-900 border-neutral-800 text-neutral-400"
                      }`}
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-neutral-200 tracking-tight">
                        {dragActive ? "Release item here" : "Drop PDF configuration"}
                      </p>
                      <p className="text-xs text-neutral-500 mt-1">or click to scan files</p>
                    </div>
                    <div className="flex gap-1.5 mt-1">
                      <span className="text-[10px] font-bold tracking-wider uppercase px-2 py-0.5 rounded bg-neutral-900 text-neutral-400 border border-neutral-800 font-mono">
                        PDF
                      </span>
                      <span className="text-[10px] font-bold tracking-wider uppercase px-2 py-0.5 rounded bg-neutral-900 text-neutral-400 border border-neutral-800 font-mono">
                        &lt; 10MB
                      </span>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default DesktopPdfUpload;