"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { Users } from 'lucide-react';

export const TrustBadge = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full 
                 bg-liear-to-r from-orange-50/80 to-white/80 
                 border border-orange-200 shadow-sm shadow-orange-100/20 
                 backdrop-blur-sm group cursor-default"
    >
      {/* Icon with a subtle pulse effect */}
      <div className="relative flex items-center justify-center">
        <Users size={14} className="text-orange-500 relative z-10" />
        <motion.div 
          animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0, 0.5] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute inset-0 bg-orange-200 rounded-full blur-md"
        />
      </div>

      <span className="text-[13px] font-medium text-gray-700 tracking-tight">
        Trusted by <span className="text-orange-600 font-semibold">10</span> merchants
      </span>

      {/* Subtle "shimmer" shine that passes through */}
      <motion.div
        initial={{ x: '-100%' }}
        animate={{ x: '100%' }}
        transition={{ duration: 3, repeat: Infinity, ease: "linear", repeatDelay: 1 }}
        className="absolute inset-0 bg-liear-to-r from-transparent via-white/40 to-transparent -skew-x-12"
      />
    </motion.div>
  );
};

export default TrustBadge;