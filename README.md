# Material Calculation Job System

A comprehensive web application for submitting and managing computational materials science assignments with automated job numbering and report generation.

## Features

### 🎯 Core Functionality
- **Job Categories**: 8 predefined material calculation categories including density calculation, electronic structure, mechanical properties, and more
- **Automatic Job Numbering**: Sequential job numbers based on category and year (e.g., DE2025001 for first Density calculation in 2025)
- **Interactive Form**: User-friendly interface for submitting calculation requirements
- **Job Management**: View, filter, and manage all submitted jobs

### 📊 Calculation Categories
- **Density Calculation** (⚛️): First-principles density calculations
- **Electronic Structure** (🔬): Band structure and electronic properties analysis
- **Mechanical Properties** (🔧): Elastic constants and mechanical stability
- **Phonon Analysis** (📊): Vibrational properties and phonon dispersion
- **Magnetic Properties** (🧲): Magnetic moments and spin-polarized calculations
- **Optical Properties** (💡): Dielectric function and optical absorption
- **Surface Calculations** (🏔️): Surface energy and adsorption studies
- **Defect Analysis** (🔍): Point defects and vacancy formation energy

### 📄 Report Generation
- **PDF Reports**: Professional PDF documents with job details and specifications
- **Markdown Export**: Structured markdown files for documentation
- **Automatic Formatting**: Consistent formatting with job numbers, dates, and categorization

### 🎨 User Interface
- **Modern Design**: Clean, responsive interface built with Tailwind CSS
- **Category Selection**: Visual category cards with icons and descriptions
- **Job Filtering**: Filter by category, status, and other criteria
- **Real-time Updates**: Immediate feedback and status updates

### 💾 Data Persistence
- **LocalStorage Integration**: All job data persists across browser sessions
- **Automatic Backup**: Jobs are automatically saved to browser's local storage
- **Sample Data Loading**: Demo jobs loaded automatically on first visit
- **Cross-Session Continuity**: Data survives browser restarts and page refreshes
- **Sequential Numbering**: Job numbers maintained consistently across sessions

## Technology Stack

- **Frontend**: Next.js 15 with React 18
- **Styling**: Tailwind CSS for modern, responsive design
- **TypeScript**: Full type safety and better development experience
- **PDF Generation**: jsPDF for client-side PDF creation
- **Date Handling**: date-fns for robust date formatting
- **Icons**: Emoji-based visual indicators for categories

## Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn package manager

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

4. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

### Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
```

## Usage

### Submitting a New Job

1. **Select Category**: Choose from 8 material calculation categories
2. **Enter Details**: 
   - Job title (descriptive name for your calculation)
   - Objectives (what you want to achieve)
   - Requirements (computational methods, parameters, materials)
   - Your name (for attribution)
3. **Submit**: The system automatically assigns a job number and saves the submission

### Managing Jobs

1. **View Jobs**: Switch to the "Job List" tab to see all submissions
2. **Filter**: Use category and status filters to find specific jobs
3. **View Details**: Click "View Details" to expand job information
4. **Generate Reports**: 
   - Click "Generate PDF" for a professional report
   - Click "Export MD" for a markdown file

### Job Numbering System

Jobs are automatically numbered using the format: `[Category][Year][Sequential]`

Examples:
- `DE2025001` - First Density calculation job of 2025
- `EL2025003` - Third Electronic structure job of 2025
- `ME2025010` - Tenth Mechanical properties job of 2025

## Testing Data Persistence

The system uses localStorage to persist job data across browser sessions. To test this functionality:

1. **Submit a few jobs** using the web interface
2. **Refresh the page** - all jobs should remain visible
3. **Close and reopen the browser** - data should persist
4. **Check localStorage** in browser DevTools:
   - Open DevTools (F12)
   - Go to Application/Storage tab
   - Find "Local Storage" → "http://localhost:3000"
   - Look for key: `material-calculation-jobs`

For detailed testing instructions, see `PERSISTENCE_TEST_GUIDE.md`.

## Project Structure

```
src/
├── app/                    # Next.js app directory
│   ├── api/               # API routes
│   │   ├── jobs/         # Job management endpoints
│   │   └── categories/   # Category data endpoints
│   ├── globals.css       # Global styles
│   ├── layout.tsx        # Root layout
│   └── page.tsx          # Main page component
├── components/            # React components
│   ├── JobSubmissionForm.tsx  # Job submission form
│   └── JobList.tsx           # Job list and management
├── data/                  # Static data
│   └── categories.ts     # Calculation categories
├── types/                # TypeScript type definitions
│   └── job.ts           # Job-related types
├── utils/               # Utility functions
│   ├── jobManager.ts    # Job data management
│   └── reportGenerator.ts # PDF and MD generation
└── lib/                 # Shared libraries
    └── utils.ts         # Common utilities
```

## Data Storage

Currently, the application uses in-memory storage for demonstration purposes. For production use, consider integrating with:

- **Database**: PostgreSQL, MongoDB, or similar
- **File Storage**: AWS S3, Google Cloud Storage, or local file system
- **Authentication**: User management system
- **Persistence**: Redis for session management

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## Future Enhancements

- [ ] User authentication and authorization
- [ ] Database integration for persistent storage
- [ ] File upload capabilities for input files
- [ ] Email notifications for job status updates
- [ ] Advanced filtering and search capabilities
- [ ] Job status tracking and workflow management
- [ ] Integration with computational software (VASP, Quantum ESPRESSO, etc.)
- [ ] Collaborative features for research teams
- [ ] Analytics and reporting dashboard

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

For questions, issues, or contributions, please create an issue in the repository or contact the development team.

---

Built with ❤️ for the materials science community
