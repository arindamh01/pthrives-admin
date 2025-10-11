import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

// Force dynamic rendering
export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const slug = searchParams.get('slug');
    const courseId = searchParams.get('course_id'); // For edit mode, exclude current course

    if (!slug) {
      return NextResponse.json(
        { success: false, message: 'Slug is required' },
        { status: 400 }
      );
    }

    let query = supabase
      .from('gbl_courses')
      .select('course_id')
      .eq('slug', slug);

    // If editing, exclude current course from check
    if (courseId) {
      query = query.neq('course_id', courseId);
    }

    const { error } = await query.single();

    if (error && error.code === 'PGRST116') {
      // No rows returned - slug is available
      return NextResponse.json({
        success: true,
        available: true,
        message: 'Slug is available',
      });
    }

    if (error) {
      console.error('Error checking slug:', error);
      return NextResponse.json(
        { success: false, message: 'Error checking slug availability' },
        { status: 500 }
      );
    }

    // Slug already exists (data was found)
    return NextResponse.json({
      success: true,
      available: false,
      message: 'Slug is already taken',
    });
  } catch (error) {
    console.error('Error in slug validation:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}

