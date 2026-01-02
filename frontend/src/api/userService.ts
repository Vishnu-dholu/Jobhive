import apiClient from './axiosClient';

export interface UserProfile {
  id: number;
  name: string;
  email: string;
  role: string;
  headline?: string;
  bio?: string;
  location?: string;
  skills?: string;
}

// Get Profile
export const getMyProfile = async () => {
  const response = await apiClient.get<UserProfile>('/users/profile');
  return response.data;
};

// Update Profile
export const updateMyProfile = async (
  data: Partial<UserProfile>,
  resumeFile?: File
) => {
  const formData = new FormData();

  if (data.headline) formData.append('headline', data.headline);
  if (data.bio) formData.append('bio', data.bio);
  if (data.location) formData.append('location', data.location);
  if (data.skills) formData.append('skills', data.skills);

  // Append file if exists
  if (resumeFile) {
    formData.append('resume', resumeFile);
  }

  const response = await apiClient.post<UserProfile>(
    '/users/profile',
    formData,
    {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }
  );
  return response.data;
};

// Helper to get resume URL
export const getResumeDownloadUrl = () => {
  const token = localStorage.getItem('token');

  return `http:localhost:8080/api/users/profile/resume`;
};
