import { listScans } from './api';
import type { HistoryItem, DashboardStats } from './mock/mockHistoryStore';

export const getRecentHistory = async (token: string, limit: number = 3): Promise<HistoryItem[]> => {
  try {
    const scans = await listScans(token);
    
    const sortedScans = scans.sort((a, b) => 
      new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );

    return sortedScans.slice(0, limit).map((scan) => ({
      id: scan.id.toString(),
      jobTitle: scan.job_title || 'Unknown Role',
      company: scan.company || 'Unknown Company',
      date: scan.created_at,
      score: scan.overall_score,
      status: scan.overall_score >= 80 ? 'Optimized' : 'Analyzed'
    }));
  } catch (error) {
    console.error("Failed to fetch recent history from backend:", error);
    return [];
  }
};

export const getDashboardStats = async (token: string): Promise<DashboardStats> => {
  try {
    const scans = await listScans(token);
    const totalAnalyzed = scans.length;
    const averageScore = totalAnalyzed > 0 
      ? Math.round(scans.reduce((sum, scan) => sum + scan.overall_score, 0) / totalAnalyzed)
      : 0;

    return {
      totalAnalyzed,
      averageScore,
      interviewsLanded: 0,
    };
  } catch (error) {
    console.error("Failed to fetch stats from backend:", error);
    return { totalAnalyzed: 0, averageScore: 0, interviewsLanded: 0 };
  }
};