import { useState } from "react";
import { motion } from "framer-motion";
import { UploadCloud, FileType, Briefcase, Loader2 } from "lucide-react";

interface UploadFormProps {
  onAnalyze: (file: File, jobDescription: string) => Promise<void>;
  loading: boolean;
}

export default function UploadForm({ onAnalyze, loading }: UploadFormProps) {
  const [file, setFile] = useState<File | null>(null);
  const [jobDescription, setJobDescription] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!file || !jobDescription) return alert("Please provide both a resume and a job description.");
    onAnalyze(file, jobDescription);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}
      className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200 h-fit"
    >
      <h2 className="text-xl font-semibold mb-6 text-slate-800 flex items-center gap-2">
        <UploadCloud className="w-5 h-5 text-indigo-600" /> New Analysis
      </h2>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="flex items-center gap-2 text-sm font-medium text-slate-700 mb-2">
            <FileType className="w-4 h-4 text-slate-400" /> Upload Resume (PDF)
          </label>
          <div className="relative border-2 border-dashed border-slate-300 rounded-xl p-4 hover:border-indigo-400 transition-colors bg-slate-50">
            <input 
              type="file" accept="application/pdf"
              onChange={(e) => setFile(e.target.files ? e.target.files[0] : null)}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" 
            />
            <div className="text-center pointer-events-none">
              <span className="text-sm text-indigo-600 font-medium bg-indigo-50 px-3 py-1 rounded-md">
                {file ? file.name : "Click or drag file to upload"}
              </span>
            </div>
          </div>
        </div>
        
        <div>
          <label className="flex items-center gap-2 text-sm font-medium text-slate-700 mb-2">
            <Briefcase className="w-4 h-4 text-slate-400" /> Target Job Description
          </label>
          <textarea 
            rows={5} 
            className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 focus:bg-white outline-none transition-all resize-none text-sm text-slate-700 placeholder:text-slate-400"
            placeholder="Paste the job description here..."
            value={jobDescription}
            onChange={(e) => setJobDescription(e.target.value)}
          />
        </div>

        <button 
          type="submit" disabled={loading}
          className={`w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-semibold text-white transition-all shadow-sm ${loading ? 'bg-indigo-400 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700 hover:shadow-md'}`}
        >
          {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Analyze Document"}
        </button>
      </form>
    </motion.div>
  );
}