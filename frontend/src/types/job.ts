export interface Job {
  id: number;
  title: string;
  description: string;
  location: string;
  salary: number;
  type: 'REMOTE' | 'ONSITE' | 'HYBRID';
  postedAt: string;
  postedByRecruiterName: string;
}

export interface Page<T> {
  content: T[];
  totalPages: number;
  totalElements: number;
  size: number;
  number: number; // Current page index (0-based)
  first: boolean;
  last: boolean;
  empty: boolean;
}

export interface JobRequest {
  title: string;
  description: string;
  location: string;
  salary: number;
  requirements: string;
  jobType?: string;
}
