// Analytics/Harvest utility for The Garden
import { notesService, GardenNote } from './notes';

export interface HarvestAnalytics {
  totalNotes: number;
  notesByState: {
    seed: number;
    sprout: number;
    bloom: number;
  };
  totalWordCount: number;
  mostUsedTags: { tag: string; count: number }[];
  writingStreak: number;
  mostRevisitedNotes: GardenNote[];
  monthlyActivity: { month: string; count: number }[];
  recurringThemes: { tag: string; frequency: number }[];
}

export const harvestService = {
  // Get comprehensive analytics for a user
  getAnalytics: (userId: string): HarvestAnalytics => {
    const notes = notesService.getNotes(userId);

    return {
      totalNotes: notes.length,
      notesByState: harvestService.countByState(notes),
      totalWordCount: harvestService.calculateTotalWords(notes),
      mostUsedTags: harvestService.getTopTags(notes, 10),
      writingStreak: harvestService.calculateStreak(notes),
      mostRevisitedNotes: harvestService.getMostRevisited(notes, 5),
      monthlyActivity: harvestService.getMonthlyActivity(notes),
      recurringThemes: harvestService.getRecurringThemes(notes)
    };
  },

  // Count notes by state
  countByState: (notes: GardenNote[]) => {
    return {
      seed: notes.filter(n => n.state === 'seed').length,
      sprout: notes.filter(n => n.state === 'sprout').length,
      bloom: notes.filter(n => n.state === 'bloom').length
    };
  },

  // Calculate total word count
  calculateTotalWords: (notes: GardenNote[]): number => {
    return notes.reduce((sum, note) => sum + note.wordCount, 0);
  },

  // Get top N most used tags
  getTopTags: (notes: GardenNote[], limit: number = 10): { tag: string; count: number }[] => {
    const tagCounts = new Map<string, number>();

    notes.forEach(note => {
      note.tags.forEach(tag => {
        tagCounts.set(tag, (tagCounts.get(tag) || 0) + 1);
      });
    });

    return Array.from(tagCounts.entries())
      .map(([tag, count]) => ({ tag, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, limit);
  },

  // Calculate writing streak (consecutive days)
  calculateStreak: (notes: GardenNote[]): number => {
    if (notes.length === 0) return 0;

    // Get unique dates when user wrote
    const dates = notes
      .map(note => new Date(note.createdAt).toDateString())
      .filter((date, index, self) => self.indexOf(date) === index)
      .sort((a, b) => new Date(b).getTime() - new Date(a).getTime());

    let streak = 0;
    let currentDate = new Date();

    for (const dateStr of dates) {
      const noteDate = new Date(dateStr);
      const diffDays = Math.floor((currentDate.getTime() - noteDate.getTime()) / (1000 * 60 * 60 * 24));

      if (diffDays === streak) {
        streak++;
      } else if (diffDays > streak) {
        break;
      }
    }

    return streak;
  },

  // Get most revisited notes
  getMostRevisited: (notes: GardenNote[], limit: number = 5): GardenNote[] => {
    return notes
      .sort((a, b) => b.revisitCount - a.revisitCount)
      .slice(0, limit);
  },

  // Get monthly activity (last 12 months)
  getMonthlyActivity: (notes: GardenNote[]): { month: string; count: number }[] => {
    const monthCounts = new Map<string, number>();
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

    // Initialize last 12 months
    const now = new Date();
    for (let i = 11; i >= 0; i--) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const key = `${months[date.getMonth()]} ${date.getFullYear()}`;
      monthCounts.set(key, 0);
    }

    // Count notes per month
    notes.forEach(note => {
      const date = new Date(note.createdAt);
      const key = `${months[date.getMonth()]} ${date.getFullYear()}`;
      if (monthCounts.has(key)) {
        monthCounts.set(key, (monthCounts.get(key) || 0) + 1);
      }
    });

    return Array.from(monthCounts.entries()).map(([month, count]) => ({ month, count }));
  },

  // Get recurring themes based on tag frequency
  getRecurringThemes: (notes: GardenNote[]): { tag: string; frequency: number }[] => {
    const topTags = harvestService.getTopTags(notes, 5);
    return topTags.map(({ tag, count }) => ({
      tag,
      frequency: Math.round((count / notes.length) * 100)
    }));
  }
};
