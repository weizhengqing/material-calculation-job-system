export interface JobCategory {
  id: string;
  name: string;
  description: string;
  icon: string;
}

export interface JobSubmission extends JobFormData {
  id: string;
  jobNumber: string;
  status: 'draft' | 'submitted' | 'in-progress' | 'completed';
  submittedDate: string;
  lastUpdated: string;
}

export interface JobFormData {
  project?: string; // Added project
  computation: string; // Added
  package: string; // Added
  type: string; // Added
  title: string;
  objectives: string;
  requirements: string;
  submittedBy: string;
}
