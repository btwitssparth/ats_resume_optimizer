import { useEffect, useState } from "react";
import { useAuth } from "@clerk/clerk-react";
import { motion } from "framer-motion";
import {
  Upload,
  FileEdit,
  Briefcase,
  X,
  BarChart3,
  Clock,
  FileText,
  AlertCircle,
  RefreshCw,
  TrendingUp,
} from "lucide-react";
import ScoreCard from "../components/ui/ScoreCard";
import Sparkline from "../components/ui/Sparkline";
import {
  SkeletonCard,
  SkeletonLine,
  SkeletonStyles,
} from "../components/ui/Skeleton";
import { useApp } from "../contexts/AppContext";
import historyService, { type ScoreSeriesPoint } from "../services/historyService";
import type { ScanDTO, ResumeDTO } from "../services/api";

function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function scorePillColor(score: number): string {
  if (score >= 80) return "bg-[#0f2a1a] text-[#4ade80] border-[#1f4a2e]";
  if (score >= 55) return "bg-[#2a2210] text-[#fbbf24] border-[#4a3a20]";
  return "bg-[#2a1517] text-[#f87171] border-[#4a2024]";
}

function findResumeForScan(
  scan: ScanDTO,
  resumes: ResumeDTO[]
): ResumeDTO | undefined {
  return resumes.find((r) => r.id === scan.resume_id);
}

const pageVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.06, delayChildren: 0.02 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 10 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] },
  },
};

