import React from 'react'

// SVG logo component matching the actual isometric "C" design
const Logo = ({ size = 48, className = "" }: { size?: number; className?: string }) => {
  return (
    <div className={`flex items-center ${className}`}>
      <svg 
        width={size} 
        height={size} 
        viewBox="0 0 100 100" 
        className="mr-3"
      >
        <defs>
          {/* Gradients for the isometric "C" shape */}
          <linearGradient id="lightGreen" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#4ADE80" />
            <stop offset="50%" stopColor="#22C55E" />
            <stop offset="100%" stopColor="#16A34A" />
          </linearGradient>
          
          <linearGradient id="mediumGreen" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#22C55E" />
            <stop offset="50%" stopColor="#16A34A" />
            <stop offset="100%" stopColor="#15803D" />
          </linearGradient>
          
          <linearGradient id="darkGreen" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#16A34A" />
            <stop offset="50%" stopColor="#15803D" />
            <stop offset="100%" stopColor="#166534" />
          </linearGradient>
        </defs>
        
        {/* Top horizontal piece (lightest) */}
        <g>
          {/* Top face */}
          <path 
            d="M25 30 L65 15 L85 25 L45 40 Z" 
            fill="url(#lightGreen)"
            stroke="#14532D"
            strokeWidth="0.5"
          />
          {/* Front face */}
          <path 
            d="M25 30 L45 40 L45 50 L25 40 Z" 
            fill="url(#mediumGreen)"
            stroke="#14532D"
            strokeWidth="0.5"
          />
          {/* Right face */}
          <path 
            d="M45 40 L85 25 L85 35 L45 50 Z" 
            fill="url(#darkGreen)"
            stroke="#14532D"
            strokeWidth="0.5"
          />
        </g>
        
        {/* Right vertical piece (medium) */}
        <g>
          {/* Top face */}
          <path 
            d="M75 35 L85 30 L95 40 L85 45 Z" 
            fill="url(#lightGreen)"
            stroke="#14532D"
            strokeWidth="0.5"
          />
          {/* Left face */}
          <path 
            d="M75 35 L85 45 L85 75 L75 70 Z" 
            fill="url(#mediumGreen)"
            stroke="#14532D"
            strokeWidth="0.5"
          />
          {/* Right face */}
          <path 
            d="M85 45 L95 40 L95 70 L85 75 Z" 
            fill="url(#darkGreen)"
            stroke="#14532D"
            strokeWidth="0.5"
          />
        </g>
        
        {/* Bottom horizontal piece (darkest) */}
        <g>
          {/* Top face */}
          <path 
            d="M15 70 L75 55 L85 65 L25 80 Z" 
            fill="url(#lightGreen)"
            stroke="#14532D"
            strokeWidth="0.5"
          />
          {/* Front face */}
          <path 
            d="M15 70 L25 80 L25 90 L15 80 Z" 
            fill="url(#mediumGreen)"
            stroke="#14532D"
            strokeWidth="0.5"
          />
          {/* Right face */}
          <path 
            d="M25 80 L85 65 L85 75 L25 90 Z" 
            fill="url(#darkGreen)"
            stroke="#14532D"
            strokeWidth="0.5"
          />
        </g>
        
        {/* Connecting piece between top and right */}
        <g>
          {/* Small connecting segment */}
          <path 
            d="M75 35 L85 30 L85 35 L75 40 Z" 
            fill="url(#mediumGreen)"
            stroke="#14532D"
            strokeWidth="0.3"
          />
        </g>
        
        {/* Connecting piece between right and bottom */}
        <g>
          {/* Small connecting segment */}
          <path 
            d="M75 65 L85 60 L85 70 L75 75 Z" 
            fill="url(#mediumGreen)"
            stroke="#14532D"
            strokeWidth="0.3"
          />
        </g>
      </svg>
      <span className="text-2xl font-bold bg-gradient-to-r from-emerald-600 to-emerald-800 bg-clip-text text-transparent">
        ChronoBox
      </span>
    </div>
  )
}

export default Logo 