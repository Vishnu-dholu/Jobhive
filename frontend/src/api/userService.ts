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
  hasResume: boolean;
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

export const downloadResume = async (fileName: string) => {
  try {
    const response = await apiClient.get('/users/profile/resume', {
      responseType: 'blob',
    });

    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    // Set the filename for the download
    link.setAttribute('download', fileName || 'resume.pdf');
    document.body.appendChild(link);
    link.click();

    link.remove();
    window.URL.revokeObjectURL(url);
  } catch (error) {
    console.error('Download failed', error);
    throw error;
  }
};
