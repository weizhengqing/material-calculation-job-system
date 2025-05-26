'use client';

import { useState, useEffect } from 'react';
import JobSubmissionForm from '@/components/JobSubmissionForm';
import JobList from '@/components/JobList';
import SettingsModal from '@/components/SettingsModal';
import { JobSubmission } from '@/types/job';
import { getJobs, saveJob } from '@/utils/jobManager';
import { loadSampleJobs } from '@/data/sampleJobs';

export default function Home() {
  const [jobs, setJobs] = useState<JobSubmission[]>([]);
  const [activeTab, setActiveTab] = useState<'submit' | 'list'>('submit');
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  // Load jobs from localStorage on component mount
  useEffect(() => {
    const storedJobs = getJobs();
    
    // If no jobs exist, load sample data for demonstration
    if (storedJobs.length === 0) {
      const sampleJobs = loadSampleJobs();
      sampleJobs.forEach(job => {
        saveJob({
          title: job.title,
          category: job.category,
          objectives: job.objectives,
          requirements: job.requirements,
          submittedBy: job.submittedBy,
          status: job.status
        });
      });
      setJobs(getJobs());
    } else {
      setJobs(storedJobs);
    }
  }, []);

  const handleJobSubmitted = (job: JobSubmission) => {
    // Job is already saved by JobSubmissionForm, just update the state
    setJobs(getJobs());
    setActiveTab('list');
  };

  const handleJobUpdate = (updatedJobs: JobSubmission[]) => {
    setJobs(updatedJobs);
  };

  const handleStorageChange = () => {
    // Reload jobs when storage type changes
    const updatedJobs = getJobs();
    setJobs(updatedJobs);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        <header className="text-center mb-8">
          <div className="flex items-center justify-between max-w-6xl mx-auto">
            <div className="flex-1"></div>
            <div className="flex-1 text-center">
              <h1 className="text-4xl font-bold text-gray-800 mb-2">
                Job Submission
              </h1>
            </div>
            <div className="flex-1 flex justify-end">
              <button
                onClick={() => setIsSettingsOpen(true)}
                className="p-2 text-gray-600 hover:text-gray-800 hover:bg-white/50 rounded-lg transition-colors"
                title="Settings"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </button>
            </div>
          </div>
        </header>

        <div className="max-w-6xl mx-auto">
          {/* Tab Navigation */}
          <div className="flex bg-white rounded-lg shadow-sm mb-6 p-1">
            <button
              className={`flex-1 py-3 px-6 rounded-md text-center font-medium transition-colors ${
                activeTab === 'submit'
                  ? 'bg-blue-500 text-white shadow-sm'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
              onClick={() => setActiveTab('submit')}
            >
              Submit New Job
            </button>
            <button
              className={`flex-1 py-3 px-6 rounded-md text-center font-medium transition-colors ${
                activeTab === 'list'
                  ? 'bg-blue-500 text-white shadow-sm'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
              onClick={() => setActiveTab('list')}
            >
              Job List ({jobs.length})
            </button>
          </div>

          {/* Tab Content */}
          <div className="bg-white rounded-lg shadow-lg">
            {activeTab === 'submit' ? (
              <JobSubmissionForm onJobSubmitted={handleJobSubmitted} />
            ) : (
              <JobList jobs={jobs} onJobUpdate={handleJobUpdate} />
            )}
          </div>
        </div>
      </div>

      <SettingsModal 
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        onStorageChange={handleStorageChange}
      />
    </div>
  );
}
