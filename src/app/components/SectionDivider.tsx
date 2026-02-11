interface SectionDividerProps {
  color: string;
  flip?: boolean;
}

export function SectionDivider({ color, flip = false }: SectionDividerProps) {
  return (
    <div 
      className="w-full relative" 
      style={{ 
        transform: flip ? 'rotate(180deg)' : 'none',
        lineHeight: 0
      }}
    >
      <svg 
        viewBox="0 0 1440 120" 
        preserveAspectRatio="none" 
        style={{ 
          width: '100%', 
          height: '120px',
          display: 'block' 
        }}
      >
        <path 
          d="M0,0 C480,120 960,120 1440,0 L1440,120 L0,120 Z" 
          fill={color}
        />
      </svg>
    </div>
  );
}
