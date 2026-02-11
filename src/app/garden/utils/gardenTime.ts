// NON-LINEAR TIME - Gardens don't measure time with clocks
// Replace all temporal indicators with garden rhythms

export interface GardenNote {
  id: string;
  updatedAt: string;
  state: 'seed' | 'sprout' | 'bloom';
  tendedBy?: any[];
}

/**
 * Calculate warmth/temperature of a note based on when it was last tended
 * Returns a color temperature value that can be applied visually
 * Recently tended = warmer (amber/gold tints)
 * Untended = cooler (blue/grey tints)
 */
export function calculateNoteWarmth(lastTendedDate: string): {
  temperature: 'warm' | 'mild' | 'cool' | 'cold';
  colorTint: string; // CSS color for overlay
  glowIntensity: number; // 0-1 for glow effect
} {
  const now = new Date().getTime();
  const lastTended = new Date(lastTendedDate).getTime();
  const hoursSince = (now - lastTended) / (1000 * 60 * 60);

  // Warm: tended within 24 hours
  if (hoursSince < 24) {
    return {
      temperature: 'warm',
      colorTint: 'rgba(196, 164, 108, 0.15)', // Golden amber
      glowIntensity: 0.8,
    };
  }
  
  // Mild: tended within 7 days
  if (hoursSince < 24 * 7) {
    return {
      temperature: 'mild',
      colorTint: 'rgba(196, 164, 108, 0.08)', // Subtle gold
      glowIntensity: 0.4,
    };
  }
  
  // Cool: tended within 30 days
  if (hoursSince < 24 * 30) {
    return {
      temperature: 'cool',
      colorTint: 'rgba(139, 157, 195, 0.05)', // Subtle blue
      glowIntensity: 0.1,
    };
  }
  
  // Cold: untended for over 30 days
  return {
    temperature: 'cold',
    colorTint: 'rgba(100, 110, 130, 0.08)', // Grey-blue
    glowIntensity: 0,
  };
}

/**
 * Calculate the current season of a garden based on activity patterns
 * NOT based on calendar dates - based on what's growing
 */
export function calculateGardenSeason(notes: GardenNote[]): {
  season: 'spring' | 'summer' | 'autumn' | 'winter';
  description: string;
  icon: string;
} {
  if (notes.length === 0) {
    return {
      season: 'winter',
      description: 'Awaiting the first seeds',
      icon: '❄️',
    };
  }

  const seedCount = notes.filter(n => n.state === 'seed').length;
  const sproutCount = notes.filter(n => n.state === 'sprout').length;
  const bloomCount = notes.filter(n => n.state === 'bloom').length;
  const totalCount = notes.length;

  const seedRatio = seedCount / totalCount;
  const sproutRatio = sproutCount / totalCount;
  const bloomRatio = bloomCount / totalCount;

  // Spring: Many seeds germinating (>50% seeds)
  if (seedRatio > 0.5) {
    return {
      season: 'spring',
      description: 'Seeds are germinating',
      icon: '🌱',
    };
  }

  // Summer: Active growth, sprouts dominant (>40% sprouts)
  if (sproutRatio > 0.4) {
    return {
      season: 'summer',
      description: 'Growth is abundant',
      icon: '☀️',
    };
  }

  // Autumn: Blooms harvesting (>30% blooms)
  if (bloomRatio > 0.3) {
    return {
      season: 'autumn',
      description: 'The garden blooms',
      icon: '🍂',
    };
  }

  // Winter: Low activity or balanced (no dominant stage)
  return {
    season: 'winter',
    description: 'Quiet contemplation',
    icon: '❄️',
  };
}

/**
 * Calculate garden maturity based on age and activity
 * Replace "member since 2024" with growth metaphors
 */
export function calculateGardenMaturity(
  createdAt: string,
  noteCount: number,
  connectionCount: number
): {
  stage: 'freshly-planted' | 'taking-root' | 'established' | 'ancient';
  label: string;
  description: string;
} {
  const now = new Date().getTime();
  const created = new Date(createdAt).getTime();
  const daysSince = (now - created) / (1000 * 60 * 60 * 24);
  
  // Activity score: notes + connections
  const activityScore = noteCount + (connectionCount * 2);

  // Ancient grove: >180 days AND high activity
  if (daysSince > 180 && activityScore > 50) {
    return {
      stage: 'ancient',
      label: 'Ancient Grove',
      description: 'Deep roots, many stories',
    };
  }

  // Well-established: >60 days with good activity
  if (daysSince > 60 && activityScore > 20) {
    return {
      stage: 'established',
      label: 'Well-Established',
      description: 'This garden has found its rhythm',
    };
  }

  // Taking root: >14 days OR moderate activity
  if (daysSince > 14 || activityScore > 5) {
    return {
      stage: 'taking-root',
      label: 'Taking Root',
      description: 'Beginning to grow',
    };
  }

  // Freshly planted: new garden
  return {
    stage: 'freshly-planted',
    label: 'Freshly Planted',
    description: 'A new garden begins',
  };
}

/**
 * Sort options that don't rely on dates
 */
export type GardenSortOption = 
  | 'connection-density'  // Most connected pieces first
  | 'recently-tended'     // Most recently tended (warmth)
  | 'deepest-roots'       // Oldest connections first
  | 'discovery';          // Random/serendipitous

export function sortNotesByGardenLogic(
  notes: GardenNote[],
  sortBy: GardenSortOption
): GardenNote[] {
  const sorted = [...notes];

  switch (sortBy) {
    case 'connection-density':
      // Most connected first (would need connection data)
      return sorted; // Placeholder
    
    case 'recently-tended':
      // Sort by warmth (most recent first)
      return sorted.sort((a, b) => {
        const aTime = new Date(a.updatedAt).getTime();
        const bTime = new Date(b.updatedAt).getTime();
        return bTime - aTime;
      });
    
    case 'deepest-roots':
      // Oldest connections first
      return sorted.sort((a, b) => {
        const aTime = new Date(a.updatedAt).getTime();
        const bTime = new Date(b.updatedAt).getTime();
        return aTime - bTime;
      });
    
    case 'discovery':
      // Shuffle randomly for serendipitous discovery
      return sorted.sort(() => Math.random() - 0.5);
    
    default:
      return sorted;
  }
}

/**
 * Format Quiet Hours as garden dormancy
 */
export function isGardenResting(quietHours?: { start: string; end: string }): boolean {
  if (!quietHours) return false;
  
  const now = new Date();
  const currentHour = now.getHours();
  const currentMinute = now.getMinutes();
  const currentTime = currentHour * 60 + currentMinute;
  
  const [startHour, startMinute] = quietHours.start.split(':').map(Number);
  const startTime = startHour * 60 + startMinute;
  
  const [endHour, endMinute] = quietHours.end.split(':').map(Number);
  const endTime = endHour * 60 + endMinute;
  
  // Handle overnight quiet hours
  if (startTime > endTime) {
    return currentTime >= startTime || currentTime < endTime;
  }
  
  return currentTime >= startTime && currentTime < endTime;
}
