import { connectToDatabase } from "@/lib/mongodb";
import { Song } from "@/models/Song";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    console.log("connecting to db...");
    await connectToDatabase();
    const songs = await Song.find({}).sort({ uploadedAt: -1 });

    return NextResponse.json(songs);
  } catch (error) {
    console.error("Error fetching songs:", error);
    return NextResponse.json(
      { error: "Failed to fetch songs" },
      { status: 500 }
    );
  }
}
