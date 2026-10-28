import { NextRequest, NextResponse } from "next/server";
import { fetchVercelDeployment } from "../../../../lib/vercelService";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const repo = searchParams.get("repo");
  const slug = searchParams.get("slug") || undefined;
  const homepage = searchParams.get("homepage") || undefined;
  const forceRefresh = searchParams.get("refresh") === "1" || searchParams.get("refresh") === "true";

  if (!repo) {
    return NextResponse.json({ error: "Missing required 'repo' parameter." }, { status: 400 });
  }

  try {
    const deploymentData = await fetchVercelDeployment(repo, slug, homepage, forceRefresh);

    return NextResponse.json(deploymentData, {
      headers: {
        "Cache-Control": "public, s-maxage=120, stale-while-revalidate=240",
      },
    });
  } catch (error: any) {
    console.error("Error in /api/vercel/deployment:", error);
    return NextResponse.json(
      {
        isConfigured: false,
        hasDeployment: false,
        error: error?.message || "Internal server error fetching Vercel deployment.",
        source: "error",
      },
      { status: 500 }
    );
  }
}
