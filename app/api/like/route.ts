import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

export async function POST(request: Request) {
  try {
    const { songId, songTitle } = await request.json();

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: process.env.EMAIL_USER,
      subject: `New Like on "${songTitle}"! 🎵`,
      html: `
        <h3>Someone liked your song!</h3>
        <p><strong>Song:</strong> ${songTitle}</p>
        <p><strong>Song ID:</strong> ${songId}</p>
        <p><strong>Time:</strong> ${new Date().toLocaleString()}</p>
      `,
    });

    return NextResponse.json(
      { message: "Like recorded successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error processing like:", error);
    return NextResponse.json(
      { error: "Failed to process like" },
      { status: 500 }
    );
  }
}
