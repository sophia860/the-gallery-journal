import { useState, useEffect } from 'react';
import { GardenNav } from '../components/GardenNav';
import { authService } from '../utils/auth';
import { harvestService, HarvestAnalytics } from '../utils/harvest';

export function HarvestPage() {
  const currentUser = authService.getCurrentUser();
  const [analytics, setAnalytics] = useState<HarvestAnalytics | null>(null);

  useEffect(() => {
    if (!currentUser) {
      window.location.href = '/garden/login';
      return;
    }

    loadAnalytics();
  }, [currentUser]);

  const loadAnalytics = () => {
    if (!currentUser) return;
    const data = harvestService.getAnalytics(currentUser.id);
    setAnalytics(data);
  };

  if (!analytics) {
    return (
      <div className="min-h-screen bg-[#121212]">
        <GardenNav />
        <div className="pt-24 flex items-center justify-center">
          <p className="text-[#e0e0e0]/60">Loading...</p>
        </div>
      </div>
    );
  }

  const maxMonthlyCount = Math.max(...analytics.monthlyActivity.map(m => m.count), 1);

  return (
    <div className="min-h-screen bg-[#121212]">
      <GardenNav />
      
      <div className="pt-24 px-8 pb-16">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="mb-12">
            <h1 className="font-['Cardo'] italic text-4xl text-[#7a9b76] mb-2">
              Your Harvest
            </h1>
            <p className="font-['Cardo'] text-[#e0e0e0]/60">
              Replant Requests are publication offers. When an editor wants to publish your work in the Gallery, you'll see it here.
            </p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            {/* Total Notes */}
            <div className="bg-[#1a1a1a] border border-[#333] rounded-lg p-6">
              <div className="flex items-center gap-3 mb-2">
                <span className="text-3xl">📝</span>
                <div>
                  <p className="font-['Courier_New'] text-[11px] uppercase tracking-[0.15em] text-[#e0e0e0]/60">
                    Total Notes
                  </p>
                  <p className="font-['Cardo'] text-3xl text-[#e0e0e0]">
                    {analytics.totalNotes}
                  </p>
                </div>
              </div>
            </div>

            {/* Total Words */}
            <div className="bg-[#1a1a1a] border border-[#333] rounded-lg p-6">
              <div className="flex items-center gap-3 mb-2">
                <span className="text-3xl">✍️</span>
                <div>
                  <p className="font-['Courier_New'] text-[11px] uppercase tracking-[0.15em] text-[#e0e0e0]/60">
                    Total Words
                  </p>
                  <p className="font-['Cardo'] text-3xl text-[#e0e0e0]">
                    {analytics.totalWordCount.toLocaleString()}
                  </p>
                </div>
              </div>
            </div>

            {/* Writing Streak */}
            <div className="bg-[#1a1a1a] border border-[#333] rounded-lg p-6">
              <div className="flex items-center gap-3 mb-2">
                <span className="text-3xl">🔥</span>
                <div>
                  <p className="font-['Courier_New'] text-[11px] uppercase tracking-[0.15em] text-[#e0e0e0]/60">
                    Writing Streak
                  </p>
                  <p className="font-['Cardo'] text-3xl text-[#e0e0e0]">
                    {analytics.writingStreak} {analytics.writingStreak === 1 ? 'day' : 'days'}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Notes by State */}
          <div className="bg-[#1a1a1a] border border-[#333] rounded-lg p-6 mb-8">
            <h3 className="font-['Cardo'] text-xl text-[#7a9b76] mb-6">
              Notes by State
            </h3>
            <div className="grid grid-cols-3 gap-6">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-2xl">🌰</span>
                  <span className="font-['Courier_New'] text-[11px] uppercase tracking-[0.15em] text-[#e0e0e0]/60">
                    Seeds
                  </span>
                </div>
                <p className="font-['Cardo'] text-2xl text-[#e0e0e0]">
                  {analytics.notesByState.seed}
                </p>
              </div>
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-2xl">🌱</span>
                  <span className="font-['Courier_New'] text-[11px] uppercase tracking-[0.15em] text-[#e0e0e0]/60">
                    Sprouts
                  </span>
                </div>
                <p className="font-['Cardo'] text-2xl text-[#e0e0e0]">
                  {analytics.notesByState.sprout}
                </p>
              </div>
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-2xl">🌸</span>
                  <span className="font-['Courier_New'] text-[11px] uppercase tracking-[0.15em] text-[#e0e0e0]/60">
                    Blooms
                  </span>
                </div>
                <p className="font-['Cardo'] text-2xl text-[#e0e0e0]">
                  {analytics.notesByState.bloom}
                </p>
              </div>
            </div>
          </div>

          {/* Monthly Activity Chart */}
          <div className="bg-[#1a1a1a] border border-[#333] rounded-lg p-6 mb-8">
            <h3 className="font-['Cardo'] text-xl text-[#7a9b76] mb-6">
              Monthly Activity
            </h3>
            <div className="flex items-end gap-2 h-48">
              {analytics.monthlyActivity.map((month, index) => (
                <div key={index} className="flex-1 flex flex-col items-center gap-2">
                  <div className="flex-1 w-full flex items-end">
                    <div
                      className="w-full bg-[#7a9b76] rounded-t transition-all hover:bg-[#8fb587]"
                      style={{ height: `${(month.count / maxMonthlyCount) * 100}%` }}
                      title={`${month.month}: ${month.count} notes`}
                    />
                  </div>
                  <span className="font-['Courier_New'] text-[9px] text-[#e0e0e0]/40 text-center">
                    {month.month.split(' ')[0]}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Two Column Layout */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Most Used Tags */}
            <div className="bg-[#1a1a1a] border border-[#333] rounded-lg p-6">
              <h3 className="font-['Cardo'] text-xl text-[#7a9b76] mb-4">
                Most Used Tags
              </h3>
              {analytics.mostUsedTags.length === 0 ? (
                <p className="text-[#e0e0e0]/40 text-sm">No tags yet</p>
              ) : (
                <div className="space-y-3">
                  {analytics.mostUsedTags.map((tag, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <span className="font-['Courier_New'] text-xs text-[#e0e0e0]/40 w-6">
                        {index + 1}.
                      </span>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-[#e0e0e0] text-sm">{tag.tag}</span>
                          <span className="text-[#e0e0e0]/60 text-xs">{tag.count}</span>
                        </div>
                        <div className="w-full bg-[#121212] rounded-full h-1.5">
                          <div
                            className="bg-[#7a9b76] h-1.5 rounded-full transition-all"
                            style={{ width: `${(tag.count / analytics.mostUsedTags[0].count) * 100}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Recurring Themes */}
            <div className="bg-[#1a1a1a] border border-[#333] rounded-lg p-6">
              <h3 className="font-['Cardo'] text-xl text-[#7a9b76] mb-4">
                Themes You Return To
              </h3>
              {analytics.recurringThemes.length === 0 ? (
                <p className="text-[#e0e0e0]/40 text-sm">Not enough data yet</p>
              ) : (
                <div className="space-y-4">
                  {analytics.recurringThemes.map((theme, index) => (
                    <div key={index} className="flex items-center gap-4">
                      <div className="flex-1">
                        <p className="text-[#e0e0e0] text-sm mb-1">{theme.tag}</p>
                        <p className="text-[#e0e0e0]/60 text-xs">
                          Appears in {theme.frequency}% of your notes
                        </p>
                      </div>
                      <div className="text-2xl">
                        {theme.frequency >= 50 ? '🌟' : theme.frequency >= 30 ? '✨' : '💫'}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Most Revisited Notes */}
          {analytics.mostRevisitedNotes.length > 0 && (
            <div className="bg-[#1a1a1a] border border-[#333] rounded-lg p-6 mt-8">
              <h3 className="font-['Cardo'] text-xl text-[#7a9b76] mb-4">
                Most Revisited Notes
              </h3>
              <div className="space-y-3">
                {analytics.mostRevisitedNotes.map((note, index) => (
                  <div
                    key={note.id}
                    className="flex items-center justify-between p-3 bg-[#121212] rounded hover:bg-[#1a1a1a] transition-colors cursor-pointer"
                    onClick={() => window.location.href = `/garden/write?id=${note.id}`}
                  >
                    <div className="flex-1">
                      <p className="text-[#e0e0e0] text-sm mb-1">{note.title}</p>
                      <p className="text-[#e0e0e0]/40 text-xs">
                        {note.wordCount} words
                      </p>
                    </div>
                    <div className="flex items-center gap-2 text-[#7a9b76]">
                      <span className="text-sm">🔁</span>
                      <span className="text-sm">{note.revisitCount}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}