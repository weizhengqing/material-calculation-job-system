export interface ComputationCategory {
  id: string;
  name: string;
  description?: string;
}

export const computationCategories: ComputationCategory[] = [
  { id: 'dft', name: 'Density Functional Theory', description: 'Calculations based on DFT.' },
  { id: 'qc', name: 'Quantum Chemistry', description: 'Quantum chemistry methods.' },
  { id: 'md', name: 'Molecular Dynamics', description: 'Simulations of molecular motion.' },
];

export const getComputationCategories = () => computationCategories;

export const getComputationCategoryById = (id: string) =>
  computationCategories.find((comp) => comp.id === id);
