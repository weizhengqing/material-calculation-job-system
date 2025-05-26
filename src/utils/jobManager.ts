import { JobSubmission } from '@/types/job';
import { v4 as uuidv4 } from 'uuid';

const STORAGE_KEY = 'material-calculation-jobs';

type StorageType = 'localStorage' | 'sessionStorage' | 'memory';

// In-memory storage for memory mode
let memoryStorage: JobSubmission[] = [];

const getStorageType = (): StorageType => {
  if (typeof window === 'undefined') return 'memory';
  return (localStorage.getItem('mcjs-storage-type') as StorageType) || 'localStorage';
};

const getStorage = () => {
  const storageType = getStorageType();
  switch (storageType) {
    case 'sessionStorage':
      return sessionStorage;
    case 'memory':
      return null; // Will use memoryStorage array
    default:
      return localStorage;
  }
};

// Helper functions for localStorage
const loadJobsFromStorage = (): JobSubmission[] => {
  if (typeof window === 'undefined') return []; // Server-side rendering check
  
  const storageType = getStorageType();
  
  if (storageType === 'memory') {
    return [...memoryStorage];
  }
  
  const storage = getStorage();
  if (!storage) return [];
  
  try {
    const stored = storage.getItem(STORAGE_KEY);
    if (!stored) return [];
    
    const parsed = JSON.parse(stored);
    // Convert date strings back to Date objects
    return parsed.map((job: any) => ({
      ...job,
      submittedAt: new Date(job.submittedAt)
    }));
  } catch (error) {
    console.error('Error loading jobs from storage:', error);
    return [];
  }
};

const saveJobsToStorage = (jobs: JobSubmission[]): void => {
  if (typeof window === 'undefined') return; // Server-side rendering check
  
  const storageType = getStorageType();
  
  if (storageType === 'memory') {
    memoryStorage = [...jobs];
    return;
  }
  
  const storage = getStorage();
  if (!storage) return;
  
  try {
    storage.setItem(STORAGE_KEY, JSON.stringify(jobs));
    
    // Auto backup to localStorage if enabled and not using localStorage
    const autoBackup = localStorage.getItem('mcjs-auto-backup') !== 'false';
    if (autoBackup && storageType !== 'localStorage') {
      localStorage.setItem('mcjs-backup-jobs', JSON.stringify(jobs));
    }
  } catch (error) {
    console.error('Error saving jobs to storage:', error);
  }
};

// Initialize jobs from localStorage or empty array
let jobs: JobSubmission[] = [];

// Load jobs on module initialization (client-side only)
if (typeof window !== 'undefined') {
  jobs = loadJobsFromStorage();
}

export const saveJob = (jobData: Omit<JobSubmission, 'id' | 'jobNumber' | 'submittedDate' | 'lastUpdated'>): JobSubmission => {
  const now = new Date();
  const newJob: JobSubmission = {
    ...jobData,
    id: uuidv4(),
    // Pass project to generateJobNumber instead of computation
    jobNumber: generateJobNumber(jobData.project || 'Noproject'), // Use project, provide fallback if undefined
    submittedDate: now.toISOString(),
    lastUpdated: now.toISOString(),
    status: jobData.status || 'draft', // Default status if not provided
  };
  jobs.push(newJob);
  saveJobsToStorage(jobs);
  return newJob;
};

export const generateJobNumber = (project: string): string => {
  // Prefix for filtering and the job number: ProjectID + '-', e.g., P1-
  const prefix = `${project}-`;

  // Count existing jobs for this project
  const existingJobsForProject = jobs.filter(job => 
    job.jobNumber.startsWith(prefix)
  );
  
  // Generate new sequence number, e.g., 001, 002, ... up to 005 for the example
  const sequence = (existingJobsForProject.length + 1).toString().padStart(3, '0');
  
  // New job number format: P1-005
  const newJobNumber = `${prefix}${sequence}`;
  return newJobNumber;
};

export const getJobs = (): JobSubmission[] => {
  return [...jobs];
};

export const getJobById = (id: string): JobSubmission | undefined => {
  return jobs.find(job => job.id === id);
};

// Get jobs by category (example, can be adapted)
export const getJobsByCategory = (category: string): JobSubmission[] => {
  // This function needs to be updated if it's still used, as 'category' was removed.
  // Consider filtering by 'computation', 'package', or 'type' instead.
  // For now, returning all jobs to avoid breaking compilation, but this is likely not the desired behavior.
  // Example: return jobs.filter(job => job.computation === category);
  return jobs.filter(job => job.computation === category); // Corrected to use computation
};

// Update job status
export const updateJobStatus = (id: string, status: JobSubmission['status']): JobSubmission | null => {
  const jobIndex = jobs.findIndex(job => job.id === id);
  if (jobIndex === -1) return null;
  
  jobs[jobIndex] = { ...jobs[jobIndex], status };
  saveJobsToStorage(jobs); // Save to localStorage
  return jobs[jobIndex];
};

export const deleteJob = (id: string): boolean => {
  const jobIndex = jobs.findIndex(job => job.id === id);
  if (jobIndex === -1) return false;
  
  jobs.splice(jobIndex, 1);
  saveJobsToStorage(jobs); // Save to localStorage
  return true;
};

export const updateJob = (id: string, updates: Partial<Omit<JobSubmission, 'id' | 'jobNumber' | 'submittedAt'>>): JobSubmission | null => {
  const jobIndex = jobs.findIndex(job => job.id === id);
  if (jobIndex === -1) return null;
  
  jobs[jobIndex] = { ...jobs[jobIndex], ...updates };
  saveJobsToStorage(jobs); // Save to localStorage
  return jobs[jobIndex];
};

// Function to manually load sample jobs (useful for testing)
export const loadSampleJobs = (): void => {
  // This function can be called to reset or load sample data
  // Typically would import sample jobs here if needed
  saveJobsToStorage(jobs);
};

// Export helper functions for settings modal
export { loadJobsFromStorage, saveJobsToStorage };
