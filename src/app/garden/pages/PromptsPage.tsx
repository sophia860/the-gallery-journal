import { useState, useEffect } from 'react';
import { GardenNav } from '../components/GardenNav';
import { GardenFooter } from '../components/GardenFooter';

// SEASONAL/CYCLICAL PROMPTS - Not data-driven, not trending
// Rotate on a slow rhythm (weekly or seasonal)
const seasonalPrompts = {
  winter: {
    season: 'Winter',
    icon: '❄️',
    prompt: 'Write about what grows in the cold. Not despite it—because of it.',
    meditation: 'Winter asks us to be still. To find what persists when everything else has fallen away.',
  },
  spring: {
    season: 'Spring',
    icon: '🌱',
    prompt: 'What are you becoming? Write about metamorphosis—yours or something you\'ve witnessed.',
    meditation: 'Spring is relentless. It doesn\'t ask permission. Neither should your writing.',
  },
  summer: {
    season: 'Summer',
    icon: '☀️',
    prompt: 'Write about abundance. What it feels like to have too much—of anything.',
    meditation: 'Summer teaches excess. Let your words spill over. There will be time for pruning later.',
  },
  autumn: {
    season: 'Autumn',
    icon: '🍂',
    prompt: 'What are you ready to let go? Write about the beauty of release.',
    meditation: 'Autumn shows us that letting go can be gorgeous. The trees know this.',
  },
};

// Calculate current season based on date (not trending, not algorithmic)
const getCurrentSeason = () => {
  const month = new Date().getMonth(); // 0-11
  if (month >= 2 && month <= 4) return 'spring';
  if (month >= 5 && month <= 7) return 'summer';
  if (month >= 8 && month <= 10) return 'autumn';
  return 'winter';
};

export function PromptsPage() {
  const [currentPrompt, setCurrentPrompt] = useState(seasonalPrompts[getCurrentSeason()]);

  const handleUsePrompt = () => {
    // Store prompt in localStorage so WritePage can use it
    localStorage.setItem('gardenActivePrompt', currentPrompt.prompt);
    window.location.href = '/garden/write';
  };

  return (
    <div className="min-h-screen bg-[#121212]">
      <GardenNav />
      
      <div className="pt-24 px-8 pb-16">
        <div className="max-w-3xl mx-auto">
          {/* Header */}
          <div className="mb-12 text-center">
            <h1 className="font-['Cardo'] italic text-4xl text-[#7a9b76] mb-2">
              Seasonal Prompts
            </h1>
            <p className="font-['Cardo'] text-[#e0e0e0]/60">
              One prompt. Slow rhythm. No trending topics.
            </p>
          </div>

          {/* Current Seasonal Prompt */}
          <div className="mb-16">
            <div className="bg-[#1a1a1a] border border-[#7a9b76]/30 rounded-lg p-12">
              {/* Season indicator */}
              <div className="flex items-center justify-center gap-3 mb-8">
                <span className="text-[48px]">{currentPrompt.icon}</span>
                <div>
                  <p className="font-['Courier_New'] text-[11px] uppercase tracking-[0.15em] text-[#7a9b76]/70">
                    This Season's Prompt
                  </p>
                  <h2 className="font-['Cardo'] text-2xl text-[#7a9b76]">
                    {currentPrompt.season}
                  </h2>
                </div>
              </div>

              {/* The prompt */}
              <div className="mb-8">
                <p className="font-['Georgia'] text-[24px] text-[#e0e0e0] text-center mb-6" style={{ lineHeight: '1.6' }}>
                  {currentPrompt.prompt}
                </p>
                <p className="font-['Georgia'] text-[16px] text-[#8b9dc3] text-center italic" style={{ lineHeight: '1.8' }}>
                  {currentPrompt.meditation}
                </p>
              </div>

              {/* Use prompt button */}
              <div className="text-center">
                <button
                  onClick={handleUsePrompt}
                  className="px-8 py-4 bg-[#7a9b76] hover:bg-[#8fb587] text-white font-['Courier_New'] text-[12px] uppercase tracking-[0.2em] rounded transition-colors cursor-pointer"
                >
                  Write from this prompt
                </button>
              </div>
            </div>
          </div>

          {/* About Seasonal Prompts */}
          <div className="bg-[rgba(26,26,26,0.6)] border border-[#333] rounded-lg p-8">
            <h3 className="font-['Cardo'] text-xl text-[#e0e0e0] mb-4">
              Why one prompt?
            </h3>
            <div className="space-y-4 font-['Georgia'] text-[16px] text-[#e0e0e0]/70" style={{ lineHeight: '1.8' }}>
              <p>
                Prompts change with the seasons. Not with trends. Not with what's popular. Not with algorithms tracking engagement.
              </p>
              <p>
                A single prompt for an entire season gives you time to sit with it. To return to it. To discover what it means to you this week versus last week.
              </p>
              <p>
                Gardens don't grow on demand. Neither should your writing practice.
              </p>
            </div>
          </div>

          {/* Previous Seasons (for reference) */}
          <div className="mt-12">
            <h3 className="font-['Cardo'] text-xl text-[#7a9b76] mb-6">
              Previous Seasons
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Object.entries(seasonalPrompts)
                .filter(([key]) => key !== getCurrentSeason())
                .map(([key, prompt]) => (
                  <div
                    key={key}
                    className="bg-[#1a1a1a] border border-[#333] rounded-lg p-6"
                  >
                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-2xl">{prompt.icon}</span>
                      <p className="font-['Cardo'] text-lg text-[#e0e0e0]">
                        {prompt.season}
                      </p>
                    </div>
                    <p className="font-['Georgia'] text-sm text-[#e0e0e0]/60" style={{ lineHeight: '1.6' }}>
                      {prompt.prompt}
                    </p>
                  </div>
                ))}
            </div>
          </div>
        </div>
      </div>

      <GardenFooter />
    </div>
  );
}