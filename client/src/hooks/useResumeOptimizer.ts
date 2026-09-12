import { useState } from 'react';
import { useAuth } from '@clerk/clerk-react';
import { analyzeResume, regenerateResume, type AnalysisResultDTO } from '../services/api';

export function useResumeOptimizer() {
  const { getToken } = useAuth();
  const [loading, setLoading] = useState(false);
  const [isRegenerating, setIsRegenerating] = useState(false);
  const [result, setResult] = useState<AnalysisResultDTO | null>(null);
  const [acceptedEdits, setAcceptedEdits] = useState<string[]>([]);
  const [regeneratedText, setRegeneratedText] = useState<string | null>(null);

  const handleAnalyze = async (file: File, jobDescription: string, jobTitle: string, company: string) => {
    setLoading(true);
    setResult(null);
    setRegeneratedText(null);
    setAcceptedEdits([]);
    try {
      const token = await getToken();
      if (!token) throw new Error("Authentication required");
      
      const data = await analyzeResume(file, jobDescription, jobTitle, company, token);
      setResult(data);
    } catch (error) {
      console.error("Analysis failed:", error);
    } finally {
      setLoading(false);
    }
  };

  const toggleEdit = (edit: string) => {
    setAcceptedEdits(prev => 
      prev.includes(edit) ? prev.filter(e => e !== edit) : [...prev, edit]
    );
  };

  const handleRegenerate = async () => {
    if (!result) return;
    setIsRegenerating(true);
    try {
      const token = await getToken();
      if (!token) throw new Error("Authentication required");

      const response = await regenerateResume(result.resume_id, acceptedEdits, token);
      setRegeneratedText(response.updated_resume_text);
    } catch (error) {
      console.error("Regeneration failed:", error);
    } finally {
      setIsRegenerating(false);
    }
  };

  const resetRegeneration = () => {
    setRegeneratedText(null);
  };

  return {
    result,
    loading,
    acceptedEdits,
    isRegenerating,
    regeneratedText,
    handleAnalyze,
    handleRegenerate,
    toggleEdit,
    resetRegeneration
  };
}