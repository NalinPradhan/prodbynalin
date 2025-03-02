import { connectToDatabase } from "@/lib/mongodb";
import { Song } from "@/models/Song";

export async function POST(request: Request) {
  try {
    await connectToDatabase();
    const payload = await request.json();
    const event = payload.notification_type;
    console.log("Received webhook event:", event);

    if (event === "upload") {
      const songInfo = {
        id: payload.public_id,
        title: payload.original_filename,
        url: payload.secure_url,
        duration: Math.round(payload.duration), // Rounds to nearest second
        uploadedAt: payload.created_at,
        format: payload.format,
      };

      // Store in MongoDB
      await Song.findOneAndUpdate({ id: songInfo.id }, songInfo, {
        upsert: true,
        new: true,
      });

      console.log("New song saved to database:", songInfo);
    }

    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } catch (error) {
    console.error("Error handling webhook:", error);
    return new Response(JSON.stringify({ error: "Failed to handle webhook" }), {
      status: 500,
    });
  }
}
