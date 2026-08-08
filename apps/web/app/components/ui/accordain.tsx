"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"

interface AccordionItemProps {
  title: string
  content: React.ReactNode
  isOpen: boolean
  onClick: () => void
}

const AccordionItem = ({ title, content, isOpen, onClick }: AccordionItemProps) => {
  return (
    <div className="border border-white/[0.08] rounded-xl bg-white/[0.02] overflow-hidden backdrop-blur-md mb-3 transition-colors hover:border-white/[0.12] hover:bg-white/[0.03]">
      <button
        onClick={onClick}
        className="w-full flex justify-between items-center px-5 py-4 text-left focus:outline-none focus-visible:ring-1 focus-visible:ring-emerald-500/50"
      >
        <span className="text-[14px] font-medium text-[#fafafa] tracking-wide">
          {title}
        </span>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
          className="text-white/40 shrink-0 ml-4"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="m6 9 6 6 6-6"/>
          </svg>
        </motion.div>
      </button>
      
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="px-5 pb-4 text-[13px] text-[#71717a] leading-relaxed border-t border-white/[0.04] pt-4">
              {content}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

interface AccordionProps {
  items: { title: string; content: React.ReactNode }[]
  allowMultiple?: boolean
}

export function Accordion({ items, allowMultiple = false }: AccordionProps) {
  const [openIndexes, setOpenIndexes] = useState<number[]>([])

  const handleToggle = (index: number) => {
    if (allowMultiple) {
      setOpenIndexes((prev) =>
        prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
      )
    } else {
      setOpenIndexes((prev) => (prev.includes(index) ? [] : [index]))
    }
  }

  return (
    <div className="w-full">
      {items.map((item, index) => (
        <AccordionItem
          key={index}
          title={item.title}
          content={item.content}
          isOpen={openIndexes.includes(index)}
          onClick={() => handleToggle(index)}
        />
      ))}
    </div>
  )
}