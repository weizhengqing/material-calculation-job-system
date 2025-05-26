# LocalStorage Persistence Test Guide

## 🧪 Testing localStorage Data Persistence

This guide will help you verify that the Material Calculation Job System correctly saves and loads data from localStorage.

### Prerequisites
- Development server is running on http://localhost:3001
- Browser with localStorage support (all modern browsers)

### Test Scenarios

#### ✅ Test 1: Initial Sample Data Loading
1. **Fresh Start**: Open the application in a fresh browser session (or clear localStorage)
2. **Expected Behavior**: 
   - Application should load with sample jobs already displayed
   - Jobs should be automatically assigned sequential job numbers
   - Sample jobs should be saved to localStorage automatically

#### ✅ Test 2: New Job Submission Persistence
1. **Submit a New Job**:
   - Go to "Submit New Job" tab
   - Select a category (e.g., "Density Calculations")
   - Fill in job details:
     - Title: "Test Job Persistence"
     - Objectives: "Testing data persistence functionality"
     - Requirements: "Verify localStorage integration"
     - Your Name: "Test User"
   - Click "Submit Job Assignment"

2. **Expected Behavior**:
   - Job should be assigned a new sequential number (e.g., DE2025004)
   - Automatically switch to Job List tab
   - New job should appear in the list

#### ✅ Test 3: Data Persistence After Page Refresh
1. **After submitting the test job**, refresh the page (F5 or Cmd+R)
2. **Expected Behavior**:
   - All jobs (sample + new) should still be visible
   - Job numbers should remain the same
   - All job details should be preserved
   - No data loss should occur

#### ✅ Test 4: Sequential Job Numbering
1. **Submit multiple jobs** in the same category
2. **Expected Behavior**:
   - Job numbers should increment sequentially
   - Each category should maintain its own numbering sequence
   - Example: DE2025001, DE2025002, DE2025003, etc.

#### ✅ Test 5: Cross-Session Persistence
1. **Close the browser completely**
2. **Reopen browser** and navigate to http://localhost:3001
3. **Expected Behavior**:
   - All previously submitted jobs should still be present
   - Data should persist across browser sessions

### 🔍 How to Inspect localStorage (Developer Tools)

#### Chrome/Safari:
1. Press F12 (or right-click → Inspect)
2. Go to "Application" tab
3. Navigate to "Local Storage" → "http://localhost:3001"
4. Look for key: `material-calculation-jobs`

#### Firefox:
1. Press F12 (or right-click → Inspect Element)
2. Go to "Storage" tab
3. Navigate to "Local Storage" → "http://localhost:3001"
4. Look for key: `material-calculation-jobs`

### 📋 What to Look For in localStorage

The stored data should be a JSON array containing job objects with:
```json
[
  {
    "id": "uuid-string",
    "jobNumber": "DE2025001",
    "title": "Job Title",
    "category": "density-calculations",
    "objectives": "Job objectives...",
    "requirements": "Job requirements...",
    "submittedBy": "User Name",
    "status": "submitted",
    "submittedAt": "2025-05-26T10:30:00.000Z"
  }
]
```

### 🐛 Troubleshooting

#### If data is not persisting:
1. **Check browser localStorage support**: Most modern browsers support it
2. **Check for JavaScript errors**: Open browser console (F12) and look for errors
3. **Verify localStorage is not disabled**: Some privacy modes disable localStorage
4. **Check storage quota**: localStorage has size limits (usually 5-10MB)

#### If job numbers are not sequential:
1. **Clear localStorage** and refresh to test with clean state
2. **Check category prefix mapping** in the code
3. **Verify date handling** for year-based numbering

### ✨ Expected Features Working:

- ✅ **Automatic job numbering**: Category prefix + year + sequence
- ✅ **Data persistence**: Jobs survive page refreshes and browser restarts
- ✅ **Sample data loading**: Initial demonstration data on first visit
- ✅ **Form reset**: Form clears after successful submission
- ✅ **Report generation**: PDF and Markdown exports work with persisted data
- ✅ **Filtering**: Category and status filters work with persisted jobs

### 🎯 Success Criteria

The localStorage persistence is working correctly if:
1. ✅ Sample jobs load automatically on first visit
2. ✅ New jobs persist after page refresh
3. ✅ Job numbers increment sequentially
4. ✅ All job data (title, objectives, requirements, etc.) is preserved
5. ✅ Data persists across browser sessions
6. ✅ No JavaScript errors in browser console
7. ✅ localStorage contains valid JSON data

---

**Note**: This system uses localStorage for persistence, which is suitable for demo and development purposes. For production use, consider implementing a proper database backend.
