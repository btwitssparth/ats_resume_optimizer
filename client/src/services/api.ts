import axios, { AxiosError } from "axios";

const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL ?? "").trim().replace(/\/$/, "");

export class ApiError extends Error {
  status?: number;
  constructor(message: string, status?: number) { super(message); this.name = "ApiError"; this.status = status; }
}

function getErrorMessage(error: unknown): string {
  if (error instanceof AxiosError) {
    const message = error.response?.data?.error;
    if (typeof message === "string") return message;
    if (error.response?.status === 401) return "Your session has expired. Please sign in again.";
    if (error.response?.status === 413) return "The uploaded file is too large.";
    if (error.response?.status && error.response.status >= 500) return "The server is temporarily unavailable. Please try again.";
  }
  return error instanceof Error ? error.message : "Something went wrong. Please try again.";
}

async function request<T>(promise: Promise<{ data: T }>): Promise<T> {
  try { return (await promise).data; }
  catch (error) {
    if (error instanceof AxiosError) throw new ApiError(getErrorMessage(error), error.response?.status);
    throw error;
  }
}

const authHeaders = (token: string) => ({ Authorization: `Bearer ${token}` });

export interface AnalysisResultDTO {
  overall_score: number; missing_keywords: string[]; suggested_edits: string[];
  is_hallucinated_metric?: boolean; resume_id: number; scan_id: number;
}
export interface LatestScanDTO { id: number; overall_score: number; created_at: string; }
export interface ResumeDTO { id: number; file_name: string; created_at: string; latest_scan: LatestScanDTO | null; }
export interface ScanDTO {
  id: number; resume_id: number; job_title: string; company: string; overall_score: number;
  missing_keywords: string[]; suggested_edits: string[]; created_at: string;
}
export interface DashboardStatsDTO { totalAnalyzed: number; averageScore: number; interviewsLanded: number; }

export const analyzeResume = (file: File, jobDescription: string, jobTitle: string, company: string, token: string) => {
  const formData = new FormData();
  formData.append("resume", file); formData.append("job_description", jobDescription);
  formData.append("job_title", jobTitle); formData.append("company", company);
  return request(axios.post<AnalysisResultDTO>(`${API_BASE_URL}/api/analyze`, formData, { headers: authHeaders(token) }));
};
export interface RegenerateResumeResponseDTO { message: string; updated_resume_text: string; }
export const regenerateResume = (resumeId: number, acceptedEdits: string[], token: string) =>
  request(axios.post<RegenerateResumeResponseDTO>(`${API_BASE_URL}/api/regenerate`,
    { resume_id: resumeId, accepted_edits: acceptedEdits }, { headers: authHeaders(token) }));
export const listResumes = (token: string) =>
  request(axios.get<ResumeDTO[]>(`${API_BASE_URL}/api/resumes`, { headers: authHeaders(token) }));
export const listScans = (token: string, resumeId?: number) =>
  request(axios.get<ScanDTO[]>(`${API_BASE_URL}/api/scans`, { headers: authHeaders(token),
    params: resumeId === undefined ? undefined : { resume_id: resumeId } }));
export const getScanById = (token: string, id: number) =>
  request(axios.get<ScanDTO>(`${API_BASE_URL}/api/scans/${id}`, { headers: authHeaders(token) }));
export const getDashboardStats = (token: string) =>
  request(axios.get<DashboardStatsDTO>(`${API_BASE_URL}/api/stats`, { headers: authHeaders(token) }));
