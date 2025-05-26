import { NextRequest, NextResponse } from 'next/server';
import { saveJob, getJobs } from '@/utils/jobManager';
import { JobFormData } from '@/types/job';

export async function GET() {
  try {
    const jobs = getJobs();
    return NextResponse.json(jobs);
  } catch (error) {
    console.error('Error fetching jobs:', error);
    return NextResponse.json({ error: 'Failed to fetch jobs' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const jobData: JobFormData = await request.json();
    
    // Validate required fields
    if (!jobData.project || !jobData.computation || !jobData.package || !jobData.type || !jobData.title || !jobData.objectives || !jobData.requirements || !jobData.submittedBy) {
      return NextResponse.json({ error: 'Missing required fields. Ensure project, computation, package, type, title, objectives, requirements, and submittedBy are provided.' }, { status: 400 });
    }

    const newJob = saveJob({
      ...jobData,
      status: 'submitted'
    });

    return NextResponse.json(newJob, { status: 201 });
  } catch (error) {
    console.error('Error creating job:', error);
    return NextResponse.json({ error: 'Failed to create job' }, { status: 500 });
  }
}
