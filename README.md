# Material Calculation Job System

A comprehensive web application for submitting and managing computational materials science assignments with dynamic project management, automated job numbering, and report generation.

## Features

### 🎯 Core Functionality

- **Structured Job Definition**: Define jobs using Project, Computation, Package, and Type dropdowns.
- **Dynamic Project Management**: Users can create new projects on-the-fly and manage (delete) user-added projects. Project selections are persisted.
- **Automatic Job Numbering**: Sequential job numbers based on the selected Project ID (e.g., P1-001 for the first job in Project "P1").
- **Interactive Form**: User-friendly interface for submitting calculation requirements, with persisted selections for dropdowns.
- **Job Management**: View, filter, and manage all submitted jobs. Expanded view for detailed job information.

### 📄 Report Generation

- **PDF Reports**: Professional PDF documents with comprehensive job details including Project, Computation, Package, and Type.
- **Markdown Export**: Structured markdown files for documentation, including all relevant job details.
- **Automatic Formatting**: Consistent formatting with job numbers, dates, and detailed categorization.

### 🎨 User Interface

- **Modern Design**: Clean, responsive interface built with Tailwind CSS.
- **Dropdown Selection**: Efficient selection for Project, Computation, Package, and Type.
- **Job Filtering**: Filter by status and search by keywords.
- **Real-time Updates**: Immediate feedback and status updates on job submission and management.

### 💾 Data Persistence

- **Browser Storage**: All job data and user-added projects persist across browser sessions using `localStorage` or `sessionStorage`.
- **Storage Preference**: Users can choose between `localStorage` (persistent across browser restarts) and `sessionStorage` (cleared when the browser tab is closed) via the Settings modal.
- **Automatic Backup (Implicit)**: When `localStorage` is used, data is inherently backed up in the browser's local storage.
- **Sample Data Loading**: Demo jobs can be loaded to showcase functionality.
- **Cross-Session Continuity**: Data (jobs and user projects) survives browser restarts and page refreshes when `localStorage` is selected.
- **Sequential Numbering**: Job numbers are maintained consistently based on the selected project and existing jobs in the chosen storage.

## Technology Stack

- **Frontend**: Next.js (latest) with React 18
- **Styling**: Tailwind CSS for modern, responsive design
- **TypeScript**: Full type safety and better development experience
- **PDF Generation**: jsPDF for client-side PDF creation
- **Date Handling**: `Date` object methods and ISO string formatting.
- **State Management**: React Hooks (`useState`, `useEffect`).

## Getting Started

### Prerequisites

- Node.js 18+
- npm package manager (comes with Node.js)

### Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd material-calculation-job-system
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Start the development server**

   ```bash
   npm run dev
   ```

   This will typically start the server with Turbopack for faster development.

