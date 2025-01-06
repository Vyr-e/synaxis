"use client"
import { motion } from "framer-motion";
import { useEffect, useState } from "react";

const circles = [
  {
    gradient: "bg-gradient-to-r from-black/10 to-black/5",
    size: "w-full h-full",
    position: "inset-0",
  },
  {
    gradient: "bg-gradient-to-r from-black/8 to-black/3",
    size: "w-[90%] h-[90%]",
    position: "inset-[5%]",
  },
  {
    gradient: "bg-gradient-to-r from-black/6 to-black/2",
    size: "w-[80%] h-[80%]",
    position: "inset-[10%]",
  }
];

const pingAnimation = {
  scale: [1, 1.1, 1],
  opacity: [0.4, 0.6, 0.4],
};

const AudioVisualizer = () => {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  useEffect(() => {
    const animate = () => {
      const newIndex = Math.floor(Math.random() * circles.length);
      setActiveIndex(newIndex);
      const delay = 800 + Math.random() * 1200;
      setTimeout(animate, delay);
    };

    animate();
    return () => setActiveIndex(null);
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden backdrop-blur-[2px]">
      {circles.map((circle, index) => (
        <motion.div 
          key={index} 
          className={`absolute ${circle.position}`}
        >
          <motion.div
            className={`absolute rounded-full ${circle.gradient} ${circle.size}`}
            animate={
              activeIndex === index 
                ? pingAnimation
                : { scale: 1, opacity: 0.3 }
            }
            transition={{
              duration: 0.8,
              ease: "easeInOut"
            }}
            style={{ filter: "blur(4px)" }}
          />
        </motion.div>
      ))}
    </div>
  );
};

export default AudioVisualizer; 