import { NextRequest, NextResponse } from "next/server";
import { getProjectDetails } from "../../../../../lib/githubService";

export const dynamic = "force-dynamic";

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ slug: string }> }
) {
  const { slug } = await context.params;

  if (!slug) {
    return NextResponse.json({ error: "Slug parameter is required" }, { status: 400 });
  }

  try {
    const details = await getProjectDetails(slug);

    if (!details) {
      return NextResponse.json(
        { error: `Repository not found for slug '${slug}'` },
        { status: 404 }
      );
    }

    return NextResponse.json(details, {
      headers: {
        "Cache-Control": "public, s-maxage=300, stale-while-revalidate=600",
      },
    });
  } catch (error: any) {
    console.error(`Error in /api/github/repos/${slug}:`, error);
    return NextResponse.json(
      { error: error?.message || "Failed to retrieve project details" },
      { status: 500 }
    );
  }
}
