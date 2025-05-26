import { NextResponse } from 'next/server';

export async function GET() {
  // Since categories.ts is being removed, this API endpoint will now return an empty array.
  // Or, it should be updated to reflect the new data structure if applicable.
  // For now, returning an empty array to avoid errors.
  return NextResponse.json([]);
}
