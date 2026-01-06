import apiClient from './axiosClient';
import type { Job, Page } from '../types/job';

export const getJobs = async (
  keyword: string = '',
  page: number = 0,
  size: number = 9,
  location: string,
  type?: string
) => {
  const params = new URLSearchParams();

  if (keyword) params.append('keyword', keyword);

  params.append('page', page.toString());
  params.append('size', size.toString());

  if (location) params.append('location', location);
  if (type) params.append('type', type);

  const response = await apiClient.get<Page<Job>>(`/jobs`, { params });
  return response.data;
};

export const getJobById = async (id: string) => {
  const response = await apiClient.get<Job>(`/jobs/${id}`);
  return response.data;
};

export const getMyPostedJobs = async () => {
  const response = await apiClient.get<Job[]>('/jobs/my-jobs');
  return response.data;
};
