import { motion } from "framer-motion";
import { AlertCircle, CheckSquare, Sparkles, Loader2 } from "lucide-react";

interface AnalysisResultsProps {
  result: any;
  acceptedEdits: string[];
  onToggleEdit: (edit: string) => void;
  onRegenerate: () => Promise<void>;
  isRegenerating: boolean;
}

export default function AnalysisResults({ result, acceptedEdits, onToggleEdit, onRegenerate, isRegenerating }: AnalysisResultsProps) {
  return (
    <motion.div 
      initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.4 }}
      className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200"
    >
      <div className="flex items-center justify-between mb-8 pb-6 border-b border-slate-100">
        <div>
          <h2 className="text-xl font-semibold text-slate-800 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-amber-500" /> AI Insights
          </h2>
          <p className="text-sm text-slate-500 mt-1">Based on the provided job description.</p>
        </div>
        <div className="flex flex-col items-end">
          <span className="text-3xl font-black text-slate-800">{result.overall_score}<span className="text-lg text-slate-400 font-medium">/100</span></span>
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Match Score</span>
        </div>
      </div>
      
      <div className="mb-8">
        <h3 className="font-semibold text-slate-700 mb-3 text-sm flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-rose-500" /> Missing Keywords
        </h3>
        <div className="flex flex-wrap gap-2">
          {result.missing_keywords?.map((kw: string, i: number) => (
            <motion.span 
              initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.05 }}
              key={i} className="bg-rose-50 text-rose-700 px-3 py-1.5 rounded-lg text-sm font-medium border border-rose-100"
            >
              {kw}
            </motion.span>
          ))}
        </div>
      </div>

      <div className="mb-8">
        <h3 className="font-semibold text-slate-700 mb-3 text-sm flex items-center gap-2">
          <CheckSquare className="w-4 h-4 text-emerald-500" /> Suggested Improvements
        </h3>
        <p className="text-xs text-slate-500 mb-4">Select the enhancements you want to apply automatically.</p>
        <div className="space-y-3">
          {result.suggested_edits?.map((edit: string, i: number) => (
            <motion.label 
              initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
              key={i} 
              className={`flex items-start gap-3 p-4 rounded-xl cursor-pointer border-2 transition-all ${acceptedEdits.includes(edit) ? 'bg-indigo-50 border-indigo-600' : 'bg-white border-slate-200 hover:border-slate-300'}`}
            >
              <input 
                type="checkbox" 
                className="mt-1 w-4 h-4 text-indigo-600 rounded border-slate-300 focus:ring-indigo-500 accent-indigo-600"
                checked={acceptedEdits.includes(edit)}
                onChange={() => onToggleEdit(edit)}
              />
              <span className={`text-sm leading-relaxed ${acceptedEdits.includes(edit) ? 'text-indigo-900 font-medium' : 'text-slate-600'}`}>{edit}</span>
            </motion.label>
          ))}
        </div>
      </div>

      <button 
        onClick={onRegenerate}
        disabled={isRegenerating || acceptedEdits.length === 0}
        className={`w-full flex justify-center items-center gap-2 py-3.5 px-4 rounded-xl font-semibold text-white transition-all shadow-sm ${isRegenerating || acceptedEdits.length === 0 ? 'bg-slate-300 text-slate-500 cursor-not-allowed' : 'bg-slate-900 hover:bg-slate-800 hover:shadow-md'}`}
      >
        {isRegenerating ? <Loader2 className="w-5 h-5 animate-spin" /> : <Sparkles className="w-4 h-4" />}
        {isRegenerating ? "Rewriting Resume..." : `Apply ${acceptedEdits.length} Edits & Regenerate`}
      </button>
    </motion.div>
  );
}