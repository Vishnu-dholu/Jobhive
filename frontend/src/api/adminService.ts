import type { Job } from '../types/job';
import apiClient from './axiosClient';

export interface AdminStats {
  totalUsers: number;
  totalJobs: number;
  totalApplications: number;
}

export interface User {
  name: string;
  email: string;
  role: string;
}

export const getAdminStats = async () => {
  const response = await apiClient.get<AdminStats>('/admin/stats');
  return response.data;
};

export const getAllUsers = async () => {
  const response = await apiClient.get<any[]>('/admin/users');
  return response.data;
};

export const deleteUser = async (id: number) => {
  await apiClient.delete(`/admin/users/${id}`);
};

export const getAllJobs = async () => {
  const response = await apiClient.get<Job[]>('/admin/jobs');
  return response.data;
};

export const deleteJob = async (id: number) => {
  await apiClient.delete(`/admin/job/${id}`);
};
