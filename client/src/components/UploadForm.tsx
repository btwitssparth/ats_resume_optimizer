import { useState, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  UploadCloud,
  FileType,
  Briefcase,
  Loader2,
  CheckCircle2,
  X,
  FileUp,
  AlertTriangle,
} from "lucide-react";

interface UploadFormProps {
  onAnalyze: (file: File, jobDescription: string) => Promise<void>;
  loading: boolean;
}

export default function UploadForm({ onAnalyze, loading }: UploadFormProps) {
  const [file, setFile] = useState<File | null>(null);
  const [jobDescription, setJobDescription] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const charCount = jobDescription.length;

  const handleFile = useCallback(
    (f: File | null) => {
      if (!f) return;
      if (f.type !== "application/pdf") {
        setError("Please upload a PDF file.");
        return;
      }
      setFile(f);
      setError(null);
    },
    []
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!file && !jobDescription) {
      setError("Please provide both a resume and a job description.");
      return;
    }
    if (!file) {
      setError("Please upload your resume (PDF).");
      return;
    }
    if (!jobDescription.trim()) {
      setError("Please paste the target job description.");
      return;
    }

    await onAnalyze(file, jobDescription.trim());
  };

  const removeFile = (e: React.MouseEvent) => {
    e.stopPropagation();
    setFile(null);
    if (inputRef.current) inputRef.current.value = "";
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
      className="bg-[#141416] p-6 sm:p-7 lg:p-8 rounded-2xl border border border-[#23232a] h-fit"
    >
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-[15px] font-semibold text-[#f5f5f7] flex items-center gap-2 tracking-tight">
          <span className="inline-flex items-center justify-center w-7 h-7 rounded-lg bg-[#17192a] border border-[#282c44]">
            <UploadCloud className="w-3.5 h-3.5 text-[#5b8def]" />
          </span>
          New Analysis
        </h2>
        <span className="text-[11px] text-[#565b66] font-medium uppercase tracking-wider">
          Step 1
        </span>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="flex items-center gap-1.5 text-xs font-medium text-[#8a8f98] mb-2 uppercase tracking-wider">
            <FileType className="w-3.5 h-3.5 text-[#565b66]" /> Resume
            <span className="normal-case text-[11px] text-[#565b66] tracking-normal ml-1">
              · PDF only
            </span>
          </label>

          <motion.div
            whileHover={
              !file && !loading
                ? {
                    borderColor: "#3a5aa6",
                    backgroundColor: "#10121e",
                  }
                : {}
            }
            onDragOver={(e) => {
              e.preventDefault();
              if (!loading) setIsDragging(true);
            }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={(e) => {
              e.preventDefault();
              setIsDragging(false);
              if (loading) return;
              const dropped = e.dataTransfer.files?.[0];
              handleFile(dropped || null);
            }}
            className={`relative rounded-xl transition-all duration-200 border-2 ${
              isDragging
                ? "border-[#5b8def] bg-[#10121e]"
                : file
                ? "border-[#2d4a86] bg-[#0f111c]"
                : "border-dashed border-[#25252e] bg-[#101013]"
            }`}
          >
            <input
              ref={inputRef}
              type="file"
              accept="application/pdf"
              disabled={loading}
              onChange={(e) =>
                handleFile(e.target.files ? e.target.files[0] : null)
              }
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed z-10"
            />

            <AnimatePresence mode="wait">
              {!file ? (
                <motion.div
                  key="empty-file"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="pointer-events-none p-6 sm:p-7 text-center"
                >
                  <div className="w-11 h-11 rounded-xl bg-[#15171f] border border-[#232633] flex items-center justify-center mx-auto mb-3">
                    <FileUp
                      className={`w-5 h-5 transition-colors ${
                        isDragging ? "text-[#5b8def]" : "text-[#565b66]"
                      }`}
                      strokeWidth={1.75}
                    />
                  </div>
                  <p
                    className={`text-sm font-medium transition-colors ${
                      isDragging ? "text-[#7a9bff]" : "text-[#a8acb6]"
                    }`}
                  >
                    {isDragging ? "Drop file here" : "Click or drag file to upload"}
                  </p>
                  <p className="text-xs text-[#565b66] mt-1">
                    {isDragging ? "Release to attach your PDF" : "Accepts a single PDF file"}
                  </p>
                </motion.div>
              ) : (
                <motion.div
                  key="has-file"
                  initial={{ opacity: 0, scale: 0.97 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.97 }}
                  transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
                  className="pointer-events-none p-4 sm:p-5 flex items-center gap-3.5"
                >
                  <div className="flex-shrink-0 w-11 h-11 rounded-xl bg-[#17192a] border border-[#282c44] flex items-center justify-center">
                    <FileType className="w-5 h-5 text-[#5b8def]" strokeWidth={1.75} />
                  </div>
                  <div className="flex-1 min-w-0 text-left">
                    <p className="text-sm font-medium text-[#e4e6eb] truncate">
                      {file.name}
                    </p>
                    <p className="text-xs text-[#6b7280] mt-0.5 font-mono">
                      {(file.size / 1024).toFixed(1)} KB
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={removeFile}
                    className="pointer-events-auto flex-shrink-0 w-8 h-8 rounded-lg bg-[#171920] hover:bg-[#1f212b] border border-[#272a33] text-[#8a8f98] hover:text-[#e4e6eb] flex items-center justify-center transition-colors z-20"
                    aria-label="Remove file"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="flex items-center gap-1.5 text-xs font-medium text-[#8a8f98] uppercase tracking-wider">
              <Briefcase className="w-3.5 h-3.5 text-[#565b66]" /> Job
              Description
            </label>
            <span
              className={`text-[11px] font-mono transition-colors ${
                charCount > 0 ? "text-[#565b66]" : "text-[#3f434c]"
              }`}
            >
              {charCount}
            </span>
          </div>
          <textarea
            rows={6}
            disabled={loading}
            className="w-full p-4 bg-[#101013] border border-[#23232a] rounded-xl focus:ring-2 focus:ring-[#4f7df6]/40 focus:border-[#4f7df6] focus:bg-[#101013] outline-none transition-all duration-200 resize-none text-sm text-[#d8dbe3] placeholder:text-[#3f434c] disabled:opacity-60 disabled:cursor-not-allowed leading-relaxed"
            placeholder="Paste the full job description here. Include the responsibilities, requirements, and any preferred qualifications."
            value={jobDescription}
            onChange={(e) => {
              setJobDescription(e.target.value);
              if (error) setError(null);
            }}
          />
        </div>

        <AnimatePresence mode="wait">
          {error && (
            <motion.div
              initial={{ opacity: 0, height: 0, marginBottom: 0 }}
              animate={{ opacity: 1, height: "auto", marginBottom: -2 }}
              exit={{ opacity: 0, height: 0, marginBottom: 0 }}
              transition={{ duration: 0.2 }}
              className="flex items-start gap-2 px-3.5 py-2.5 rounded-xl bg-[#2a1517] border border-[#54272c] text-[13px] text-[#ff9898]"
            >
              <AlertTriangle className="w-3.5 h-3.5 mt-0.5 flex-shrink-0" />
              <span className="leading-snug">{error}</span>
            </motion.div>
          )}
        </AnimatePresence>

        <motion.button
          type="submit"
          disabled={loading}
          whileHover={!loading ? { y: -1 } : {}}
          whileTap={!loading ? { scale: 0.985 } : {}}
          transition={{ duration: 0.15, ease: [0.22, 1, 0.36, 1] }}
          className={`w-full flex items-center justify-center gap-2 py-3.5 px-4 rounded-xl font-semibold text-[14.5px] text-white transition-all duration-200 border border-transparent ${
            loading
              ? "bg-[#2d4a86] border-[#3a5aa6] cursor-not-allowed"
              : "bg-[#5b8def] hover:bg-[#4f7df6] shadow-[0_1px_0_0_rgba(255,255,255,0.08)_inset,0_6px_20px_-8px_rgba(91,141,239,0.55)] hover:shadow-[0_1px_0_0_rgba(255,255,255,0.08)_inset,0_10px_28px_-10px_rgba(91,141,239,0.65)]"
          }`}
        >
          {loading ? (
            <>
              <Loader2 className="w-4.5 h-4.5 animate-spin" />
              Analyzing Document
            </>
          ) : (
            <>
              <CheckCircle2 className="w-4 h-4" />
              Analyze Document
            </>
          )}
        </motion.button>
      </form>
    </motion.div>
  );
}
