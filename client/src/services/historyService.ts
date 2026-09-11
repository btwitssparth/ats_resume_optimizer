import type { ResumeDTO, ScanDTO } from "./api";
import { listResumes, listScans } from "./api";
import { mockHistoryStore } from "./mock/mockHistoryStore";

export interface ScoreSeriesPoint {
  date: string;
  score: number;
  scanId: number;
}

class HistoryService {
  loading: boolean = false;
  error: string | null = null;
  isMock: boolean = false;
  resumes: ResumeDTO[] = [];
  scans: ScanDTO[] = [];

  private _loaded: boolean = false;

  async ensureLoaded(authGetToken: () => Promise<string | null>): Promise<void> {
    if (this._loaded && !this.isMock) return;
    if (this.loading) return;

    this.loading = true;
    this.error = null;

    try {
      const token = await authGetToken();
      if (!token) {
        throw new Error("No auth token available");
      }

      const [resumesData, scansData] = await Promise.all([
        listResumes(token),
        listScans(token),
      ]);

      this.resumes = resumesData ?? [];
      this.scans = scansData ?? [];
      this.isMock = false;
    } catch (err) {
      this.error = err instanceof Error ? err.message : "Unknown error loading history";
      this.resumes = mockHistoryStore.listResumes();
      this.scans = mockHistoryStore.listScans();
      this.isMock = true;
    } finally {
      this.loading = false;
      this._loaded = true;
    }
  }

  getResumes(): ResumeDTO[] {
    return [...this.resumes];
  }

  getRecentScans(n: number = 6): ScanDTO[] {
    const sorted = [...this.scans].sort((a, b) =>
      new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
    );
    return sorted.slice(0, n);
  }

  getScanById(id: number): ScanDTO | undefined {
    const found = this.scans.find((s) => s.id === id);
    if (found) return found;
    if (this.isMock) return mockHistoryStore.getScanById(id);
    return undefined;
  }

  getScoreSeries(): ScoreSeriesPoint[] {
    return [...this.scans]
      .sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime())
      .map((s) => ({
        date: s.created_at,
        score: s.overall_score,
        scanId: s.id,
      }));
  }
}

const historyService = new HistoryService();

export default historyService;
