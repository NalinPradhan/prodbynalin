import mongoose from "mongoose";

const songSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true },
    title: { type: String, required: true },
    url: { type: String, required: true },
    duration: { type: Number, required: true },
    uploadedAt: { type: Date, required: true },
    format: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);

export const Song = mongoose.models.Song || mongoose.model("Song", songSchema);
