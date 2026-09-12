import { useEffect, useState } from "react";
import { useAuth } from "@clerk/clerk-react";
import { FileText, Clock } from "lucide-react";
import { getRecentHistory } from "../services/historyService";
import type { HistoryItem } from "../services/mock/mockHistoryStore";

export default function History() {
  const { getToken } = useAuth();
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    let cancelled = false;
    void (async () => {
      try {
        const token = await getToken();
        if (token) {
          const data = await getRecentHistory(token, 100);
          if (!cancelled) setHistory(data);
        }
      } catch (err) {
        console.error("Failed to load history", err);
        if (!cancelled) setError(true);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [getToken]);

  return <div className="w-full py-2 sm:py-4">
    <div className="mb-8"><h1 className="text-2xl font-bold text-slate-900">Analysis History</h1><p className="text-sm text-slate-500 mt-1">Review your past resume analyses.</p></div>
    {error && <div className="mb-6 rounded-lg border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">Unable to load history. Please refresh and try again.</div>}
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm text-slate-600">
          <thead className="bg-slate-50 text-slate-500 font-medium border-b border-slate-200"><tr>
            <th className="px-6 py-4">Target Role</th><th className="px-6 py-4">Company</th><th className="px-6 py-4">Date</th><th className="px-6 py-4">ATS Score</th>
          </tr></thead>
          <tbody className="divide-y divide-slate-100">
            {loading ? <tr><td colSpan={4} className="px-6 py-8 text-center text-slate-400"><Clock className="w-6 h-6 animate-spin mx-auto mb-2" />Loading history...</td></tr>
            : history.length === 0 ? <tr><td colSpan={4} className="px-6 py-12 text-center text-slate-400"><FileText className="w-10 h-10 mx-auto text-slate-300 mb-3" />No analyses found.</td></tr>
            : history.map(item => <tr key={item.id} className="hover:bg-slate-50 transition-colors">
              <td className="px-6 py-4 font-medium text-slate-900">{item.jobTitle}</td><td className="px-6 py-4">{item.company}</td><td className="px-6 py-4">{new Date(item.date).toLocaleDateString()}</td>
              <td className="px-6 py-4"><span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${item.score >= 80 ? "bg-emerald-50 text-emerald-700" : item.score >= 60 ? "bg-amber-50 text-amber-700" : "bg-rose-50 text-rose-700"}`}>{item.score}/100</span></td>
            </tr>)}
          </tbody>
        </table>
      </div>
    </div>
  </div>;
}
