'use client';

import { useState, useEffect } from 'react'; // Ensure useEffect is imported
import { JobFormData, JobSubmission } from '@/types/job';
import { getComputationCategories } from '@/data/computations';
import { getPackageCategories } from '@/data/packages';
import { getTypeCategories } from '@/data/types';
import { getProjectCategories, ProjectCategory } from '@/data/projects'; // Modified import
import { saveJob } from '@/utils/jobManager';
import { v4 as uuidv4 } from 'uuid'; // For unique IDs if Pn scheme becomes complex

interface JobSubmissionFormProps {
  onJobSubmitted: (job: JobSubmission) => void;
}

export default function JobSubmissionForm({ onJobSubmitted }: JobSubmissionFormProps) {
  const [formData, setFormData] = useState<JobFormData>(() => {
    const initialProject = typeof window !== 'undefined' ? localStorage.getItem('jobForm_selectedProject') || '' : ''; // Added
    const initialComputation = typeof window !== 'undefined' ? localStorage.getItem('jobForm_selectedComputation') || '' : '';
    const initialPackage = typeof window !== 'undefined' ? localStorage.getItem('jobForm_selectedPackage') || '' : '';
    const initialType = typeof window !== 'undefined' ? localStorage.getItem('jobForm_selectedType') || '' : '';

    return {
      project: initialProject, // Added
      computation: initialComputation,
      package: initialPackage,
      type: initialType,
      title: '',
      objectives: '',
      requirements: '',
      submittedBy: ''
    };
  });

  const [selectedProject, setSelectedProject] = useState<string>(() => { // Added
    if (typeof window !== 'undefined') {
      return localStorage.getItem('jobForm_selectedProject') || '';
    }
    return '';
  });
  const [selectedComputation, setSelectedComputation] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('jobForm_selectedComputation') || '';
    }
    return '';
  });
  const [selectedPackage, setSelectedPackage] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('jobForm_selectedPackage') || '';
    }
    return '';
  });
  const [selectedType, setSelectedType] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('jobForm_selectedType') || '';
    }
    return '';
  });
  const [errors, setErrors] = useState<Partial<JobFormData>>({});

  // State for managing projects
  const [allProjects, setAllProjects] = useState<ProjectCategory[]>([]);
  const [isAddingProject, setIsAddingProject] = useState(false);
  const [newProjectNameInput, setNewProjectNameInput] = useState('');
  const [isManagingProjects, setIsManagingProjects] = useState(false); // New state for managing projects view
  const [projectListVersion, setProjectListVersion] = useState(0); // To trigger project list refresh

  // Load and merge projects on mount and when project list version changes
  useEffect(() => {
    const staticProjects = getProjectCategories(); // From projects.ts (likely empty or base set)
    const userAddedProjectsString = typeof window !== 'undefined' ? localStorage.getItem('jobForm_userAddedProjects') : null;
    const userAddedProjects: ProjectCategory[] = userAddedProjectsString ? JSON.parse(userAddedProjectsString) : [];
    
    const combinedProjects = [...staticProjects, ...userAddedProjects].sort((a, b) => {
      const numA = parseInt(a.id.replace('P', ''));
      const numB = parseInt(b.id.replace('P', ''));
      if (!isNaN(numA) && !isNaN(numB)) return numA - numB;
      return a.id.localeCompare(b.id); // Fallback sort
    });
    setAllProjects(combinedProjects);
  }, [projectListVersion]); // Refreshes when a project is added or deleted

  // Sync formData with selected values from state
  useEffect(() => {
    setFormData(prev => ({
      ...prev,
      project: selectedProject, // Added
      computation: selectedComputation,
      package: selectedPackage,
      type: selectedType,
    }));
  }, [selectedProject, selectedComputation, selectedPackage, selectedType]); // selectedProject will be updated by new project logic

  // const projectCategories = getProjectCategories(); // Now using allProjects
  const computationCategories = getComputationCategories();
  const packageCategories = getPackageCategories();
  const typeCategories = getTypeCategories();

  const validateForm = (): boolean => {
    const newErrors: Partial<JobFormData> = {};

    if (!formData.project) newErrors.project = 'Please select a project'; // Added
    if (!formData.computation) newErrors.computation = 'Please select a computation';
    if (!formData.package) newErrors.package = 'Please select a package';
    if (!formData.type) newErrors.type = 'Please select a type';
    if (!formData.title.trim()) newErrors.title = 'Title is required';
    if (!formData.objectives.trim()) newErrors.objectives = 'Objectives are required';
    if (!formData.requirements.trim()) newErrors.requirements = 'Requirements are required';
    if (!formData.submittedBy.trim()) newErrors.submittedBy = 'Your name is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    const newJob = saveJob({
      ...formData,
      status: 'submitted'
    });

    onJobSubmitted(newJob);

    // Reset form
    setFormData({
      project: '', // Added
      computation: '',
      package: '',
      type: '',
      title: '',
      objectives: '',
      requirements: '',
      submittedBy: ''
    });
    setSelectedProject(''); // Added
    setSelectedComputation('');
    setSelectedPackage('');
    setSelectedType('');
    setErrors({});
    if (typeof window !== 'undefined') {
      localStorage.removeItem('jobForm_selectedProject'); // Added
      localStorage.removeItem('jobForm_selectedComputation');
      localStorage.removeItem('jobForm_selectedPackage');
      localStorage.removeItem('jobForm_selectedType');
    }
  };

  useEffect(() => {
    if (typeof window !== 'undefined' && selectedProject) { // Added project localStorage logic
      localStorage.setItem('jobForm_selectedProject', selectedProject);
    } else if (typeof window !== 'undefined' && !selectedProject) {
      localStorage.removeItem('jobForm_selectedProject');
    }
  }, [selectedProject]);

  useEffect(() => {
    if (typeof window !== 'undefined' && selectedComputation) {
      localStorage.setItem('jobForm_selectedComputation', selectedComputation);
    } else if (typeof window !== 'undefined' && !selectedComputation) {
      // localStorage.removeItem('jobForm_selectedComputation');
    }
  }, [selectedComputation]);

  useEffect(() => {
    if (typeof window !== 'undefined' && selectedPackage) {
      localStorage.setItem('jobForm_selectedPackage', selectedPackage);
    } else if (typeof window !== 'undefined' && !selectedPackage) {
      // localStorage.removeItem('jobForm_selectedPackage');
    }
  }, [selectedPackage]);

  useEffect(() => {
    if (typeof window !== 'undefined' && selectedType) {
      localStorage.setItem('jobForm_selectedType', selectedType);
    } else if (typeof window !== 'undefined' && !selectedType) {
      // localStorage.removeItem('jobForm_selectedType');
    }
  }, [selectedType]);

  const handleSaveNewProject = () => {
    if (!newProjectNameInput.trim()) {
      alert('Project name cannot be empty.');
      return;
    }

    // Fetch current static and user-added projects to determine the next ID
    const staticProjects = getProjectCategories();
    const userAddedProjectsString = localStorage.getItem('jobForm_userAddedProjects');
    const userAddedProjects: ProjectCategory[] = userAddedProjectsString ? JSON.parse(userAddedProjectsString) : [];
    const currentProjectsForIdGeneration = [...staticProjects, ...userAddedProjects];
    
    let maxPId = 0;
    currentProjectsForIdGeneration.forEach(p => {
      if (p.id.startsWith('P')) {
        const num = parseInt(p.id.substring(1));
        if (!isNaN(num) && num > maxPId) {
          maxPId = num;
        }
      }
    });
    const newProjectId = `P${maxPId + 1}`;

    const newProject: ProjectCategory = {
      id: newProjectId,
      name: newProjectNameInput.trim(),
    };

    // Add to user-added projects in localStorage
    const updatedUserAddedProjects = [...userAddedProjects, newProject];
    localStorage.setItem('jobForm_userAddedProjects', JSON.stringify(updatedUserAddedProjects));

    setNewProjectNameInput('');
    setIsAddingProject(false);
    setProjectListVersion(prev => prev + 1); // Trigger project list refresh
    setSelectedProject(newProjectId); 
    setFormData(prev => ({ ...prev, project: newProjectId }));
    setErrors(prev => ({ ...prev, project: undefined }));
  };

  const handleDeleteUserProject = (projectIdToDelete: string) => {
    if (!window.confirm(`Are you sure you want to delete project ${projectIdToDelete}? This action cannot be undone.`)) {
      return;
    }
    const userAddedProjectsString = localStorage.getItem('jobForm_userAddedProjects');
    let userAddedProjects: ProjectCategory[] = userAddedProjectsString ? JSON.parse(userAddedProjectsString) : [];
    userAddedProjects = userAddedProjects.filter(p => p.id !== projectIdToDelete);
    localStorage.setItem('jobForm_userAddedProjects', JSON.stringify(userAddedProjects));

    setProjectListVersion(prev => prev + 1); // Trigger project list refresh

    // If the deleted project was selected, reset selection
    if (selectedProject === projectIdToDelete) {
      setSelectedProject('');
      setFormData(prev => ({ ...prev, project: '' }));
    }
  };

  const handleProjectSelect = (projectId: string) => { // Added
    setSelectedProject(projectId);
    setFormData(prev => ({ ...prev, project: projectId }));
    setErrors(prev => ({ ...prev, project: undefined }));
  };

  const handleComputationSelect = (computationId: string) => {
    setSelectedComputation(computationId);
    setFormData(prev => ({ ...prev, computation: computationId }));
    setErrors(prev => ({ ...prev, computation: undefined }));
  };

  const handlePackageSelect = (packageId: string) => {
    setSelectedPackage(packageId);
    setFormData(prev => ({ ...prev, package: packageId }));
    setErrors(prev => ({ ...prev, package: undefined }));
  };

  const handleTypeSelect = (typeId: string) => {
    setSelectedType(typeId);
    setFormData(prev => ({ ...prev, type: typeId }));
    setErrors(prev => ({ ...prev, type: undefined }));
  };

  return (
    <div className="p-8">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Submit New Calculation Job</h2>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Project Selection & Management */}
        <div className="space-y-2">
          <div className="flex flex-row items-end gap-x-2">
            <div className="flex-grow">
              <label htmlFor="project" className="block text-sm font-medium text-gray-700 mb-1">
                Project *
              </label>
              <select
                id="project"
                value={selectedProject}
                onChange={(e) => handleProjectSelect(e.target.value)}
                className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 ${
                  errors.project ? 'border-red-500' : 'border-gray-300'
                }`}
                disabled={isAddingProject || isManagingProjects} // Disable while adding/managing
              >
                <option value="" disabled>Select Project</option>
                {allProjects.map((proj) => (
                  <option key={proj.id} value={proj.id}>
                    {proj.id} - {proj.name}
                  </option>
                ))}
              </select>
              {errors.project && (
                <p className="mt-1 text-sm text-red-600">{errors.project}</p>
              )}
            </div>
            <button 
              type="button" 
              onClick={() => { setIsAddingProject(true); setIsManagingProjects(false); }}
              disabled={isAddingProject || isManagingProjects}
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 whitespace-nowrap disabled:opacity-50"
            >
              New Project
            </button>
            <button 
              type="button" 
              onClick={() => { setIsManagingProjects(true); setIsAddingProject(false); }}
              disabled={isAddingProject || isManagingProjects}
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-yellow-500 hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-400 whitespace-nowrap disabled:opacity-50"
            >
              Manage Projects
            </button>
          </div>

          {isAddingProject && (
            <div className="mt-2 p-4 border border-gray-200 rounded-md bg-gray-50">
              {/* <h3 className="text-lg font-medium text-gray-800 mb-3">Add New Project</h3> */}
              <label htmlFor="newProjectName" className="block text-sm font-medium text-gray-700 mb-1">
                New Project Name
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  id="newProjectName"
                  value={newProjectNameInput}
                  onChange={(e) => setNewProjectNameInput(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
                  placeholder="Enter new project name"
                />
                <button
                  type="button"
                  onClick={handleSaveNewProject}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm font-medium"
                >
                  Save
                </button>
                <button
                  type="button"
                  onClick={() => { setIsAddingProject(false); setNewProjectNameInput(''); }}
                  className="px-4 py-2 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400 text-sm font-medium"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}

          {isManagingProjects && (
            <div className="mt-2 p-4 border border-gray-200 rounded-md bg-gray-50">
              <div className="flex justify-between items-center mb-3">
                <h3 className="text-lg font-medium text-black">Manage User-Added Projects</h3>
                <button
                  type="button"
                  onClick={() => setIsManagingProjects(false)}
                  className="px-3 py-1 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400 text-sm font-medium"
                >
                  Close
                </button>
              </div>
              {(typeof window !== 'undefined' && localStorage.getItem('jobForm_userAddedProjects') && JSON.parse(localStorage.getItem('jobForm_userAddedProjects')!).length > 0) ? (
                <ul className="space-y-2 max-h-60 overflow-y-auto">
                  {JSON.parse(localStorage.getItem('jobForm_userAddedProjects')!).map((proj: ProjectCategory) => (
                    <li key={proj.id} className="flex justify-between items-center p-2 border rounded-md bg-white">
                      <span className="text-black">{proj.id} - {proj.name}</span> {/* Changed text color to black */}
                      <button
                        type="button"
                        onClick={() => handleDeleteUserProject(proj.id)}
                        className="px-3 py-1 bg-red-500 text-white rounded-md hover:bg-red-600 text-sm font-medium"
                      >
                        Delete
                      </button>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-600">No user-added projects to manage.</p>
              )}
            </div>
          )}
        </div>

        {/* Computation, Package, and Type Selection on the same line */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Computation Selection */}
          <div>
            <label htmlFor="computation" className="block text-sm font-medium text-gray-700 mb-1">
              Computation *
            </label>
            <select
              id="computation"
              value={selectedComputation}
              onChange={(e) => handleComputationSelect(e.target.value)}
              className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 ${
                errors.computation ? 'border-red-500' : 'border-gray-300'
              }`}
            >
              <option value="" disabled>Select Computation</option>
              {computationCategories.map((comp) => (
                <option key={comp.id} value={comp.id}>
                  {comp.name}
                </option>
              ))}
            </select>
            {errors.computation && (
              <p className="mt-1 text-sm text-red-600">{errors.computation}</p>
            )}
          </div>

          {/* Package Selection */}
          <div>
            <label htmlFor="package" className="block text-sm font-medium text-gray-700 mb-1">
              Package *
            </label>
            <select
              id="package"
              value={selectedPackage}
              onChange={(e) => handlePackageSelect(e.target.value)}
              className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 ${
                errors.package ? 'border-red-500' : 'border-gray-300'
              }`}
            >
              <option value="" disabled>Select Package</option>
              {packageCategories.map((pkg) => (
                <option key={pkg.id} value={pkg.id}>
                  {pkg.name} {pkg.version}
                </option>
              ))}
            </select>
            {errors.package && (
              <p className="mt-1 text-sm text-red-600">{errors.package}</p>
            )}
          </div>

          {/* Type Selection */}
          <div>
            <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-1">
              Type *
            </label>
            <select
              id="type"
              value={selectedType}
              onChange={(e) => handleTypeSelect(e.target.value)}
              className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 ${
                errors.type ? 'border-red-500' : 'border-gray-300'
              }`}
            >
              <option value="" disabled>Select Type</option>
              {typeCategories.map((type) => (
                <option key={type.id} value={type.id}>
                  {type.name}
                </option>
              ))}
            </select>
            {errors.type && (
              <p className="mt-1 text-sm text-red-600">{errors.type}</p>
            )}
          </div>
        </div>

        {/* Job Title */}
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
            Job Title *
          </label>
          <input
            type="text"
            id="title"
            value={formData.title}
            onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
            className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 placeholder-gray-500 ${
              errors.title ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="Enter a descriptive title for your calculation job"
          />
          {errors.title && (
            <p className="mt-1 text-sm text-red-600">{errors.title}</p>
          )}
        </div>

        {/* Objectives */}
        <div>
          <label htmlFor="objectives" className="block text-sm font-medium text-gray-700 mb-2">
            Objectives *
          </label>
          <textarea
            id="objectives"
            rows={4}
            value={formData.objectives}
            onChange={(e) => setFormData(prev => ({ ...prev, objectives: e.target.value }))}
            className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 placeholder-gray-500 ${
              errors.objectives ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="Describe what you want to achieve with this calculation..."
          />
          {errors.objectives && (
            <p className="mt-1 text-sm text-red-600">{errors.objectives}</p>
          )}
        </div>

        {/* Requirements */}
        <div>
          <label htmlFor="requirements" className="block text-sm font-medium text-gray-700 mb-2">
            Requirements & Specifications *
          </label>
          <textarea
            id="requirements"
            rows={4}
            value={formData.requirements}
            onChange={(e) => setFormData(prev => ({ ...prev, requirements: e.target.value }))}
            className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 placeholder-gray-500 ${
              errors.requirements ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="Specify computational methods, parameters, materials, and any other requirements..."
          />
          {errors.requirements && (
            <p className="mt-1 text-sm text-red-600">{errors.requirements}</p>
          )}
        </div>

        {/* Submitted By */}
        <div>
          <label htmlFor="submittedBy" className="block text-sm font-medium text-gray-700 mb-2">
            Your Name *
          </label>
          <input
            type="text"
            id="submittedBy"
            value={formData.submittedBy}
            onChange={(e) => setFormData(prev => ({ ...prev, submittedBy: e.target.value }))}
            className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 placeholder-gray-500 ${
              errors.submittedBy ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="Enter your full name"
          />
          {errors.submittedBy && (
            <p className="mt-1 text-sm text-red-600">{errors.submittedBy}</p>
          )}
        </div>

        {/* Submit Button */}
        <div className="flex justify-end">
          <button
            type="submit"
            className="bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors font-medium"
          >
            Submit Job Assignment
          </button>
        </div>
      </form>
    </div>
  );
}