4. **Open your browser**

   Navigate to [http://localhost:3000](http://localhost:3000)

### Available Scripts

```bash
npm run dev          # Start development server (usually with Turbopack)
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
```

## Usage

The application is divided into two main tabs: "Submit New Job" and "Job List".

### Submitting a New Job

1. **Navigate to the "Submit New Job" tab.** This is usually the default view.
2. **Project Selection / Creation**:
    - **Select an Existing Project**: Choose a project from the "Project" dropdown. The list includes predefined projects and any projects you've added.
    - **Create a New Project**:
        1. Click the "New Project" button.
        2. An input field for "New Project Name" will appear.
        3. Enter the desired name for your new project.
        4. Click "Save". The new project will be assigned a sequential ID (e.g., P1, P2), added to the projects list, and automatically selected.
        5. To cancel, click "Cancel".
3. **Select Computation**: Choose the type of computation (e.g., DFT, MD) from the "Computation" dropdown.
4. **Select Package**: Choose the software package (e.g., VASP, LAMMPS) from the "Package" dropdown.
5. **Select Type**: Choose the calculation type (e.g., Single Point, Optimization) from the "Type" dropdown.
6. **Enter Job Title**: Provide a descriptive title for your calculation job.
7. **Enter Objectives**: Clearly state what you aim to achieve with this calculation.
8. **Enter Requirements & Specifications**: Detail the computational methods, parameters, materials, system size, and any other specific requirements.
9. **Enter Your Name**: Provide your name for attribution.
10. **Submit**: Click the "Submit Job Assignment" button.
    - The system will validate the form. If any required fields are missing, error messages will appear.
    - Upon successful submission, a unique job number (e.g., P1-001) will be automatically assigned.
    - The job will be saved according to the storage preference (localStorage/sessionStorage).
    - The form will reset, and your dropdown selections (Project, Computation, Package, Type) will be remembered for the next submission within the current session or persistently if localStorage is used.

### Managing User-Added Projects

1. **Navigate to the "Submit New Job" tab.**
2. **Access Management View**: Click the "Manage Projects" button.
    - A list of user-added projects will appear. Predefined projects (if any from `projects.ts`) are not listed here for deletion.
3. **Delete a Project**:
    - For each project in the list, there is a "Delete" button.
    - Click "Delete" next to the project you wish to remove.
    - A confirmation prompt will appear. Confirm to delete the project.
    - The project will be removed from `localStorage` (specifically from the `jobForm_userAddedProjects` key).
    - **Note**: Deleting a project here only removes it from the list of available projects for new job submissions. It does *not* delete existing jobs already associated with that project ID.
4. **Close Management View**: Click the "Close" button to return to the job submission form.

### Managing Jobs (Job List Tab)

1. **Navigate to the "Job List" tab.**
2. **View Jobs**: All submitted jobs are displayed in a table format, showing key information like Job Number, Title, Project, Submitted Date, and Status.
3. **Filter Jobs**:
    - **By Status**: Use the "Filter by status" dropdown to show jobs with a specific status (e.g., Submitted, In Progress, Completed, Archived).
    - **By Keyword**: Use the "Search jobs..." input field to search for jobs by title, job number, or other text content.
4. **View Job Details**:
    - Click the "View Details" button (or the expand icon) for any job.
    - The job entry will expand to show all details, including Project, Computation, Package, Type, Objectives, Requirements, and Submitted By.
5. **Update Job Status**:
    - In the expanded view, a "Change Status" dropdown allows you to update the job's status.
    - Select a new status and it will be updated immediately.
6. **Generate Reports**:
    - **PDF Report**: In the expanded view, click "Generate PDF". A PDF file containing all job details will be generated and downloaded by your browser.
    - **Markdown Export**: In the expanded view, click "Export MD". A Markdown file (`.md`) with the job details will be generated and downloaded.
7. **Delete a Job**:
    - In the expanded view, click the "Delete Job" button.
    - A confirmation prompt will appear. Confirm to permanently delete the job from the system.

### Settings (Gear Icon)

1. **Access Settings**: Click the gear icon (⚙️) typically located in the header or navigation area.
2. **Storage Preference**:
    - Choose between `localStorage` (data persists after browser closes) and `sessionStorage` (data is cleared when the browser tab/window is closed).
    - The default is usually `localStorage`.
    - Changing this setting will affect where new jobs and project configurations are saved. It does *not* automatically migrate existing data from one storage type to another.
3. **Load Sample Data**: Click "Load Sample Jobs" to populate the job list with predefined example jobs. This is useful for demonstration or testing. This will overwrite any existing jobs in the currently selected storage.
4. **Clear All Data**:
    - **Clear All Jobs**: Click to remove all jobs from the currently selected storage type.
    - **Clear User Projects**: Click to remove all user-added projects from `localStorage`.
    - **Clear All Settings**: Click to reset any stored settings to their defaults.
    - Use these options with caution as data deletion is permanent.

## Job Numbering System

Jobs are automatically numbered using the format: `ProjectID-SEQ`

- `ProjectID`: The ID of the project selected or created for the job (e.g., `P1`, `P2`).
- `SEQ`: A sequential three-digit number (e.g., `001`, `002`) for that specific project.

Examples:

- `P1-001` - First job submitted under Project P1.
- `P1-002` - Second job submitted under Project P1.
- `P12-005` - Fifth job submitted under Project P12.

The sequence number increments for each new job within the same project.

## Testing Data Persistence

The system uses the browser's Web Storage API (`localStorage` or `sessionStorage`) to persist job data and user-added projects.

1. **Select Storage Type**: Go to Settings (⚙️) and choose `localStorage` for persistence across browser sessions.
2. **Create Projects**: In the "Submit New Job" tab, create a few new projects.
3. **Submit Jobs**: Submit several jobs, assigning them to different projects (both predefined and user-created).
4. **Verify**:
    - Check the "Job List" tab to see if all submitted jobs are visible.
    - Check the "Project" dropdown in the "Submit New Job" tab to see if your user-added projects are listed.
5. **Refresh the page**: All projects and jobs should remain.
6. **Close and reopen the browser**: If `localStorage` was selected, all data should persist. If `sessionStorage` was selected, data will be cleared.
7. **Check Browser DevTools (Optional)**:
    - Open DevTools (usually F12 or Right-click → Inspect).
    - Go to the "Application" tab.
    - Under "Storage", expand "Local Storage" and select `http://localhost:3000`.
        - Look for the key `material-calculation-jobs` (for job data).
        - Look for the key `jobForm_userAddedProjects` (for user-created projects).
        - Look for keys like `jobForm_selectedProject` for persisted form selections.
    - If `sessionStorage` is active, check under the "Session Storage" section similarly.

## Project Structure

```text
src/
├── app/                    # Next.js app directory
│   ├── api/               # API routes (if any backend logic is used, e.g., for future database integration)
│   │   └── jobs/         # Example: Job management endpoints (currently client-side)
│   ├── favicon.ico       # Application favicon
│   ├── globals.css       # Global styles
│   ├── layout.tsx        # Root layout
│   └── page.tsx          # Main page component (contains tabs for submit/list)
├── components/            # React components
│   ├── JobList.tsx           # Displays the list of jobs, handles filtering, details view, actions
│   ├── JobSubmissionForm.tsx  # Form for submitting new jobs, project management UI
│   └── SettingsModal.tsx     # Modal for application settings (storage, sample data)
├── data/                  # Static data and initial configurations
│   ├── computations.ts     # Predefined computation categories
│   ├── packages.ts         # Predefined package categories
│   ├── projects.ts         # Predefined project categories (can be empty if all are user-added)
│   ├── sampleJobs.ts       # Sample job data for demonstration
│   └── types.ts            # Predefined type categories (calculation types)
├── types/                # TypeScript type definitions
│   └── job.ts           # Core job and project related type definitions
├── utils/               # Utility functions
│   ├── jobManager.ts    # Handles all logic for job and project data CRUD operations (load, save, generate ID, etc.) using browser storage
│   └── reportGenerator.ts # Logic for generating PDF and Markdown reports
└── lib/                 # Shared libraries (if any, e.g., helper functions)
    └── utils.ts         # Common utility functions (currently minimal or non-existent)
```

## Data Storage

The application currently uses the browser's Web Storage API (`localStorage` or `sessionStorage`) for all data persistence, including job submissions and user-created projects. This makes it a fully client-side application without a backend database.

For future enhancements or production use requiring more robust, scalable, and centralized storage, consider integrating with:

- **Database**: PostgreSQL, MongoDB, Firebase Firestore, or similar.
- **Backend API**: A dedicated backend service (e.g., Node.js/Express, Python/Django/FastAPI) to manage data and business logic.
- **Authentication**: Implement user accounts for personalized job management.

## Contributing

1. Fork the repository.
2. Create a feature branch (`git checkout -b feature/AmazingFeature`).
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`).
4. Push to the branch (`git push origin feature/AmazingFeature`).
5. Open a Pull Request.

## Future Enhancements

- [ ] User authentication and authorization.
- [ ] Backend database integration for persistent and centralized storage.
- [ ] File upload capabilities for input/output files related to jobs.
- [ ] Email notifications for job status updates or reminders.
- [ ] More advanced filtering, sorting, and search capabilities in the job list.
- [ ] Job status tracking with a more detailed workflow (e.g., queued, running, failed).
- [ ] Direct integration with computational software or cluster submission systems.
- [ ] Collaborative features for teams sharing projects and jobs.
- [ ] Analytics and reporting dashboard on job statistics.

## License

This project is licensed under the MIT License - see the `LICENSE` file for details (if one is created).

## Support

For questions, issues, or contributions, please create an issue in the GitHub repository.

---

Built with ❤️ for the materials science community.
