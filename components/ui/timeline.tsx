"use client";
import {
  //   useMotionValueEvent,
  useScroll,
  useTransform,
  motion,
} from "framer-motion";
import React, { useEffect, useRef, useState } from "react";

interface TimelineEntry {
  title: string;
  content: React.ReactNode;
}

export const Timeline = ({ data }: { data: TimelineEntry[] }) => {
  const ref = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState(0);

  useEffect(() => {
    if (ref.current) {
      const updateHeight = () => {
        if (ref.current) {
          const rect = ref.current.getBoundingClientRect();
          // Remove the extra viewport height to prevent overshooting
          setHeight(rect.height);
        }
      };

      updateHeight();
      window.addEventListener("resize", updateHeight);
      return () => window.removeEventListener("resize", updateHeight);
    }
  }, [ref]);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"], // Changed to track full viewport
  });

  const heightTransform = useTransform(
    scrollYProgress,
    [0, 0.2, 0.8, 1],
    [0, height * 0.2, height * 0.8, height]
  );
  const opacityTransform = useTransform(scrollYProgress, [0, 0.1], [0, 1]);

  return (
    <div
      className="hidden md:block w-full bg-white dark:bg-neutral-950 font-sans"
      ref={containerRef}
    >
      <div ref={ref} className="relative max-w-7xl mx-auto pb-10 md:pb-20">
        <div
          style={{
            height: `${height}px`,
            position: "absolute", // Changed from "fixed" to "absolute"
            left: "1.25rem", // Aligned with the year dots (20px from left)
            top: 0,
          }}
          className="w-[2px] overflow-hidden bg-[linear-gradient(to_bottom,var(--tw-gradient-stops))] from-transparent from-[0%] via-neutral-200 dark:via-neutral-700 to-transparent to-[99%] [mask-image:linear-gradient(to_bottom,transparent_0%,black_10%,black_90%,transparent_100%)]"
        >
          <motion.div
            style={{
              height: heightTransform,
              opacity: opacityTransform,
            }}
            className="absolute inset-x-0 top-0 w-[2px] bg-gradient-to-t from-purple-500 via-blue-500 to-transparent from-[0%] via-[10%] rounded-full"
          />
        </div>

        {data.map((item, index) => (
          <div key={index} className="flex justify-start pt-20 md:pt-60">
            <div className="sticky flex flex-col md:flex-row z-40 items-start top-20 md:top-40 self-start">
              <div className="h-8 md:h-10 absolute -left-1 md:left-0 w-8 md:w-10 rounded-full bg-white dark:bg-black flex items-center justify-center">
                <div className="h-3 md:h-4 w-3 md:w-4 rounded-full bg-neutral-200 dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700" />
              </div>
              <h3 className="hidden md:block text-xl md:pl-12 md:text-4xl font-bold text-neutral-500 dark:text-neutral-500">
                {item.title}
              </h3>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
