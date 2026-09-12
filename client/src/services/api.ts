import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "http://127.0.0.1:5000/api";

export interface AnalysisResultDTO {
  overall_score: number;
  missing_keywords: string[];
  suggested_edits: string[];
  is_hallucinated_metric?: boolean;
  resume_id: number;
  scan_id: number;
}

export interface LatestScanDTO {
  id: number;
  overall_score: number;
  created_at: string;
}

export interface ResumeDTO {
  id: number;
  file_name: string;
  created_at: string;
  latest_scan: LatestScanDTO | null;
}

export interface ScanDTO {
  id: number;
  resume_id: number;
  overall_score: number;
  missing_keywords: string[];
  suggested_edits: string[];
  created_at: string;
}

export const analyzeResume = async (
  file: File,
  jobDescription: string,
  token: string
): Promise<AnalysisResultDTO> => {
  const formData = new FormData();
  formData.append("resume", file);
  formData.append("job_description", jobDescription);

  const response = await axios.post(`${API_BASE_URL}/analyze`, formData, {
    headers: {
      "Authorization": `Bearer ${token}`,
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};

export interface RegenerateResumeResponseDTO {
  message: string;
  updated_resume_text: string;
}

export const regenerateResume = async (
  resumeId: number,
  acceptedEdits: string[],
  token: string
): Promise<RegenerateResumeResponseDTO> => {
  const response = await axios.post(`${API_BASE_URL}/regenerate`, {
    resume_id: resumeId,
    accepted_edits: acceptedEdits
  }, {
    headers: {
      "Authorization": `Bearer ${token}`,
      "Content-Type": "application/json",
    }
  });
  return response.data;
};

export const listResumes = async (token: string): Promise<ResumeDTO[]> => {
  const response = await axios.get(`${API_BASE_URL}/resumes`, {
    headers: {
      "Authorization": `Bearer ${token}`,
    },
  });
  return response.data;
};

export const listScans = async (token: string, resumeId?: number): Promise<ScanDTO[]> => {
  const params: Record<string, number> = {};
  if (resumeId !== undefined) {
    params.resume_id = resumeId;
  }
  const response = await axios.get(`${API_BASE_URL}/scans`, {
    headers: {
      "Authorization": `Bearer ${token}`,
    },
    params,
  });
  return response.data;
};

export const getScanById = async (token: string, id: number): Promise<ScanDTO> => {
  const response = await axios.get(`${API_BASE_URL}/scans/${id}`, {
    headers: {
      "Authorization": `Bearer ${token}`,
    },
  });
  return response.data;
};