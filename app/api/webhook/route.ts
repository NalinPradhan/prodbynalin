export async function POST(request: Request) {
  try {
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

      console.log("New song uploaded:", songInfo);
    }

    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } catch (error) {
    console.error("Error handling webhook:", error);
    return new Response(JSON.stringify({ error: "Failed to handle webhook" }), {
      status: 500,
    });
  }
}
