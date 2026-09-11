import { useState } from "react";
import { useAuth } from "@clerk/clerk-react";
import { analyzeResume, regenerateResume } from "../services/api";

export function useResumeOptimizer(preloadScanId?: number) {
  void preloadScanId;
  const { getToken } = useAuth();
  
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [acceptedEdits, setAcceptedEdits] = useState<string[]>([]);
  const [isRegenerating, setIsRegenerating] = useState(false);
  const [regeneratedText, setRegeneratedText] = useState<string | null>(null);

  const handleAnalyze = async (file: File, jobDescription: string) => {
    setLoading(true);
    setResult(null);
    setRegeneratedText(null);
    setAcceptedEdits([]);

    try {
      const token = await getToken();
      if (!token) throw new Error("No auth token available");
      
      const data = await analyzeResume(file, jobDescription, token);
      setResult(data);
    } catch (error) {
      console.error("Upload failed:", error);
      alert("Error analyzing resume. Check console.");
    } finally {
      setLoading(false);
    }
  };

  const handleRegenerate = async () => {
    setIsRegenerating(true);
    try {
      const token = await getToken();
      if (!token) throw new Error("No auth token available");

      const data = await regenerateResume(result.resume_id, acceptedEdits, token);
      setRegeneratedText(data.updated_resume_text);
    } catch (error) {
      console.error("Regeneration failed:", error);
      alert("Failed to regenerate resume.");
    } finally {
      setIsRegenerating(false);
    }
  };

  const toggleEdit = (edit: string) => {
    setAcceptedEdits(prev => prev.includes(edit) ? prev.filter(e => e !== edit) : [...prev, edit]);
  };

  const resetRegeneration = () => {
    setRegeneratedText(null);
    setAcceptedEdits([]);
  };

  return {
    result, loading, acceptedEdits, isRegenerating, regeneratedText,
    handleAnalyze, handleRegenerate, toggleEdit, resetRegeneration
  };
}