export default function Dashboard() {
  const { getToken } = useAuth();
  const { navigate } = useApp();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showMockBanner, setShowMockBanner] = useState(false);
  const [scans, setScans] = useState<ScanDTO[]>([]);
  const [resumes, setResumes] = useState<ResumeDTO[]>([]);
  const [scoreSeries, setScoreSeries] = useState<ScoreSeriesPoint[]>([]);
  const [isMock, setIsMock] = useState(false);
  const [loadAttempt, setLoadAttempt] = useState(0);

  useEffect(() => {
    const dismissed = sessionStorage.getItem("mock_banner_dismissed");
    if (dismissed !== "true") {
      setShowMockBanner(true);
    }
  }, []);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setIsLoading(true);
      setError(null);

      try {
        await historyService.ensureLoaded(() => getToken());

        if (cancelled) return;

        const recentScans = historyService.getRecentScans(6);
        const allResumes = historyService.getResumes();
        const series = historyService.getScoreSeries();

        setScans(recentScans);
        setResumes(allResumes);
        setScoreSeries(series);
        setIsMock(historyService.isMock);

        if (historyService.error) {
          setError(historyService.error);
        }
      } catch (err) {
        if (cancelled) return;
        const msg = err instanceof Error ? err.message : "Failed to load dashboard";
        setError(msg);
        setIsMock(historyService.isMock);
        setScans(historyService.getRecentScans(6));
        setResumes(historyService.getResumes());
        setScoreSeries(historyService.getScoreSeries());
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    }

    load();

    return () => {
      cancelled = true;
    };
  }, [getToken, loadAttempt]);

  const latestScan = scans[0];

  function handleDismissMockBanner() {
    sessionStorage.setItem("mock_banner_dismissed", "true");
    setShowMockBanner(false);
  }

  function handleScanClick(scanId: number) {
    sessionStorage.setItem("pending_scan_id", String(scanId));
    navigate(`/app/resume/analyzer?id=${scanId}`);
  }

  function handleRetry() {
    setLoadAttempt((v) => v + 1);
  }

  function handleDashboardRetry() {
    setLoadAttempt((v) => v + 1);
  }

  return (
    <motion.div
      variants={pageVariants}
      initial="hidden"
      animate="show"
      className="space-y-6 sm:space-y-8"
    >
      <SkeletonStyles />

      {isMock && showMockBanner && (
        <motion.div
          variants={itemVariants}
          className="flex items-start gap-3 p-4 rounded-xl border"
          style={{ backgroundColor: "#1c1a10", borderColor: "#3a3420" }}
        >
          <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: "#d4b86a" }} />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium" style={{ color: "#d4b86a" }}>
              Showing demo data — backend endpoint not connected
            </p>
          </div>
          <button
            onClick={handleDismissMockBanner}
            className="flex-shrink-0 p-1 rounded-md transition-colors hover:bg-black/20"
            style={{ color: "#d4b86a" }}
          >
            <X className="w-4 h-4" />
          </button>
        </motion.div>
      )}

      {isLoading ? (
        <>
          <motion.div variants={itemVariants}>
            <SkeletonCard className="p-8">
              <div className="flex flex-col items-center gap-5">
                <div className="w-36 h-36 rounded-full bg-[#141416]" />
                <div className="w-48 h-5 rounded-full" />
                <div className="w-64 h-4 rounded-full" />
              </div>
            </SkeletonCard>
          </motion.div>

          <motion.div variants={itemVariants}>
            <SkeletonCard className="p-6">
              <div className="flex items-center gap-2 mb-5">
                <div className="w-8 h-8 rounded-lg bg-[#141416]" />
                <div className="w-36 h-5 rounded-full" />
              </div>
              <div className="h-24 rounded-lg bg-[#141416]" />
            </SkeletonCard>
          </motion.div>

          <motion.div variants={itemVariants}>
            <SkeletonCard className="p-6">
              <div className="flex items-center gap-2 mb-5">
                <div className="w-8 h-8 rounded-lg bg-[#141416]" />
                <div className="w-40 h-5 rounded-full" />
              </div>
              <div className="space-y-3">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="flex items-center gap-4 py-3">
                    <div className="w-9 h-9 rounded-lg bg-[#141416]" />
                    <div className="flex-1 space-y-2">
                      <SkeletonLine className="h-4 w-48" />
                      <SkeletonLine className="h-3 w-32" />
                    </div>
                    <div className="w-16 h-7 rounded-full bg-[#141416]" />
                  </div>
                ))}
              </div>
            </SkeletonCard>
          </motion.div>

          <motion.div variants={itemVariants}>
            <SkeletonCard className="p-6">
              <div className="flex items-center gap-2 mb-5">
                <div className="w-8 h-8 rounded-lg bg-[#141416]" />
                <div className="w-32 h-5 rounded-full" />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="p-5 rounded-xl bg-[#141416]">
                    <div className="w-10 h-10 rounded-lg mb-4" />
                    <SkeletonLine className="h-4 w-28 mb-2" />
                    <SkeletonLine className="h-3 w-44" />
                  </div>
                ))}
              </div>
            </SkeletonCard>
          </motion.div>
        </>
      ) : (
        <>
          {error && (
            <motion.div
              variants={itemVariants}
              className="flex items-start gap-3 p-5 rounded-xl bg-[#2a1517] border border-[#4a2024]"
            >
              <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5 text-[#f87171]" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-[#f87171] mb-1">
                  Couldn&apos;t load your data
                </p>
                <p className="text-xs text-[#e29ba0]">{error}</p>
                <div className="flex gap-3 mt-4">
                  <button
                    onClick={handleRetry}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium bg-[#f5f5f7] text-[#0a0a0b] hover:bg-white transition-colors"
                  >
                    <RefreshCw className="w-4 h-4" />
                    Retry
                  </button>
                  <button
                    onClick={handleDashboardRetry}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium bg-[#1f1f26] text-[#f5f5f7] border border-[#2f2f39] hover:bg-[#25252e] transition-colors"
                  >
                    <BarChart3 className="w-4 h-4" />
                    Dashboard
                  </button>
                </div>
              </div>
            </motion.div>
          )}

          <motion.div variants={itemVariants}>
            {latestScan ? (
              <ScoreCard
                size="lg"
                score={latestScan.overall_score}
                label="Latest ATS Score"
                subtitle="Based on your most recent resume analysis"
              />
            ) : (
              <div className="bg-[#141416] border border-[#23232a] rounded-2xl p-12 flex flex-col items-center justify-center text-center">
                <div className="bg-[#101013] w-16 h-16 rounded-2xl flex items-center justify-center mb-5 border border-[#23232a]">
                  <BarChart3 className="w-7 h-7 text-[#565b66]" />
                </div>
                <h2 className="text-base font-semibold text-[#c5c9d1] mb-1.5 tracking-tight">
                  No analyses yet
                </h2>
                <p className="text-sm text-[#6b7280] max-w-xs leading-relaxed">
                  Upload your first resume and job description to see your ATS compatibility score.
                </p>
                <button
                  onClick={() => navigate("/app/resume/analyzer")}
                  className="mt-6 inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold bg-[#f5f5f7] text-[#0a0a0b] hover:bg-white transition-colors"
                >
                  <Upload className="w-4 h-4" />
                  Upload Resume
                </button>
              </div>
            )}
          </motion.div>

          <motion.div variants={itemVariants}>
            <div className="bg-[#141416] border border-[#23232a] rounded-2xl p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-[#12162a] border border-[#2a3258]">
                    <TrendingUp className="w-4 h-4 text-[#5b8def]" />
                  </span>
                  <div>
                    <h3 className="text-sm font-semibold text-[#f5f5f7] tracking-tight">
                      Resume Improvement History
                    </h3>
                  </div>
                </div>
              </div>
              {scoreSeries.length >= 2 ? (
                <Sparkline points={scoreSeries} />
              ) : (
                <div className="h-24 flex items-center justify-center">
                  <p className="text-sm text-[#6b7280]">
                    Complete at least 2 analyses to see your progress.
                  </p>
                </div>
              )}
            </div>
          </motion.div>

          <motion.div variants={itemVariants}>
            <div className="bg-[#141416] border border-[#23232a] rounded-2xl p-6">
              <div className="flex items-center gap-2 mb-5">
                <span className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-[#1c1a10] border border-[#3a3420]">
                  <Clock className="w-4 h-4 text-[#d4b86a]" />
                </span>
                <h3 className="text-sm font-semibold text-[#f5f5f7] tracking-tight">
                  Recent Analyses
                </h3>
              </div>

              {scans.length === 0 ? (
                <div className="py-10 text-center">
                  <FileText className="w-10 h-10 text-[#3a3a3e] mx-auto mb-3" />
                  <p className="text-sm text-[#6b7280]">No analyses yet.</p>
                </div>
              ) : (
                <div className="space-y-1">
                  {scans.map((scan) => {
                    const resume = findResumeForScan(scan, resumes);
                    const pillClass = scorePillColor(scan.overall_score);
                    return (
                      <motion.button
                        key={scan.id}
                        onClick={() => handleScanClick(scan.id)}
                        whileHover={{ y: -1 }}
                        whileTap={{ scale: 0.99 }}
                        transition={{ duration: 0.15, ease: [0.22, 1, 0.36, 1] }}
                        className="w-full flex items-center gap-4 p-3.5 rounded-xl text-left hover:bg-[#101013] hover:border-[#2f2f39] border border-transparent transition-colors"
                      >
                        <div className="w-9 h-9 rounded-lg bg-[#101013] border border-[#1f1f26] flex items-center justify-center flex-shrink-0">
                          <FileText className="w-4 h-4 text-[#6b7280]" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-[13.5px] font-medium text-[#e8eaee] truncate">
                            {resume?.file_name ?? `Resume #${scan.resume_id}`}
                          </p>
                          <p className="text-xs text-[#6b7280] mt-0.5">
                            {formatDate(scan.created_at)}
                          </p>
                        </div>
                        <span
                          className={`inline-flex items-center justify-center px-3 py-1 rounded-full text-xs font-semibold border flex-shrink-0 ${pillClass}`}
                        >
                          {scan.overall_score}
                        </span>
                      </motion.button>
                    );
                  })}
                </div>
              )}
            </div>
          </motion.div>

          <motion.div variants={itemVariants}>
            <div className="bg-[#141416] border border-[#23232a] rounded-2xl p-6">
              <div className="flex items-center gap-2 mb-5">
                <span className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-[#0f2a1a] border border-[#1f4a2e]">
                  <Briefcase className="w-4 h-4 text-[#4ade80]" />
                </span>
                <h3 className="text-sm font-semibold text-[#f5f5f7] tracking-tight">
                  Quick Actions
                </h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <motion.button
                  onClick={() => navigate("/app/resume/analyzer")}
                  whileHover={{ y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
                  className="p-5 rounded-xl bg-[#101013] border border-[#1f1f26] hover:border-[#3a4a86] hover:bg-[#11152a] text-left transition-colors group"
                >
                  <div className="w-10 h-10 rounded-lg bg-[#12162a] border border-[#2a3258] flex items-center justify-center mb-4 group-hover:bg-[#1a2140] transition-colors">
                    <Upload className="w-5 h-5 text-[#5b8def]" />
                  </div>
                  <h4 className="text-[13.5px] font-semibold text-[#e8eaee] mb-1">
                    Upload Resume
                  </h4>
                  <p className="text-xs text-[#6b7280] leading-relaxed">
                    Analyze a new resume against a job description.
                  </p>
                </motion.button>

                <motion.button
                  onClick={() => navigate("/app/resume/builder")}
                  whileHover={{ y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
                  className="p-5 rounded-xl bg-[#101013] border border-[#1f1f26] hover:border-[#4a3a20] hover:bg-[#1a1a10] text-left transition-colors group"
                >
                  <div className="w-10 h-10 rounded-lg bg-[#1c1a10] border border-[#3a3420] flex items-center justify-center mb-4 group-hover:bg-[#2a2210] transition-colors">
                    <FileEdit className="w-5 h-5 text-[#d4b86a]" />
                  </div>
                  <h4 className="text-[13.5px] font-semibold text-[#e8eaee] mb-1">
                    Open Builder
                  </h4>
                  <p className="text-xs text-[#6b7280] leading-relaxed">
                    Edit and optimize your resume content.
                  </p>
                </motion.button>

                <motion.button
                  onClick={() => navigate("/app/matcher")}
                  whileHover={{ y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
                  className="p-5 rounded-xl bg-[#101013] border border-[#1f1f26] hover:border-[#1f4a2e] hover:bg-[#0f1a12] text-left transition-colors group"
                >
                  <div className="w-10 h-10 rounded-lg bg-[#0f2a1a] border border-[#1f4a2e] flex items-center justify-center mb-4 group-hover:bg-[#152f1f] transition-colors">
                    <Briefcase className="w-5 h-5 text-[#4ade80]" />
                  </div>
                  <h4 className="text-[13.5px] font-semibold text-[#e8eaee] mb-1">
                    New Job Match
                  </h4>
                  <p className="text-xs text-[#6b7280] leading-relaxed">
                    Match existing resumes to a new job posting.
                  </p>
                </motion.button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </motion.div>
  );
}
