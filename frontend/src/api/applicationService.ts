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
  jobTitle: string;
  jobLocation: string;
  status: string;
  appliedAt: string;
}

export const getMyApplications = async () => {
  const response = await apiClient.get<Application[]>(
    '/applications/my-applications'
  );
  return response.data;
};
