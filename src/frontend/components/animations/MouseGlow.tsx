"use client";

import { useEffect, useRef } from "react";
import { useReducedMotion } from "framer-motion";

export function MouseGlow() {
  const glowRef = useRef<HTMLDivElement>(null);
  const shouldReduce = useReducedMotion();
  const mountedRef = useRef(false);

  useEffect(() => {
    mountedRef.current = true;
  }, []);

  useEffect(() => {
    if (shouldReduce || !mountedRef.current) return;
    const glow = glowRef.current;
    if (!glow) return;

    function handleMove(e: MouseEvent) {
      glow!.style.background = `radial-gradient(350px circle at ${e.clientX}px ${e.clientY}px, oklch(0.65 0.2 255 / 0.22), transparent 45%)`;
      glow!.style.opacity = "1";
    }

    function handleLeave() {
      glow!.style.opacity = "0";
    }

    window.addEventListener("mousemove", handleMove);
    document.addEventListener("mouseleave", handleLeave);
    return () => {
      window.removeEventListener("mousemove", handleMove);
      document.removeEventListener("mouseleave", handleLeave);
    };
  }, [shouldReduce]);

  if (shouldReduce) return null;

  return (
    <div
      ref={glowRef}
      className="pointer-events-none fixed inset-0 z-[1] opacity-0 transition-opacity duration-300"
    />
  );
}
