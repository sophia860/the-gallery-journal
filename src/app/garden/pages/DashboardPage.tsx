import { useState, useEffect, useCallback } from 'react';
import { GardenMainNav } from '../../components/GardenMainNav';
import { NightSkyBackground } from '../../components/NightSkyBackground';
import { JoinTheGardenGate } from '../../components/JoinTheGardenGate';
import { WorkTypeBadge } from '../components/WorkTypeBadge';
import { useAuth } from '../../contexts/AuthContext';
import { notesService, GardenNote, NoteState, WorkType } from '../utils/notes';
import { calculateGardenSeason, calculateNoteWarmth, GardenSortOption, sortNotesByGardenLogic } from '../utils/gardenTime';

export function DashboardPage() {
  const { user, loading: authLoading, supabase } = useAuth();
  const [notes, setNotes] = useState<GardenNote[]>([]);
  const [filteredNotes, setFilteredNotes] = useState<GardenNote[]>([]);
  const [stateFilter, setStateFilter] = useState<'all' | NoteState>('all');
  const [tagFilter, setTagFilter] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<GardenSortOption>('connection-density');
  const [viewMode, setViewMode] = useState<'graph' | 'list'>('graph');
  const [allTags, setAllTags] = useState<string[]>([]);
  const [profile, setProfile] = useState<any>(null);

  // Calculate garden season based on activity patterns
  const gardenSeason = calculateGardenSeason(notes.map(n => ({
    id: n.id,
    updatedAt: n.updatedAt,
    state: n.state,
    tendedBy: n.tendedBy || []
  })));

  // Delete note callback - defined before early returns to follow hooks rules
  const handleDeleteNote = useCallback((noteId: string) => {
    if (window.confirm('Are you sure you want to delete this note?')) {
      notesService.deleteNote(noteId);
      if (user) {
        const userNotes = notesService.getNotes(user.id);
        setNotes(userNotes);
        const tags = notesService.getUserTags(user.id);
        setAllTags(tags);
      }
    }
  }, [user]);

  // Load user profile and writings from Supabase - must be before early returns
  useEffect(() => {
    if (!user) return;
    
    const loadUserData = async () => {
      try {
        const { data: profileData } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();
        
        if (profileData) {
          setProfile(profileData);
        }
        
        const { data: writings } = await supabase
          .from('writings')
          .select('*')
          .eq('user_id', user.id)
          .order('updated_at', { ascending: false });
        
        if (writings) {
          const gardenNotes: GardenNote[] = writings.map(w => ({
            id: w.id,
            userId: w.user_id,
            title: w.title,
            content: w.content,
            state: w.growth_stage as NoteState,
            tags: w.tags || [],
            createdAt: w.created_at,
            updatedAt: w.updated_at,
            revisitCount: w.revisit_count || 0,
            revisitDate: w.revisit_date || null,
            growsFrom: w.grows_from || [],
            growsInto: w.grows_into || [],
            wordCount: w.word_count || 0,
            isPublic: w.is_public || false,
            sharedWithCircles: w.shared_with_circles || [],
            responseLevel: w.response_level || 'silent',
            versions: w.versions || [],
            workType: (w.work_type as WorkType) || 'prose',
            tendedBy: [],
            graftedTo: [],
            transplantHistory: [],
            visibility: w.visibility || 'private'
          }));
          setNotes(gardenNotes);
          const uniqueTags = [...new Set(gardenNotes.flatMap(n => n.tags))];
          setAllTags(uniqueTags);
        }
      } catch (error) {
        console.error('Error loading user data:', error);
        const userNotes = notesService.getNotes(user.id);
        setNotes(userNotes);
        const tags = notesService.getUserTags(user.id);
        setAllTags(tags);
      }
    };
    loadUserData();
  }, [user, supabase]);

  // Filter and sort notes - must be before early returns
  useEffect(() => {
    if (!user) return;
    let filtered = [...notes];
    
    if (stateFilter !== 'all') {
      filtered = filtered.filter(note => note.state === stateFilter);
    }
    if (tagFilter) {
      filtered = filtered.filter(note => note.tags.includes(tagFilter));
    }
    if (searchQuery) {
      filtered = notesService.searchNotes(user.id, searchQuery);
      if (stateFilter !== 'all') {
        filtered = filtered.filter(note => note.state === stateFilter);
      }
      if (tagFilter) {
        filtered = filtered.filter(note => note.tags.includes(tagFilter));
      }
    }
    filtered = sortNotesByGardenLogic(filtered, sortBy);
    setFilteredNotes(filtered);
  }, [notes, stateFilter, tagFilter, searchQuery, sortBy, user?.id]);

  // LOADING STATE: Show loading while checking auth
  if (authLoading) {
    return (
      <div className="min-h-screen bg-[#0a0e1a] relative flex items-center justify-center">
        <NightSkyBackground />
        <div className="relative z-10 text-center">
          <div className="inline-block mb-6" style={{ filter: 'drop-shadow(0 0 20px rgba(122, 155, 118, 0.3))' }}>
            <span className="text-6xl animate-pulse">🌱</span>
          </div>
          <p className="font-['Playfair_Display'] italic text-2xl text-white/70">Loading your garden...</p>
        </div>
      </div>
    );
  }

  // AUTH GATE: Show join gate if not logged in
  if (!user) {
    return <JoinTheGardenGate />;
  }

  const getStateIcon = (state: NoteState) => {
    switch (state) {
      case 'seed': return '🌰';
      case 'sprout': return '🌱';
      case 'bloom': return '🌸';
    }
  };

  const getStateLabel = (state: NoteState) => {
    switch (state) {
      case 'seed': return 'Seed';
      case 'sprout': return 'Sprout';
      case 'bloom': return 'Bloom';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    if (days === 0) return 'Today';
    if (days === 1) return 'Yesterday';
    if (days < 7) return `${days} days ago`;
    return date.toLocaleDateString();
  };

  const stripHtml = (html: string) => {
    return html.replace(/<[^>]*>/g, '').substring(0, 100);
  };

  return (
    <div className="min-h-screen bg-[#0a0e1a] relative">
      <style>{`
        .sparkle-dot { opacity: 0; animation: sparkle-twinkle 2s ease-in-out infinite; }
        @keyframes sparkle-twinkle { 0%, 100% { opacity: 0; transform: scale(0.8); } 50% { opacity: 1; transform: scale(1.2); } }
        .neighbor-garden-card:hover .sparkle-dot { animation: sparkle-twinkle 2s ease-in-out infinite; }
        .vignette-effect { background: radial-gradient(ellipse at center, transparent 0%, transparent 40%, rgba(0,0,0,0.3) 80%, rgba(0,0,0,0.5) 100%); }
        .swaying-plant { animation: plant-sway 3s ease-in-out infinite; transform-origin: bottom center; }
        @keyframes plant-sway { 0%, 100% { transform: rotate(-2deg); } 50% { transform: rotate(2deg); } }
      `}</style>
      <NightSkyBackground />
      <GardenMainNav variant="dark" />
      
      <div className="max-w-6xl mx-auto px-8 pt-32 pb-24 relative z-10">
        <div className="mb-16 text-center">
          <h1 className="font-['Playfair_Display'] text-5xl text-white mb-4">Your Garden</h1>
          <div className="flex items-center justify-center gap-2 mb-4">
            <span className="text-2xl">{gardenSeason.icon}</span>
            <span className="font-['Cormorant_Garamond'] text-lg text-[#8b9dc3]">{gardenSeason.description}</span>
          </div>
          <p className="font-['Cormorant_Garamond'] text-xl text-white/60">A place to grow writing</p>
          <button onClick={() => window.location.href = '/garden/write'} className="mt-8 group px-8 py-4 rounded-lg backdrop-blur-xl transition-all duration-300 cursor-pointer relative overflow-hidden" style={{ background: 'rgba(122, 155, 118, 0.15)', border: '1px solid rgba(122, 155, 118, 0.4)', boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3), inset 0 0 20px rgba(122, 155, 118, 0.1)' }}>
            <span className="text-[#7a9b76] font-['Cormorant_Garamond'] text-lg">✦ New Note</span>
          </button>
        </div>

        {/* Filters and Search */}
        <div className="mb-8 space-y-4">
          <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full bg-[#1a1a1a] border border-[#333] rounded px-4 py-3 text-[#e0e0e0] focus:border-[#7a9b76] focus:outline-none" placeholder="Search notes..." />
          <div className="flex flex-wrap gap-2">
            <button onClick={() => setStateFilter('all')} className={`px-4 py-2 rounded font-['Courier_New'] text-[11px] uppercase tracking-[0.15em] transition-colors cursor-pointer ${stateFilter === 'all' ? 'bg-[#7a9b76] text-white' : 'bg-[#1a1a1a] border border-[#333] text-[#e0e0e0] hover:border-[#7a9b76]'}`}>All</button>
            <button onClick={() => setStateFilter('seed')} className={`px-4 py-2 rounded font-['Courier_New'] text-[11px] uppercase tracking-[0.15em] transition-colors cursor-pointer ${stateFilter === 'seed' ? 'bg-[#7a9b76] text-white' : 'bg-[#1a1a1a] border border-[#333] text-[#e0e0e0] hover:border-[#7a9b76]'}`}>🌰 Seeds</button>
            <button onClick={() => setStateFilter('sprout')} className={`px-4 py-2 rounded font-['Courier_New'] text-[11px] uppercase tracking-[0.15em] transition-colors cursor-pointer ${stateFilter === 'sprout' ? 'bg-[#7a9b76] text-white' : 'bg-[#1a1a1a] border border-[#333] text-[#e0e0e0] hover:border-[#7a9b76]'}`}>🌱 Sprouts</button>
            <button onClick={() => setStateFilter('bloom')} className={`px-4 py-2 rounded font-['Courier_New'] text-[11px] uppercase tracking-[0.15em] transition-colors cursor-pointer ${stateFilter === 'bloom' ? 'bg-[#7a9b76] text-white' : 'bg-[#1a1a1a] border border-[#333] text-[#e0e0e0] hover:border-[#7a9b76]'}`}>🌸 Blooms</button>
          </div>
        </div>

        {/* Notes Display */}
        {filteredNotes.length === 0 ? (
          <div className="text-center py-24">
            <div className="inline-block mb-6" style={{ filter: 'drop-shadow(0 0 20px rgba(122, 155, 118, 0.3))' }}>
              <span className="text-6xl">🌱</span>
            </div>
            <p className="font-['Playfair_Display'] italic text-2xl text-white/70 mb-8">{searchQuery || stateFilter !== 'all' || tagFilter ? 'No notes match your filters' : 'Your garden awaits'}</p>
            {!searchQuery && stateFilter === 'all' && !tagFilter && (
              <button onClick={() => window.location.href = '/garden/write'} className="group px-8 py-4 rounded-lg backdrop-blur-xl transition-all cursor-pointer" style={{ background: 'rgba(122, 155, 118, 0.15)', border: '1px solid rgba(122, 155, 118, 0.4)' }}>
                <span className="text-[#7a9b76] font-['Cormorant_Garamond'] text-lg">Plant Your First Seed</span>
              </button>
            )}
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredNotes.map(note => (
              <div key={note.id} className="group relative bg-[#1a1a1a]/50 border border-[#333] rounded-lg p-6 cursor-pointer hover:border-[#7a9b76] transition-all" onClick={() => window.location.href = `/garden/write?id=${note.id}`}>
                <div className="flex items-center justify-between mb-4">
                  <span className="px-2 py-1 bg-[#7a9b76]/20 text-[#7a9b76] rounded text-sm">{getStateIcon(note.state)} {getStateLabel(note.state)}</span>
                  <button onClick={(e) => { e.stopPropagation(); handleDeleteNote(note.id); }} className="text-white/30 hover:text-red-400">🗑️</button>
                </div>
                <h3 className="font-['Playfair_Display'] text-xl text-white mb-2">{note.title}</h3>
                <p className="text-white/60 text-sm line-clamp-3">{stripHtml(note.content) || 'No content yet...'}</p>
                {note.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-4">
                    {note.tags.slice(0, 3).map((tag, i) => <span key={i} className="px-2 py-0.5 bg-[#333] text-[#8b9dc3] rounded text-xs">{tag}</span>)}
                  </div>
                )}
                <div className="mt-4 flex items-center gap-4 text-white/40 text-xs">
                  {note.workType && <WorkTypeBadge type={note.workType} />}
                  <span>{note.wordCount} words</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
