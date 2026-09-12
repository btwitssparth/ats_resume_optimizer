import { useState, useRef } from "react";
import { Upload, FileText, Briefcase } from "lucide-react";
import { motion } from "framer-motion";

interface UploadFormProps {
  onAnalyze: (file: File, jobDescription: string, jobTitle: string, company: string) => Promise<void>;
  loading: boolean;
}

export default function UploadForm({ onAnalyze, loading }: UploadFormProps) {
  const [file, setFile] = useState<File | null>(null);
  const [jobDescription, setJobDescription] = useState("");
  const [jobTitle, setJobTitle] = useState("");
  const [company, setCompany] = useState("");
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFile(e.dataTransfer.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file || !jobDescription || !jobTitle) return;
    await onAnalyze(file, jobDescription, jobTitle, company);
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
      <div className="mb-6">
        <label className="block text-sm font-medium text-slate-700 mb-2">Upload Resume (PDF)</label>
        <div 
          className={`relative border-2 border-dashed rounded-xl p-8 text-center transition-colors ${
            dragActive ? "border-indigo-500 bg-indigo-50" : "border-slate-300 bg-slate-50 hover:bg-slate-100"
          }`}
          onDragEnter={handleDrag} onDragLeave={handleDrag} onDragOver={handleDrag} onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
        >
          <input 
            ref={fileInputRef} type="file" accept=".pdf" className="hidden" 
            onChange={(e) => e.target.files && setFile(e.target.files[0])} 
          />
          <Upload className={`w-8 h-8 mx-auto mb-3 ${dragActive ? "text-indigo-600" : "text-slate-400"}`} />
          {file ? (
            <div className="text-sm font-medium text-indigo-600 bg-indigo-50 py-1 px-3 rounded-full inline-flex items-center gap-2">
              <FileText className="w-4 h-4" /> {file.name}
            </div>
          ) : (
            <div>
              <p className="text-sm font-medium text-slate-700">Click to upload or drag and drop</p>
              <p className="text-xs text-slate-500 mt-1">PDF up to 5MB</p>
            </div>
          )}
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 mb-4">
        <div className="flex-1">
          <label className="block text-sm font-medium text-slate-700 mb-2">Job Title *</label>
          <input 
            type="text" 
            value={jobTitle} 
            onChange={(e) => setJobTitle(e.target.value)} 
            required
            className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-indigo-500 outline-none transition-all text-sm"
            placeholder="e.g. Senior Frontend Engineer"
          />
        </div>
        <div className="flex-1">
          <label className="block text-sm font-medium text-slate-700 mb-2">Company</label>
          <input 
            type="text" 
            value={company} 
            onChange={(e) => setCompany(e.target.value)} 
            className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-indigo-500 outline-none transition-all text-sm"
            placeholder="e.g. Google"
          />
        </div>
      </div>

      <div className="mb-6">
        <label className="block text-sm font-medium text-slate-700 mb-2 flex items-center gap-2">
          <Briefcase className="w-4 h-4 text-slate-400" /> Target Job Description *
        </label>
        <textarea 
          value={jobDescription} 
          onChange={(e) => setJobDescription(e.target.value)} 
          required
          className="w-full h-32 px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-indigo-500 outline-none transition-all resize-none text-sm custom-scrollbar"
          placeholder="Paste the full job description here..."
        />
      </div>

      <button 
        type="submit" 
        disabled={!file || !jobDescription || !jobTitle || loading}
        className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-300 disabled:cursor-not-allowed text-white font-semibold py-3 px-4 rounded-xl shadow-sm transition-colors flex justify-center items-center gap-2"
      >
        {loading ? (
          <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: "linear" }} className="w-5 h-5 border-2 border-white border-t-transparent rounded-full" />
        ) : (
          "Analyze Resume"
        )}
      </button>
    </form>
  );
} 