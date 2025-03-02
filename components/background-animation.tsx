"use client";

import { useEffect, useState } from "react";

const TOTAL_BLOBS = 20;

export function BackgroundAnimation() {
  const [blobs, setBlobs] = useState<
    Array<{
      id: number;
      style: React.CSSProperties;
    }>
  >([]);

  useEffect(() => {
    // Generate blobs only on client-side
    const newBlobs = Array.from({ length: TOTAL_BLOBS }, (_, i) => ({
      id: i,
      style: {
        width: `${Math.random() * 300 + 100}px`,
        height: `${Math.random() * 300 + 100}px`,
        top: `${Math.random() * 100}%`,
        left: `${Math.random() * 100}%`,
        background: `radial-gradient(circle, rgba(${Math.random() * 255}, ${
          Math.random() * 255
        }, ${Math.random() * 255}, 0.8) 0%, rgba(255, 255, 255, 0) 70%)`,
        animationDelay: `${Math.random() * 5}s`,
      },
    }));
    setBlobs(newBlobs);
  }, []);

  if (blobs.length === 0) {
    return null;
  }

  return (
    <div className="fixed inset-0 -z-10 overflow-hidden">
      {blobs.map(({ id, style }) => (
        <div
          key={id}
          className="absolute rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-float"
          style={style}
        />
      ))}
    </div>
  );
}
