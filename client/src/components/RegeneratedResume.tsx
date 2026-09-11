import { motion } from "framer-motion";
import { Download, RefreshCw, CheckCircle2 } from "lucide-react";

interface RegeneratedResumeProps {
  resumeText: string;
  onReset: () => void;
}

export default function RegeneratedResume({ resumeText, onReset }: RegeneratedResumeProps) {
  const handleDownload = () => {
    const blob = new Blob([resumeText], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "Optimized_Resume.txt";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ type: "spring", stiffness: 300, damping: 25 }}
      className="bg-white p-8 rounded-2xl shadow-md border-2 border-indigo-600 relative overflow-hidden"
    >
      <div className="flex items-center gap-3 mb-6">
        <div className="bg-indigo-100 p-2 rounded-full">
          <CheckCircle2 className="w-6 h-6 text-indigo-700" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-slate-800">Optimization Complete</h2>
          <p className="text-sm text-slate-500">Your tailored resume is ready for download.</p>
        </div>
      </div>
      
      <div className="bg-slate-50 p-6 rounded-xl border border-slate-200 mb-6 h-96 overflow-y-auto shadow-inner custom-scrollbar">
        <pre className="text-sm text-slate-700 whitespace-pre-wrap font-sans leading-loose">
          {resumeText}
        </pre>
      </div>
      
      <div className="flex gap-4">
        <button 
          onClick={handleDownload}
          className="flex-1 flex justify-center items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 px-4 rounded-xl shadow-sm transition-colors"
        >
          <Download className="w-4 h-4" /> Download .TXT
        </button>
        <button 
          onClick={onReset}
          className="flex-1 flex justify-center items-center gap-2 bg-white border-2 border-slate-200 hover:bg-slate-50 text-slate-700 font-semibold py-3 px-4 rounded-xl transition-colors"
        >
          <RefreshCw className="w-4 h-4" /> Start Over
        </button>
      </div>
    </motion.div>
  );
}