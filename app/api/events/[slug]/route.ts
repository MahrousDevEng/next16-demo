import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import { Event } from "@/database";

type RouteParams = { params: Promise<{ slug: string }> };

export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    await connectDB();

    const { slug } = await params;

    // Validate slug parameter
    if (!slug || typeof slug !== "string" || slug.trim() === "") {
      return NextResponse.json(
        { message: "Invalid event slug." },
        { status: 400 }
      );
    }

    // Sanitize slug by trimming whitespaces
    const sanitizedSlug = slug.trim().toLowerCase();

    // Query event by slug
    const event = await Event.findOne({
      slug: sanitizedSlug,
    }).lean();

    // Handle not found event
    if (!event) {
      return NextResponse.json(
        { message: `Event with slug ${slug} not found` },
        { status: 404 }
      );
    }

    // Return successfull response with event data
    return NextResponse.json({
      message: "Event fetched successfully",
      event,
    });
  } catch (error) {
    console.log(error);

    return NextResponse.json(
      {
        message: "Could not fetch event.",
        error: error instanceof Error ? error.message : "Unkonwn",
      },
      { status: 500 }
    );
  }
}
