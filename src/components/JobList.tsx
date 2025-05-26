'use client';

import { useState, useEffect } from 'react';
import { JobSubmission } from '@/types/job';
import { getComputationCategoryById } from '@/data/computations'; // Assuming you want to filter by computation
import { generateJobPDF, generateMarkdownReport } from '@/utils/reportGenerator';
import { updateJobStatus, deleteJob, getJobs } from '@/utils/jobManager';
import { getPackageCategoryById } from '@/data/packages';
import { getTypeCategoryById } from '@/data/types';
import { getProjectCategoryById, getProjectCategories, ProjectCategory } from '@/data/projects'; // Import ProjectCategory and getProjectCategories

interface JobListProps {
  jobs: JobSubmission[];
  onJobUpdate?: (updatedJobs: JobSubmission[]) => void;
}

export default function JobList({ jobs, onJobUpdate }: JobListProps) {
  const [selectedJob, setSelectedJob] = useState<JobSubmission | null>(null);
  const [filterComputation, setFilterComputation] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [editingJobId, setEditingJobId] = useState<string | null>(null);
  const [selectedJobs, setSelectedJobs] = useState<Set<string>>(new Set());
  const [isAllSelected, setIsAllSelected] = useState(false);
  const [userAddedProjects, setUserAddedProjects] = useState<ProjectCategory[]>([]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedProjects = localStorage.getItem('jobForm_userAddedProjects');
      if (storedProjects) {
        setUserAddedProjects(JSON.parse(storedProjects));
      }
    }
  }, []);

  const staticProjects = getProjectCategories();
  const allProjects = [...staticProjects, ...userAddedProjects]; // Combine static and user-added projects

  const filteredJobs = jobs.filter(job => {
    const computationMatch = filterComputation === 'all' || job.computation === filterComputation; // Changed from categoryMatch
    const statusMatch = filterStatus === 'all' || job.status === filterStatus;
    return computationMatch && statusMatch;
  });

  // Update isAllSelected when filteredJobs or selectedJobs change
  useEffect(() => {
    if (filteredJobs.length > 0) {
      const allFilteredSelected = filteredJobs.every(job => selectedJobs.has(job.id));
      setIsAllSelected(allFilteredSelected);
    } else {
      setIsAllSelected(false);
    }
  }, [filteredJobs, selectedJobs]);

  const handleGeneratePDF = (job: JobSubmission) => {
    generateJobPDF(job, allProjects); // Pass allProjects
  };

  const handleGenerateMarkdown = (job: JobSubmission) => {
    const markdown = generateMarkdownReport(job, allProjects); // Pass allProjects
    const blob = new Blob([markdown], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Job_${job.jobNumber}_${job.title.replace(/[^a-zA-Z0-9]/g, '_')}.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleStatusChange = async (jobId: string, newStatus: JobSubmission['status']) => {
    const updatedJob = updateJobStatus(jobId, newStatus);
    if (updatedJob && onJobUpdate) {
      const updatedJobs = getJobs();
      onJobUpdate(updatedJobs);
    }
    setEditingJobId(null);
  };

  const handleDeleteJob = async (jobId: string) => {
    if (window.confirm('Are you sure you want to delete this job? This action cannot be undone.')) {
      const success = deleteJob(jobId);
      if (success && onJobUpdate) {
        const updatedJobs = getJobs();
        onJobUpdate(updatedJobs);
      }
    }
  };

  const handleSelectJob = (jobId: string) => {
    const newSelected = new Set(selectedJobs);
    if (newSelected.has(jobId)) {
      newSelected.delete(jobId);
    } else {
      newSelected.add(jobId);
    }
    setSelectedJobs(newSelected);
  };

  const handleSelectAll = () => {
    if (isAllSelected) {
      setSelectedJobs(new Set());
    } else {
      const allFilteredIds = filteredJobs.map(job => job.id);
      setSelectedJobs(new Set(allFilteredIds));
    }
  };

  const handleBatchDelete = async () => {
    if (selectedJobs.size === 0) return;
    
    if (window.confirm(`Are you sure you want to delete ${selectedJobs.size} selected jobs? This action cannot be undone.`)) {
      let deletedCount = 0;
      selectedJobs.forEach(jobId => {
        if (deleteJob(jobId)) {
          deletedCount++;
        }
      });
      
      if (deletedCount > 0 && onJobUpdate) {
        const updatedJobs = getJobs();
        onJobUpdate(updatedJobs);
        setSelectedJobs(new Set());
      }
    }
  };

  const handleBatchExportPDF = () => {
    if (selectedJobs.size === 0) return;
    
    const selectedJobData = filteredJobs.filter(job => selectedJobs.has(job.id));
    selectedJobData.forEach(job => {
      generateJobPDF(job, allProjects); // Pass allProjects
    });
    alert(`Generated PDF for ${selectedJobData.length} jobs.`);
  };

  const handleBatchExportMarkdown = () => {
    if (selectedJobs.size === 0) return;
    
    const selectedJobData = filteredJobs.filter(job => selectedJobs.has(job.id));
    
    // Create a combined markdown report
    let combinedMarkdown = '# Batch Job Export Report\n\n';
    combinedMarkdown += `Generated on: ${new Date().toLocaleDateString()}\n\n`;
    combinedMarkdown += `Total Jobs: ${selectedJobData.length}\n\n`;
    combinedMarkdown += '---\n\n';
    
    selectedJobData.forEach((job, index) => {
      const markdown = generateMarkdownReport(job, allProjects); // Pass allProjects
      combinedMarkdown += `## Job ${index + 1}: ${job.title}\n\n`;
      combinedMarkdown += markdown;
      combinedMarkdown += '\n\n---\n\n';
    });
    
    const blob = new Blob([combinedMarkdown], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Batch_Export_${selectedJobData.length}_Jobs_${new Date().toISOString().split('T')[0]}.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    alert(`Exported ${selectedJobData.length} jobs to markdown.`);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'draft': return 'bg-gray-100 text-gray-800';
      case 'submitted': return 'bg-blue-100 text-blue-800';
      case 'in-progress': return 'bg-yellow-100 text-yellow-800';
      case 'completed': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const uniqueComputations = Array.from(new Set(jobs.map(job => job.computation))); // Changed from uniqueCategories

  if (jobs.length === 0) {
    return (
      <div className="p-8 text-center">
        <div className="max-w-sm mx-auto">
          <div className="text-gray-400 mb-4">
            <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No jobs submitted yet</h3>
          <p className="text-gray-500">Submit your first calculation job to get started.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-4 sm:mb-0 whitespace-nowrap"> {/* ADDED whitespace-nowrap */}
          Job Assignments ({filteredJobs.length})
          {selectedJobs.size > 0 && (
            <span className="text-sm font-normal text-blue-600 ml-2">
              ({selectedJobs.size} selected)
            </span>
          )}
        </h2>
        
        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3">
          <select
            value={filterComputation} // Changed from filterCategory
            onChange={(e) => setFilterComputation(e.target.value)} // Changed from setFilterCategory
            className="px-3 py-2 border border-gray-300 rounded-md text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option key="all-computations-filter" value="all">All Computations</option> // Changed text, ADDED KEY, made key more unique
            {uniqueComputations.map(computationId => { // Changed from uniqueCategories and categoryId
              const computation = getComputationCategoryById(computationId); // Changed from getCategoryById
              return (
                <option key={`filter-computation-${computationId}`} value={computationId}>
                  {computation?.name || computationId} {/* Changed from category?.name */}
                </option>
              );
            })}
          </select>
          
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option key="all-status-filter" value="all">All Status</option>
            <option key="draft-status-filter" value="draft">Draft</option>
            <option key="submitted-status-filter" value="submitted">Submitted</option>
            <option key="in-progress-status-filter" value="in-progress">In Progress</option>
            <option key="completed-status-filter" value="completed">Completed</option>
          </select>
        </div>
      </div>

      {/* Batch Operations Toolbar */}
      <div className="bg-white border border-gray-200 rounded-lg p-4 mb-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          {/* Selection Controls */}
          <div className="flex items-center gap-4">
            <label className="flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={isAllSelected && filteredJobs.length > 0}
                onChange={handleSelectAll}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <span className="ml-2 text-sm text-gray-700">
                Select All ({filteredJobs.length})
              </span>
            </label>
            
            {selectedJobs.size > 0 && (
              <span className="text-sm text-blue-600 font-medium">
                {selectedJobs.size} job{selectedJobs.size !== 1 ? 's' : ''} selected
              </span>
            )}
          </div>

          {/* Batch Action Buttons */}
          <div className="flex flex-wrap gap-2">
            <button
              onClick={handleBatchExportPDF}
              disabled={selectedJobs.size === 0}
              className="px-4 py-2 text-sm font-medium text-green-600 bg-green-50 rounded-md hover:bg-green-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <svg className="w-4 h-4 inline mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Batch PDF
            </button>
            
            <button
              onClick={handleBatchExportMarkdown}
              disabled={selectedJobs.size === 0}
              className="px-4 py-2 text-sm font-medium text-purple-600 bg-purple-50 rounded-md hover:bg-purple-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <svg className="w-4 h-4 inline mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Batch MD
            </button>
            
            <button
              onClick={handleBatchDelete}
              disabled={selectedJobs.size === 0}
              className="px-4 py-2 text-sm font-medium text-red-600 bg-red-50 rounded-md hover:bg-red-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <svg className="w-4 h-4 inline mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
              Batch Delete
            </button>
          </div>
        </div>
      </div>

      <div className="grid gap-4">
        {filteredJobs.map((job) => {
          return (
            <div
              key={job.id}
              className={`bg-gray-50 rounded-lg p-6 hover:bg-gray-100 transition-colors ${
                selectedJobs.has(job.id) ? 'ring-2 ring-blue-500 bg-blue-50' : ''
              }`}
            >
              <div className="flex flex-col lg:flex-row lg:items-center justify-between">
                <div className="flex items-start gap-3 flex-1">
                  {/* Selection Checkbox */}
                  <div className="flex items-center pt-1">
                    <input
                      type="checkbox"
                      checked={selectedJobs.has(job.id)}
                      onChange={() => handleSelectJob(job.id)}
                      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                  </div>

                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      {/* Icon logic might need to change if it was based on the old category */}
                      <span className="text-2xl">{getComputationCategoryById(job.computation)?.description ? '⚙️' : '📋'}</span>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">
                          {job.title}
                        </h3>
                        <p className="text-sm text-gray-600">
                          Job #{job.jobNumber} • {getComputationCategoryById(job.computation)?.name || job.computation}
                        </p>
                      </div>
                    </div>
                  
                    <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 mb-3">
                      <span>Submitted by: {job.submittedBy}</span>
                      <span>•</span>
                      <span>{new Date(job.submittedDate).toLocaleDateString('en-US', { 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric' 
                      })}</span>
                      {editingJobId === job.id ? (
                        <select
                          value={job.status}
                          onChange={(e) => handleStatusChange(job.id, e.target.value as JobSubmission['status'])}
                          onBlur={() => setEditingJobId(null)}
                          className="px-2 py-1 rounded-full text-xs font-medium border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                          autoFocus
                        >
                          <option key={`status-draft-${job.id}`} value="draft">Draft</option>
                          <option key={`status-submitted-${job.id}`} value="submitted">Submitted</option>
                          <option key={`status-in-progress-${job.id}`} value="in-progress">In Progress</option>
                          <option key={`status-completed-${job.id}`} value="completed">Completed</option>
                        </select>
                      ) : (
                        <button
                          onClick={() => setEditingJobId(job.id)}
                          className={`px-2 py-1 rounded-full text-xs font-medium hover:opacity-80 transition-opacity ${getStatusColor(job.status)}`}
                          title="Click to edit status"
                        >
                          {job.status.charAt(0).toUpperCase() + job.status.slice(1)}
                        </button>
                      )}
                    </div>

                    <div className="text-sm text-gray-700">
                      <p className="line-clamp-2">{job.objectives}</p>
                    </div>
                  </div>
                </div>

                {/* Quick Actions - simplified since we have batch operations */}
                <div className="flex flex-col sm:flex-row gap-2 mt-4 lg:mt-0 lg:ml-3">
                  <button
                    onClick={() => setSelectedJob(selectedJob?.id === job.id ? null : job)}
                    className="px-3 py-1 text-sm font-medium text-blue-600 bg-blue-50 rounded-md hover:bg-blue-100 transition-colors"
                  >
                    {selectedJob?.id === job.id ? 'Hide' : 'Details'}
                  </button>
                  <button
                    onClick={() => handleDeleteJob(job.id)}
                    className="px-3 py-1 text-sm font-medium text-red-600 bg-red-50 rounded-md hover:bg-red-100 transition-colors"
                    title="Delete this job"
                  >
                    Delete
                  </button>
                </div>
              </div>

              {/* Job Details */}
              {selectedJob?.id === job.id && (
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">Objectives</h4>
                      <p className="text-gray-700 text-sm leading-relaxed whitespace-pre-wrap">
                        {job.objectives}
                      </p>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">Requirements</h4>
                      <p className="text-gray-700 text-sm leading-relaxed whitespace-pre-wrap">
                        {job.requirements}
                      </p>
                    </div>
                  </div>
                  
                  <div className="mt-4 grid md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-medium text-gray-900 mb-1">Project</h4>
                      <p className="text-gray-700 text-sm">
                        {getProjectCategoryById(job.project || '', allProjects)?.name || job.project || 'N/A'}
                      </p>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900 mb-1">Computation</h4>
                      <p className="text-gray-700 text-sm">
                        {getComputationCategoryById(job.computation)?.name || job.computation}
                      </p>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900 mb-1">Package</h4>
                      <p className="text-gray-700 text-sm">
                        {getPackageCategoryById(job.package)?.name || job.package}
                      </p>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900 mb-1">Type</h4>
                      <p className="text-gray-700 text-sm">
                        {getTypeCategoryById(job.type)?.name || job.type}
                      </p>
                    </div>
                  </div>

                  <div className="mt-4 p-4 bg-gray-100 rounded-md">
                    <h4 className="font-medium text-gray-900 mb-2">Computation Description</h4>
                    <p className="text-gray-700 text-sm">
                      {getComputationCategoryById(job.computation)?.description || 'No description available'}
                    </p>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
