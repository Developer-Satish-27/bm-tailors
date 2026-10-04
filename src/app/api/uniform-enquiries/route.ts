import { NextRequest, NextResponse } from 'next/server';
import { uniformEnquirySchema } from '@/lib/validation';
import { UniformService } from '@/services/uniform.service';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const validated = uniformEnquirySchema.parse(body);

    const enquiry = await UniformService.submitEnquiry(validated);

    return NextResponse.json({
      success: true,
      data: { enquiry },
    });
  } catch (err: unknown) {
    return NextResponse.json(
      { success: false, error: { code: 'UNIFORM_ENQUIRY_FAILED', message: err instanceof Error ? err.message : 'Failed to submit enquiry' } },
      { status: 400 }
    );
  }
}
