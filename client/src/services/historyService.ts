import { mockHistory, mockStats, type HistoryItem, type DashboardStats } from './mock/mockHistoryStore';

// In the future, these will use axios to hit http://127.0.0.1:5000/api/history
export const getRecentHistory = async (_token: string, limit: number = 3): Promise<HistoryItem[]> => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 600));
  return mockHistory.slice(0, limit);
};

export const getDashboardStats = async (_token: string): Promise<DashboardStats> => {
  await new Promise(resolve => setTimeout(resolve, 500));
  return mockStats;
};