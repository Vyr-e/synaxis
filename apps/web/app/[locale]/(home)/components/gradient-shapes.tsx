"use client"
import { motion } from "framer-motion";
import { useEffect, useState } from "react";

const gradients = [
  "bg-gradient-to-r from-indigo-500 to-purple-500",
  "bg-gradient-to-r from-purple-500 to-pink-500",
  "bg-gradient-to-r from-blue-500 to-teal-500",
  "bg-gradient-to-r from-cyan-500 to-blue-500",
  "bg-gradient-to-r from-violet-500 to-indigo-500",
  "bg-gradient-to-r from-fuchsia-500 to-pink-500",
  "bg-gradient-to-r from-rose-500 to-red-500",
  "bg-gradient-to-r from-amber-500 to-yellow-500",
  "bg-gradient-to-r from-emerald-500 to-green-500",
  "bg-gradient-to-r from-sky-500 to-blue-500",
];

const getRandomPosition = () => ({
  x: Math.random() * (typeof window !== 'undefined' ? window.innerWidth - 200 : 0),
  y: Math.random() * (typeof window !== 'undefined' ? window.innerHeight - 200 : 0),
  scale: 0.5 + Math.random() * 1.5,
  rotate: Math.random() * 360,
});

const GradientShapes = () => {
  const [shapes, setShapes] = useState<Array<{ id: number; gradient: string; position: any }>>([]);

  useEffect(() => {
    const newShapes = gradients.map((gradient, index) => ({
      id: index,
      gradient,
      position: getRandomPosition(),
    }));
    setShapes(newShapes);
  }, []);

  return (
    <div className="fixed inset-0 -z-10 overflow-hidden">
      {shapes.map((shape) => (
        <motion.div
          key={shape.id}
          className={`absolute w-40 h-40 rounded-[30%] opacity-30 backdrop-blur-xl ${shape.gradient}`}
          drag
          dragMomentum={false}
          initial={shape.position}
          animate={{
            scale: [shape.position.scale, shape.position.scale * 1.1, shape.position.scale],
            rotate: [shape.position.rotate, shape.position.rotate + 10, shape.position.rotate],
          }}
          transition={{
            duration: 5 + Math.random() * 5,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          whileHover={{ scale: 1.1 }}
          style={{
            filter: "blur(40px)",
            x: shape.position.x,
            y: shape.position.y,
          }}
        />
      ))}
    </div>
  );
};

export default GradientShapes; 