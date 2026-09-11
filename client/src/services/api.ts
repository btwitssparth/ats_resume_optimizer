import axios from "axios";

const API_BASE_URL = "http://127.0.0.1:5000/api";

export const analyzeResume = async (file: File, jobDescription: string, token: string) => {
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

export const regenerateResume = async (resumeId: number, acceptedEdits: string[], token: string) => {
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