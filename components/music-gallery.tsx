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

  useEffect(() => {
    // Move coverAssignments inside the effect
    const coverAssignments = new Map<string, string>();

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
  }, []); // Now the empty array is fine since coverAssignments is local to the effect

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
    <div className="relative min-h-screen p-4 md:p-8">
      {/* Mobile List View */}
      <div className="block md:hidden">
        <div className="space-y-3">
          {songs.map((song) => (
            <motion.div
              key={song.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="group relative backdrop-blur-sm bg-transparent rounded-lg
                hover:bg-white/5 transition-all duration-300 
                border-y border-zinc-700/50
                overflow-hidden"
              onClick={() => handleSongClick(song)}
            >
              <div className="flex items-center p-3 gap-3">
                <div
                  className="w-12 h-12 rounded-md overflow-hidden flex-shrink-0 
                  ring-1 ring-white/10"
                >
                  <Image
                    src={song.cover || ALBUM_COVERS[0]}
                    alt={song.title}
                    width={48}
                    height={48}
                    className="object-cover w-full h-full"
                    priority
                  />
                </div>
                <div className="flex-grow min-w-0">
                  <h3 className="text-white/90 font-medium truncate text-sm">
                    {song.title}
                  </h3>
                  <p className="text-white/50 text-xs">
                    {formatDuration(song.duration)}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Desktop Grid View */}
      <div className="hidden md:block">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {songs.map((song) => (
            <motion.div
              key={song.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="group relative backdrop-blur-sm bg-transparent rounded-xl p-4 
                hover:bg-white/5 transition-all duration-300 
                border border-zinc-700/50
                hover:border-zinc-600/50 hover:scale-[1.02]"
              onClick={() => handleSongClick(song)}
            >
              <div
                className="relative aspect-square rounded-lg mb-3 overflow-hidden 
                  ring-1 ring-white/10 group-hover:ring-white/20 
                  transition-all duration-300"
              >
                <Image
                  src={song.cover || ALBUM_COVERS[0]}
                  alt={song.title}
                  width={300}
                  height={300}
                  className="object-cover w-full h-full transform transition-all duration-500 
                    group-hover:scale-105"
                  priority
                />
              </div>
              <div className="relative">
                <h3 className="text-white/90 font-medium truncate mb-1">
                  {song.title}
                </h3>
                <p className="text-white/50 text-sm">
                  {formatDuration(song.duration)}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Player remains unchanged */}
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
