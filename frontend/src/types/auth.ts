export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
  role: 'APPLICANT' | 'RECRUITER';
}

export interface AuthResponse {
  token: string;
  role: string; // "RECRUITER" or "APPLICANT"
}
