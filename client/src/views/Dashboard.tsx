import { useEffect, useState } from "react";
import { useUser, useAuth } from "@clerk/clerk-react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FileText, Target, Sparkles, ArrowRight, Clock, Plus, Briefcase } from "lucide-react";
import { getRecentHistory, getDashboardStats } from "../services/historyService";
import type { HistoryItem, DashboardStats } from "../services/mock/mockHistoryStore";

export default function Dashboard() {
  const { user } = useUser();
  const { getToken } = useAuth();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [recent, setRecent] = useState<HistoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    let cancelled = false;
    const fetchData = async () => {
      try {
        const token = await getToken();
        if (!token) return;
        const [statsData, historyData] = await Promise.all([
          getDashboardStats(token),
          getRecentHistory(token, 4),
        ]);
        if (!cancelled) { setStats(statsData); setRecent(historyData); }
      } catch (err) {
        console.error("Failed to load dashboard data", err);
        if (!cancelled) setError(true);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    void fetchData();
    return () => { cancelled = true; };
  }, [getToken]);

  return (
    <div className="w-full py-2 sm:py-4">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Welcome back, {user?.firstName || "Optimizer"}</h1>
          <p className="text-sm text-slate-500 mt-1">Track your resume optimization activity.</p>
        </div>
        <Link to="/app/resume/analyzer" className="flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2.5 px-4 rounded-lg shadow-sm transition-colors text-sm">
          <Plus className="w-4 h-4" /> New Analysis
        </Link>
      </motion.div>

      {error && (
        <div className="mb-6 rounded-lg border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
          We couldn't load your dashboard data. Please refresh and try again.
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <StatCard title="Total Analyzed" value={loading ? null : stats?.totalAnalyzed} icon={<FileText className="w-5 h-5 text-indigo-600" />} loading={loading} />
        <StatCard title="Average ATS Score" value={loading ? null : `${stats?.averageScore}%`} icon={<Target className="w-5 h-5 text-emerald-600" />} loading={loading} />
        <StatCard title="Interviews Landed" value={loading ? null : stats?.interviewsLanded} icon={<Sparkles className="w-5 h-5 text-amber-500" />} loading={loading} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <section className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between">
            <h2 className="font-semibold text-slate-900 flex items-center gap-2"><Clock className="w-4 h-4 text-slate-500" /> Recent Analyses</h2>
            <Link to="/app/history" className="text-sm font-medium text-indigo-600 hover:text-indigo-700 flex items-center gap-1">View All <ArrowRight className="w-4 h-4" /></Link>
          </div>
          <div className="divide-y divide-slate-100">
            {loading ? Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="p-6 flex items-center justify-between">
                <div className="space-y-2"><div className="h-5 w-48 bg-slate-100 rounded animate-pulse" /><div className="h-4 w-32 bg-slate-50 rounded animate-pulse" /></div>
                <div className="h-8 w-16 bg-slate-100 rounded-full animate-pulse" />
              </div>
            )) : recent.length ? recent.map(item => (
              <div key={item.id} className="p-6 flex items-center justify-between hover:bg-slate-50 transition-colors">
                <div className="flex items-start gap-4">
                  <div className="bg-slate-100 p-2 rounded-lg mt-0.5"><Briefcase className="w-5 h-5 text-slate-500" /></div>
                  <div><h3 className="font-medium text-slate-900">{item.jobTitle}</h3><p className="text-sm text-slate-500 mt-0.5">{item.company} • {new Date(item.date).toLocaleDateString()}</p></div>
                </div>
                <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${item.score >= 80 ? "bg-emerald-50 text-emerald-700" : item.score >= 60 ? "bg-amber-50 text-amber-700" : "bg-rose-50 text-rose-700"}`}>{item.score}/100</span>
              </div>
            )) : (
              <div className="p-12 text-center text-slate-500"><FileText className="w-10 h-10 mx-auto text-slate-300 mb-3" /><p>No resumes analyzed yet.</p><Link to="/app/resume/analyzer" className="text-indigo-600 font-medium text-sm hover:underline mt-2 inline-block">Start your first analysis</Link></div>
            )}
          </div>
        </section>

        <aside className="space-y-6">
          <div className="bg-indigo-900 rounded-xl shadow-sm border border-indigo-800 p-6 text-white">
            <h2 className="font-semibold text-lg mb-2">Improve your match score</h2>
            <p className="text-indigo-200 text-sm mb-6 leading-relaxed">Compare your resume with a target role and make evidence-based improvements.</p>
            <Link to="/app/resume/analyzer" className="bg-white text-indigo-900 hover:bg-indigo-50 font-medium py-2.5 px-4 rounded-lg transition-colors text-sm w-full flex justify-center items-center gap-2">Analyze a Resume <ArrowRight className="w-4 h-4" /></Link>
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <h2 className="font-semibold text-slate-900 mb-4">Quick Links</h2>
            <div className="space-y-2">
              <QuickLink to="/app/resume/builder" icon={<FileText className="w-4 h-4" />} text="Resume Builder" />
              <QuickLink to="/app/matcher" icon={<Briefcase className="w-4 h-4" />} text="Job Matcher" />
              <QuickLink to="/app/settings" icon={<Target className="w-4 h-4" />} text="Settings" />
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}

function StatCard({ title, value, icon, loading }: { title: string; value: string | number | null | undefined; icon: React.ReactNode; loading: boolean }) {
  return <motion.div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
    <div className="flex justify-between items-start mb-4"><h3 className="text-sm font-medium text-slate-500">{title}</h3><div className="p-2 bg-slate-50 rounded-lg border border-slate-100">{icon}</div></div>
    {loading ? <div className="h-8 w-16 bg-slate-100 rounded animate-pulse mt-1" /> : <p className="text-3xl font-bold text-slate-900">{value}</p>}
  </motion.div>;
}

function QuickLink({ to, icon, text }: { to: string; icon: React.ReactNode; text: string }) {
  return <Link to={to} className="flex items-center justify-between p-3 rounded-lg hover:bg-slate-50 transition-colors text-slate-600 hover:text-indigo-600 group">
    <div className="flex items-center gap-3 text-sm font-medium"><span className="text-slate-400 group-hover:text-indigo-600">{icon}</span>{text}</div><ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-indigo-500" />
  </Link>;
}
