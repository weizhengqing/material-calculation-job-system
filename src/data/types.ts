export interface TypeCategory {
  id: string;
  name: string;
  description?: string;
}

export const typeCategories: TypeCategory[] = [
  { id: 'single_point', name: 'Single Point', description: 'Single point energy calculation.' },
  { id: 'struct_opt', name: 'Structural Optimization', description: 'Geometry optimization.' },
  { id: 'vars_test', name: 'Variables Test', description: 'Testing calculation variables.' },
  { id: 'band_struct', name: 'Band Structure', description: 'Electronic band structure calculation.' },
  { id: 'multi_data', name: 'Multiple Datasets', description: 'Calculations involving multiple datasets.' },
  { id: 'dft_u', name: 'DFT+U', description: 'DFT with Hubbard U correction.' },
];

export const getTypeCategories = () => typeCategories;

export const getTypeCategoryById = (id: string) =>
  typeCategories.find((type) => type.id === id);
