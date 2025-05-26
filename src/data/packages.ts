export interface PackageCategory {
  id: string;
  name: string;
  version?: string;
  description?: string;
}

export const packageCategories: PackageCategory[] = [
  { id: 'abinit', name: 'Abinit', version: 'v9.10.3', description: 'Abinit DFT software.' },
  { id: 'orca', name: 'Orca', version: '6.0', description: 'Orca quantum chemistry program.' },
  { id: 'gaussian', name: 'Gaussian', version: '16', description: 'Gaussian quantum chemistry software.' },
];

export const getPackageCategories = () => packageCategories;

export const getPackageCategoryById = (id: string) =>
  packageCategories.find((pkg) => pkg.id === id);
