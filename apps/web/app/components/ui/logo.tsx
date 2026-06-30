export function CoreGraspLogo({ className = "w-8 h-8 text-emerald-400" }: { className?: string }) {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      viewBox="0 0 32 32" 
      fill="none" 
      className={className}
    >
      {/* ── THE GRASP (Outer Arc) ── */}
      <path 
        d="M28 16c0 6.627-5.373 12-12 12S4 22.627 4 16 9.373 4 16 4c2.83 0 5.43 1.01 7.44 2.68" 
        stroke="currentColor" 
        strokeWidth="3.5" 
        strokeLinecap="round"
      />
      
      {/* ── THE CORE (Inner Dot) ── */}
      <circle 
        cx="16" 
        cy="16" 
        r="4.5" 
        fill="currentColor" 
      />
      
      {/* ── SUBTLE ACCENT (Floating dot) ── */}
      <circle 
        cx="25.5" 
        cy="6.5" 
        r="2" 
        fill="currentColor" 
        className="opacity-60"
      />
    </svg>
  )
}