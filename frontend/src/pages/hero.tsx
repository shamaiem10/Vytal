import React from "react";
import { motion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function VytalHero() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-500 to-emerald-400">
      {/* Centered hero content without using Layout */}
      <motion.div
        initial={{ opacity: 0, y: -20, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
        className="text-center px-6 py-12 max-w-2xl"
      >
        <h1 className="text-6xl sm:text-7xl md:text-8xl font-bold tracking-tight text-white drop-shadow-[0_10px_30px_rgba(0,0,0,0.25)] font-[Comic-Sans-MS,cursive]">
          Vytal.
        </h1>
        <p className="mt-4 text-lg sm:text-xl md:text-2xl text-white/90 italic">
          *because every detail is vital.*
        </p>
      </motion.div>

      {/* Jumping arrow */}
      <motion.div
        animate={{ y: [0, -8, 0] }}
        transition={{ repeat: Infinity, duration: 1.2, ease: "easeInOut" }}
        className="mt-10 flex items-center justify-center cursor-pointer"
        onClick={() => navigate('/dashboard')}
      >
        <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center shadow-md">
          <ChevronDown className="w-5 h-5 text-white" />
        </div>
      </motion.div>

      <p className="mt-2 text-xs text-white/80">scroll to explore</p>

      {/* Decorative soft circles */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <svg className="absolute right-10 top-10 opacity-20" width="280" height="280" viewBox="0 0 280 280" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="140" cy="140" r="120" fill="white" />
        </svg>
        <svg className="absolute left-8 bottom-8 opacity-10" width="220" height="220" viewBox="0 0 220 220" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="110" cy="110" r="100" fill="white" />
        </svg>
      </div>
    </div>
  );
}
