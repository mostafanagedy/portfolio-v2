import { NextRequest, NextResponse } from "next/server";
import { fetchCertificatesFromGitHub } from "../../../lib/certificatesService";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const forceRefresh = searchParams.get("refresh") === "true";

    const data = await fetchCertificatesFromGitHub(forceRefresh);

    return NextResponse.json(data, {
      status: 200,
      headers: {
        "Cache-Control": forceRefresh
          ? "no-cache, no-store, must-revalidate"
          : "public, s-maxage=600, stale-while-revalidate=1200",
      },
    });
  } catch (error) {
    console.error("[API /api/certificates] Error fetching certificates:", error);
    return NextResponse.json(
      {
        error: "Failed to retrieve certificates from GitHub.",
        message: error instanceof Error ? error.message : "Unknown error",
        certificates: [],
        total: 0,
        categories: ["All", "LinkedIn Learning", "Coursera", "Workshops & Training"],
        sourceRepo: "https://github.com/mostafanagedy/my_Certificates",
      },
      { status: 500 }
    );
  }
}
