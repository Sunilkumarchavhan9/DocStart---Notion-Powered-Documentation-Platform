"use client";

import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { useRef, useState } from "react";

export default function Footer() {
  const ref = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springConfig = { damping: 15, stiffness: 150 };
  const springX = useSpring(x, springConfig);
  const springY = useSpring(y, springConfig);

  const rotateX = useTransform(springY, [-100, 100], [15, -15]);
  const rotateY = useTransform(springX, [-100, 100], [-15, 15]);
  const scale = useTransform(springX, [-100, 100], [0.95, 1.05]);

  const handleMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;

    const rect = ref.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const distanceX = event.clientX - centerX;
    const distanceY = event.clientY - centerY;

    const maxDistance = 100;
    const distance = Math.sqrt(distanceX ** 2 + distanceY ** 2);
    const magneticStrength = Math.max(0, 1 - distance / maxDistance);

    x.set(distanceX * magneticStrength * 0.3);
    y.set(distanceY * magneticStrength * 0.3);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
    setIsHovered(false);
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  return (
    <div className="py-12 bg-backgroud -mt-10">
      <div className="container mx-auto px-4">
        <div className="text-center select-none">
          {/* Magnetic target only on this motion.div */}
          <motion.div
            ref={ref}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            onMouseEnter={handleMouseEnter}
            style={{
              x: springX,
              y: springY,
              rotateX,
              rotateY,
              scale,
              transformStyle: "preserve-3d",
              display: "inline-block"
            }}
            className="cursor-pointer"
            whileHover={{
              scale: 1.02,
              transition: { duration: 0.2 }
            }}
          >
            <motion.p
              className="text-xs font-serif text-muted-foreground"
              animate={{
                color: isHovered
                  ? "hsl(var(--primary))"
                  : "hsl(var(--muted-foreground))"
              }}
              transition={{ duration: 0.3 }}
            >
              © 2025 DocStart. Made with{" "}
              <motion.span
                animate={{
                  scale: isHovered ? [1, 1.2, 1] : 1,
                  rotate: isHovered ? [0, 10, -10, 0] : 0
                }}
                transition={{
                  duration: 0.6,
                  repeat: isHovered ? Infinity : 0,
                  repeatType: "reverse"
                }}
                className="inline-block bg-primary"
              >
                ❤️
              </motion.span>{" "}
              for developers
            </motion.p>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
