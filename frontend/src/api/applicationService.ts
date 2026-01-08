import apiClient from './axiosClient';

export const applyForJob = async (jobId: number, file: File) => {
  const formData = new FormData();
  formData.append('resume', file);

  const response = await apiClient.post(
    `/applications/${jobId}/apply`,
    formData,
    {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }
  );
  return response.data;
};

export interface Application {
  id: number;

  // Job Details
  jobId: number;
  jobTitle: string;
  jobLocation: string;

  // Applicant Details
  applicantId: number;
  applicantName: string;
  applicantEmail: string;

  status: string;
  appliedAt: string;
}

export const getMyApplications = async () => {
  const response = await apiClient.get<Application[]>(
    '/applications/my-applications'
  );
  return response.data;
};

// Fetch applicants for a specific job
export const getApplicationsForJob = async (jobId: number) => {
  const response = await apiClient.get<Application[]>(
    `/applications/jobs/${jobId}`
  );
  return response.data;
};

// Update status
export const updateApplicationStatus = async (
  appId: number,
  status: string
) => {
  const response = await apiClient.put(
    `/applications/${appId}/status?status=${status}`
  );
  return response.data;
};

// Download resume
export const downloadResume = async (appId: number, fileName: string) => {
  const response = await apiClient.get(`/applications/${appId}/resume`, {
    responseType: 'blob',
  });

  // Create a temporary download link
  const url = window.URL.createObjectURL(new Blob([response.data]));
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', fileName);
  document.body.appendChild(link);
  link.click();
  link.remove();
};

export const getRecruiterApplications = async () => {
  const response = await apiClient.get<Application[]>(
    '/applications/recruiter'
  );
  return response.data;
};
