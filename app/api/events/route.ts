import { NextRequest, NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";
import connectDB from "@/lib/mongodb";
import { Event } from "@/database";

export async function GET() {
  try {
    await connectDB();

    const events = await Event.find().sort({ createdAt: -1 });

    return NextResponse.json({
      message: "Events fetched successfully",
      events,
    });
  } catch (error) {
    console.log(error);

    return NextResponse.json(
      {
        message: "Could not fetch events.",
        error: error instanceof Error ? error.message : "Unkonwn",
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const formData = await request.formData();

    let event;

    try {
      event = Object.fromEntries(formData.entries());
    } catch (error) {
      console.log(error);

      return NextResponse.json(
        { message: "Invalid form data." },
        { status: 400 }
      );
    }

    const file = formData.get("image") as File | null;

    if (!file)
      return NextResponse.json(
        { message: "Image file is required." },
        { status: 400 }
      );

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const uploadResult = await new Promise((resolve, reject) => {
      cloudinary.uploader
        .upload_stream(
          { resource_type: "image", folder: "nextjs-16-demo" },
          (error, result) => {
            if (error) return reject(error);
            resolve(result);
          }
        )
        .end(buffer);
    });

    event.image = (uploadResult as { secure_url: string }).secure_url;

    const tags = JSON.parse(formData.get("tags") as string);
    const agenda = JSON.parse(formData.get("agenda") as string);

    const createdEvent = await Event.create({ ...event, tags, agenda });

    return NextResponse.json(
      {
        message: "Event created successfully.",
        event: createdEvent,
      },
      { status: 201 }
    );
  } catch (error) {
    console.log(error);

    return NextResponse.json(
      {
        message: "Could not create event.",
        error: error instanceof Error ? error.message : "Unkonwn",
      },
      { status: 500 }
    );
  }
}
