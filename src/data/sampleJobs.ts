import { JobSubmission } from '@/types/job';

// Sample jobs for demonstration
export const SAMPLE_JOBS: JobSubmission[] = [
  {
    id: 'sample-1',
    jobNumber: 'DE2025001',
    category: 'density-calculation',
    title: 'First-principles density calculation of graphene monolayer',
    objectives: 'Calculate the electronic density distribution and total energy of pristine graphene using DFT methods. Investigate the charge density distribution and compare with experimental values.',
    requirements: 'Use PBE exchange-correlation functional, plane-wave basis set with 500 eV cutoff energy, k-point mesh of 12x12x1, and convergence criteria of 1e-6 eV for energy and 1e-5 eV/Å for forces.',
    submittedAt: new Date('2025-05-20'),
    submittedBy: 'Dr. Sarah Chen',
    status: 'completed'
  },
  {
    id: 'sample-2',
    jobNumber: 'EL2025001',
    category: 'electronic-structure',
    title: 'Band structure analysis of MoS2 bilayer',
    objectives: 'Determine the electronic band structure of AB-stacked MoS2 bilayer and analyze the bandgap evolution compared to monolayer. Study the effect of interlayer coupling on electronic properties.',
    requirements: 'HSE06 hybrid functional for accurate bandgap, SOC included, high-symmetry k-path from Γ-M-K-Γ, minimum 8x8x4 k-point mesh for self-consistent calculation.',
    submittedAt: new Date('2025-05-22'),
    submittedBy: 'Prof. Michael Zhang',
    status: 'in-progress'
  },
  {
    id: 'sample-3',
    jobNumber: 'ME2025001',
    category: 'mechanical-properties',
    title: 'Elastic constants of cubic silicon carbide',
    objectives: 'Calculate the complete elastic tensor of 3C-SiC and derive mechanical properties including bulk modulus, shear modulus, and Poisson ratio. Assess mechanical stability.',
    requirements: 'Strain-stress method with strain amplitudes ±0.5%, PBE-D3 dispersion correction, 15x15x15 k-point mesh, stress convergence better than 0.01 GPa.',
    submittedAt: new Date('2025-05-25'),
    submittedBy: 'Dr. Lisa Wang',
    status: 'submitted'
  }
];

export const loadSampleJobs = () => {
  return SAMPLE_JOBS;
};
