"use client";

import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { MusicPlayer } from "@/components/music-player";
import Image from "next/image";

// Define album covers as a constant
const ALBUM_COVERS = [
  "/covers/albumcover1.webp",
  "/covers/albumcover2.webp",
  "/covers/albumcover3.webp",
  "/covers/albumcover4.webp",
] as const;

interface Song {
  id: string;
  title: string;
  url: string;
  duration: number;
  uploadedAt: string;
  format: string;
  cover?: string;
}

export default function MusicGallery() {
  const [songs, setSongs] = useState<Song[]>([]);
  const [currentSong, setCurrentSong] = useState<Song | null>(null);
  const [isPlayerVisible, setIsPlayerVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [coverAssignments] = useState(() => new Map<string, string>());

  useEffect(() => {
    const fetchSongs = async () => {
      try {
        const response = await fetch("/api/music");
        if (!response.ok) {
          throw new Error("Failed to fetch songs");
        }
        const data = await response.json();

        const songsWithCovers = data.map((song: Song, index: number) => {
          const coverIndex = index % ALBUM_COVERS.length;
          const cover = ALBUM_COVERS[coverIndex];
          coverAssignments.set(song.id, cover);
          return {
            ...song,
            cover,
          };
        });

        setSongs(songsWithCovers);
      } catch (error) {
        console.error("Error fetching songs:", error);
        setError("Failed to load songs");
      } finally {
        setIsLoading(false);
      }
    };

    fetchSongs();
  });

  const handleSongClick = (song: Song) => {
    setIsPlayerVisible(false);
    setTimeout(() => {
      setCurrentSong(song);
      setIsPlayerVisible(true);
    }, 100);
  };

  const formatDuration = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  if (isLoading) {
    return <div className="text-center p-8">Loading songs...</div>;
  }

  if (error) {
    return <div className="text-center text-red-500 p-8">{error}</div>;
  }

  return (
    <div className="relative min-h-screen p-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {songs.map((song) => (
          <motion.div
            key={song.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gray-900 rounded-lg p-4 cursor-pointer hover:bg-zinc-800 transition"
            onClick={() => handleSongClick(song)}
          >
            <div className="aspect-square bg-zinc-800 rounded-md mb-3 overflow-hidden">
              <Image
                src={song.cover || ALBUM_COVERS[0]}
                alt={song.title}
                width={300}
                height={300}
                className="object-cover w-full h-full"
                priority
              />
            </div>
            <h3 className="text-white font-medium truncate">{song.title}</h3>
            <p className="text-zinc-400 text-sm">
              {formatDuration(song.duration)}
            </p>
          </motion.div>
        ))}
      </div>

      <AnimatePresence>
        {isPlayerVisible && currentSong && (
          <MusicPlayer
            song={{
              ...currentSong,
              artist: "You",
              cover: currentSong.cover || ALBUM_COVERS[0],
              duration: formatDuration(currentSong.duration),
              color: "from-zinc-500 to-zinc-700",
              url: currentSong.url,
            }}
            onClose={() => setIsPlayerVisible(false)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
