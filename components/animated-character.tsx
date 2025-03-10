"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { motion, useAnimation } from "framer-motion";

export default function AnimatedCharacter() {
  const [isVisible, setIsVisible] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const controls = useAnimation();
  const bubbleControls = useAnimation();

  useEffect(() => {
    // Check if we're on mobile
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    // Initial check
    checkMobile();
    
    // Add resize listener
    window.addEventListener("resize", checkMobile);
    
    return () => {
      window.removeEventListener("resize", checkMobile);
    };
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      // Check if user has scrolled to half the viewport height
      const scrollY = window.scrollY;
      const halfViewport = window.innerHeight / 2;
      
      if (scrollY > halfViewport && !isVisible) {
        setIsVisible(true);
        // Animate character to peek in with rotation
        controls.start({
          x: isMobile ? -32 : -28, // Show approximately half of the character
          rotate: isMobile ? 15 : 20, // Rotate to create peeking effect
          opacity: 1,
          transition: { 
            type: "spring", 
            stiffness: 200, 
            damping: 20 
          }
        }).then(() => {
          // Then animate the speech bubble with a slight delay
          bubbleControls.start({
            opacity: 1,
            y: 0,
            scale: 1,
            transition: { 
              type: "spring", 
              stiffness: 300, 
              damping: 20,
              delay: 0.3
            }
          });
        });
      } else if (scrollY <= halfViewport && isVisible) {
        setIsVisible(false);
        // Hide speech bubble first
        bubbleControls.start({
          opacity: 0,
          y: 10,
          scale: 0.9,
          transition: { duration: 0.2 }
        }).then(() => {
          // Then hide character by rotating back behind the edge
          controls.start({
            x: isMobile ? -70 : -100,
            rotate: 0,
            opacity: 1, // Keep opacity at 1 to maintain the peeking effect
            transition: { 
              type: "spring", 
              stiffness: 300, 
              damping: 25 
            }
          });
        });
      }
    };

    window.addEventListener("scroll", handleScroll);
    
    // Initial check in case the page loads already scrolled
    handleScroll();
    
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [controls, bubbleControls, isVisible, isMobile]);

  return (
    <motion.div
      className={`fixed z-50 pointer-events-none ${
        isMobile 
          ? "left-0 bottom-16" 
          : "left-0 bottom-24"
      }`}
      initial={{ x: isMobile ? -70 : -100, rotate: 0, opacity: 1 }}
      animate={controls}
      style={{ 
        originX: 0, // Set transform origin to left side for better rotation
        originY: 0.5 
      }}
    >
      <div className="relative">
        {/* Thinking cloud */}
        <motion.div 
          className={`absolute bg-white dark:bg-zinc-800 p-3 md:p-4 rounded-2xl shadow-lg transform -rotate-3 z-10 ${
            isMobile
              ? "-top-14 left-10"
              : "-top-20 left-16"
          }`}
          initial={{ opacity: 0, y: 10, scale: 0.9 }}
          animate={bubbleControls}
        >
          <div className="relative">
            <p className={`text-black dark:text-white font-bold font-mono ${
              isMobile ? "text-xs" : "text-sm"
            }`}>
              the music sucks
            </p>
            {/* Cloud tail */}
            <div className={`absolute bg-white dark:bg-zinc-800 clip-path-triangle transform rotate-180 ${
              isMobile
                ? "-bottom-4 left-4 w-4 h-5"
                : "-bottom-5 left-6 w-5 h-6"
            }`}></div>
          </div>
        </motion.div>
        
        {/* Character image with subtle hover animation */}
        <motion.div 
          className={`relative ${
            isMobile ? "w-16 h-16" : "w-24 h-24"
          }`}
          animate={{ 
            y: [0, -3, 0],
          }}
          transition={{ 
            repeat: Infinity, 
            duration: 2.5,
            ease: "easeInOut"
          }}
        >
          <Image
            src="/1.png"
            alt="Character"
            width={isMobile ? 64 : 96}
            height={isMobile ? 64 : 96}
            className="object-contain drop-shadow-lg"
            priority
          />
        </motion.div>
      </div>
    </motion.div>
  );
} 