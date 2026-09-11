import UploadForm from "../components/UploadForm";
import AnalysisResults from "../components/AnalysisResults";
import RegeneratedResume from "../components/RegeneratedResume";
import { useResumeOptimizer } from "../hooks/useResumeOptimizer";
import { Sparkles } from "lucide-react";

export default function Dashboard() {
  // Use our custom hook to get all state and actions
  const { 
    result, loading, acceptedEdits, isRegenerating, regeneratedText, 
    handleAnalyze, handleRegenerate, toggleEdit, resetRegeneration 
  } = useResumeOptimizer();

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
      <UploadForm onAnalyze={handleAnalyze} loading={loading} />

      <div className="space-y-8">
        {result && !regeneratedText && (
          <AnalysisResults 
            result={result} 
            acceptedEdits={acceptedEdits} 
            onToggleEdit={toggleEdit} 
            onRegenerate={handleRegenerate} 
            isRegenerating={isRegenerating} 
          />
        )}

        {regeneratedText && (
          <RegeneratedResume 
            resumeText={regeneratedText} 
            onReset={resetRegeneration} 
          />
        )}

        {!result && !loading && !regeneratedText && (
          <div className="bg-slate-100 border-2 border-dashed border-slate-200 rounded-2xl h-full min-h-[400px] flex flex-col items-center justify-center text-slate-400 p-8 text-center">
            <Sparkles className="w-12 h-12 mb-4 opacity-50" />
            <p className="font-medium text-slate-500">Awaiting your documents</p>
            <p className="text-sm mt-2">Upload a resume and job description to see AI insights appear here.</p>
          </div>
        )}
      </div>
    </div>
  );
}