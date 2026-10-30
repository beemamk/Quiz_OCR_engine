import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000/api';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
});

export const apiService = {
  getQuestionBanks: () => apiClient.get('/question-banks/'),
  
  uploadPdf: (title, file) => {
    const formData = new FormData();
    formData.append('title', title);
    formData.append('uploaded_file', file);
    return apiClient.post('/question-banks/', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },

  submitAnswers: (submissionData) => {
    return apiClient.post('/submissions/', submissionData);
  },
};
