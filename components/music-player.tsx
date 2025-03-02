"use client";

import { useState, useEffect, useRef } from "react";
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Volume2,
  VolumeX,
  X,
} from "lucide-react";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import Image from "next/image";

// Remove motion import since we won't use animations

interface MusicPlayerProps {
  song: {
    id: string;
    title: string;
    artist: string;
    cover: string;
    duration: string;
    color: string;
    url: string;
  };
  onClose: () => void;
}

export function MusicPlayer({ song, onClose }: MusicPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(true);
  const [progress, setProgress] = useState(0);
  const [volume, setVolume] = useState(80);
  const [isMuted, setIsMuted] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Reset states when song changes
  useEffect(() => {
    setIsPlaying(true);
    setProgress(0);

    // Cleanup previous audio instance
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.src = "";
    }

    // Initialize new audio instance
    audioRef.current = new Audio(song.url);
    audioRef.current.volume = volume / 100;

    const playAudio = async () => {
      try {
        if (audioRef.current) {
          await audioRef.current.play();
        }
      } catch (error) {
        console.error("Error playing audio:", error);
      }
    };

    playAudio();

    // Add event listener for progress updates
    const audio = audioRef.current;
    const updateProgress = () => {
      if (audio) {
        const progress = (audio.currentTime / audio.duration) * 100;
        setProgress(progress);
      }
    };

    audio?.addEventListener("timeupdate", updateProgress);

    return () => {
      audio?.removeEventListener("timeupdate", updateProgress);
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.src = "";
        audioRef.current = null;
      }
    };
  }, [song.id]); // Change dependency to song.id instead of song.url

  // Handle play/pause
  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.play().catch(console.error);
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying]);

  // Handle volume change
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume / 100;
    }
  }, [volume, isMuted]);

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  const handleProgressChange = (value: number[]) => {
    if (audioRef.current) {
      const time = (value[0] / 100) * audioRef.current.duration;
      audioRef.current.currentTime = time;
      setProgress(value[0]);
    }
  };

  const handleVolumeChange = (value: number[]) => {
    setVolume(value[0]);
    if (value[0] === 0) {
      setIsMuted(true);
    } else {
      setIsMuted(false);
    }
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  // Format time from seconds
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

  // Convert duration string to seconds
  const durationToSeconds = (duration: string) => {
    const [mins, secs] = duration.split(":").map(Number);
    return mins * 60 + secs;
  };

  const totalSeconds = durationToSeconds(song.duration);
  const currentSeconds = (progress / 100) * totalSeconds;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-black bg-opacity-95 border-t border-white/20 shadow-2xl">
      <div className="container mx-auto py-2 px-4">
        <div className="flex items-center justify-between gap-4">
          {/* Left section - Song info */}
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <div className="relative pb-14 w-12 h-12 flex-shrink-0 rounded-lg overflow-hidden shadow-lg">
              <Image
                alt=""
                src={"/covers/track.png"}
                width={48}
                height={48}
              ></Image>
            </div>
            <div className="min-w-0">
              <h3 className="font-semibold text-sm line-clamp-1 text-white">
                {song.title}
              </h3>
              <p className="text-xs text-white/80 line-clamp-1">
                {song.artist}
              </p>
            </div>
          </div>

          {/* Center section - Controls */}
          <div className="flex items-center gap-2 flex-1 justify-center">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 rounded-full bg-white/20 hover:bg-white/30 text-white"
            >
              <SkipBack className="h-4 w-4" />
            </Button>
            <Button
              onClick={togglePlay}
              className="h-10 w-10 rounded-full text-primary-foreground hover:bg-slate-600"
            >
              {isPlaying ? (
                <Pause className="h-5 w-5" />
              ) : (
                <Play className="h-5 w-5 ml-0.5" />
              )}
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 rounded-full bg-white/20 hover:bg-white/30 text-white"
            >
              <SkipForward className="h-4 w-4" />
            </Button>
          </div>

          {/* Right section - Volume and additional controls */}
          <div className="flex items-center gap-2 flex-1 justify-end">
            <span className="text-xs text-white/80">
              {formatTime(currentSeconds)} / {song.duration}
            </span>
            <div className="flex items-center gap-1 w-24">
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleMute}
                className="h-8 w-8 rounded-full bg-white/20 hover:bg-white/30 text-white"
              >
                {isMuted ? (
                  <VolumeX className="h-3 w-3" />
                ) : (
                  <Volume2 className="h-3 w-3" />
                )}
              </Button>
              <Slider
                value={[isMuted ? 0 : volume]}
                max={100}
                step={1}
                onValueChange={handleVolumeChange}
                className="w-16"
              />
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="h-8 w-8 rounded-full bg-white/20 hover:bg-white/30 text-white"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Progress bar */}
        <Slider
          value={[progress]}
          max={100}
          step={0.1}
          onValueChange={handleProgressChange}
          className="mt-1"
        />
      </div>
    </div>
  );
}
