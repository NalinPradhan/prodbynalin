"use client"

import Image from "next/image"
import { motion } from "framer-motion"
import { Play } from "lucide-react"
import { Badge } from "@/components/ui/badge"

interface SongCardProps {
  song: {
    id: string
    title: string
    artist: string
    cover: string
    duration: string
    genre: string
    year: string
    color: string
  }
  onClick: () => void
  isActive: boolean
}

export function SongCard({ song, onClick, isActive }: SongCardProps) {
  return (
    <motion.div
      whileHover={{ y: -8, scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: "spring", stiffness: 300, damping: 10 }}
      className="h-full"
    >
      <motion.div
        className={`overflow-hidden cursor-pointer transition-all duration-300 h-full rounded-2xl backdrop-blur-md bg-white/10 border border-white/20 shadow-xl ${
          isActive ? "ring-4 ring-white/30" : ""
        }`}
        onClick={onClick}
        layoutId={`card-${song.id}`}
      >
        <div className="p-3 relative group">
          <motion.div
            className="relative aspect-square overflow-hidden rounded-xl"
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 300, damping: 10 }}
          >
            <div className={`absolute inset-0 bg-gradient-to-br ${song.color} opacity-70`}></div>
            <Image
              src={song.cover || "/placeholder.svg"}
              alt={song.title}
              fill
              className="object-cover mix-blend-overlay transition-transform duration-500 group-hover:scale-110"
            />
            <motion.div
              className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 flex items-center justify-center"
              initial={{ opacity: 0 }}
              whileHover={{ opacity: 1 }}
            >
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                whileHover={{ scale: 1.1, rotate: 0 }}
                transition={{ type: "spring", stiffness: 300, damping: 10 }}
                className="bg-white/30 backdrop-blur-md rounded-full p-4 shadow-lg border border-white/40"
              >
                <Play className="w-8 h-8 text-white drop-shadow-md" />
              </motion.div>
            </motion.div>
          </motion.div>
          <div className="p-4 text-white">
            <motion.h3 className="font-bold text-lg line-clamp-1 drop-shadow-sm" layoutId={`title-${song.id}`}>
              {song.title}
            </motion.h3>
            <motion.p className="text-sm text-white/80" layoutId={`artist-${song.id}`}>
              {song.artist}
            </motion.p>
            <div className="flex items-center justify-between mt-3">
              <Badge variant="outline" className="bg-white/20 border-white/10 text-white backdrop-blur-sm">
                {song.genre}
              </Badge>
              <span className="text-xs text-white/70 font-medium">{song.duration}</span>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}

