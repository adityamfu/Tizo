/* eslint-disable no-unused-vars */
// src/components/FloatingCredit.jsx
import { Github, Coffee } from "lucide-react";
import { motion } from "framer-motion";

export default function FloatingCredit() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 items-end"
    >
      {/* GitHub Link */}
      <motion.a
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        href="https://github.com/adityamfu/Tizo"
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-2 px-3 py-2 bg-neutral-800/60 backdrop-blur-xl border border-neutral-700 text-xs md:text-sm text-neutral-200 rounded-full shadow-lg transition"
      >
        <Github size={window.innerWidth < 768 ? 14 : 18} />
        <span className="font-medium">GitHub</span>
      </motion.a>

      {/* Buy Me Coffee Link */}
      <motion.a
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        href="https://saweria.co/moondg"
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-2 px-3 py-2 bg-yellow-500/70 backdrop-blur-xl hover:bg-yellow-500 border border-yellow-400 text-neutral-900 text-xs md:text-sm rounded-full shadow-lg transition"
      >
        <Coffee size={window.innerWidth < 768 ? 14 : 18} />
        <span className="font-medium">Buy Me Coffee</span>
      </motion.a>

      {/* Author Name */}
      <motion.a
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        href="https://adith-beryl.vercel.app/"
        target="_blank"
        rel="noopener noreferrer"
        className="px-3 py-1 bg-neutral-800/60 backdrop-blur-xl border border-neutral-700 text-xs text-neutral-200 rounded-full shadow-inner hover:underline"
      >
        ©2025 adith
      </motion.a>
    </motion.div>
  );
}
