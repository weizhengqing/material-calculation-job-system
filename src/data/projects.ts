export interface ProjectCategory {
  id: string; // e.g., 'P1', 'P2'
  name: string; // e.g., 'Surface stability study'
  description?: string;
}

// Initial static projects - these can be a base set or an empty array if all projects are user-defined.
const projectCategories: ProjectCategory[] = [
  // { id: 'P1', name: 'Surface stability study' },
  // { id: 'P2', name: 'Catalyst performance analysis' },
  // { id: 'P3', name: 'New material discovery' },
  // User-added projects will be loaded from localStorage in the component.
];

export const getProjectCategories = (): ProjectCategory[] => {
  return projectCategories;
};

export const getProjectCategoryById = (id: string, allProjects?: ProjectCategory[]): ProjectCategory | undefined => {
  // If allProjects is provided (e.g., from component state including user-added ones), search there.
  if (allProjects) {
    return allProjects.find(p => p.id === id);
  }
  // Otherwise, fall back to the static list (though this might be less useful if projects are dynamic)
  return projectCategories.find(p => p.id === id);
};
