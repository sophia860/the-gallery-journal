import { useState, useEffect, useCallback } from 'react';
import { GardenMainNav } from '../../components/GardenMainNav';
import { NightSkyBackground } from '../../components/NightSkyBackground';
import { WorkTypeBadge } from '../components/WorkTypeBadge';
import { useAuth } from '../../contexts/AuthContext';
import { notesService, GardenNote, NoteState, WorkType } from '../utils/notes';
import { calculateGardenSeason, calculateNoteWarmth, GardenSortOption, sortNotesByGardenLogic } from '../utils/gardenTime';

export function DashboardPage() {
  const { user, loading, supabase } = useAuth();
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

  // Check auth and redirect if needed
  useEffect(() => {
    if (!loading && !user) {
      window.location.href = '/garden/login';
    }
  }, [user, loading]);

  // Load user profile and writings from Supabase
  useEffect(() => {
    if (user) {
      const loadUserData = async () => {
        try {
          // Load profile
          const { data: profileData } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', user.id)
            .single();
          
          if (profileData) {
            setProfile(profileData);
          }

          // Load writings
          const { data: writings } = await supabase
            .from('writings')
            .select('*')
            .eq('user_id', user.id)
            .order('updated_at', { ascending: false });

          if (writings) {
            // Convert Supabase writings to GardenNote format
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

            // Extract unique tags
            const uniqueTags = [...new Set(gardenNotes.flatMap(n => n.tags))];
            setAllTags(uniqueTags);
          }
        } catch (error) {
          console.error('Error loading user data:', error);
          // Fall back to localStorage if Supabase fails
          const userNotes = notesService.getNotes(user.id);
          setNotes(userNotes);
          const tags = notesService.getUserTags(user.id);
          setAllTags(tags);
        }
      };

      loadUserData();
    }
  }, [user, supabase]);

  // Filter and sort notes whenever dependencies change
  useEffect(() => {
    if (!user) return;

    let filtered = [...notes];

    // Filter by state
    if (stateFilter !== 'all') {
      filtered = filtered.filter(note => note.state === stateFilter);
    }

    // Filter by tag
    if (tagFilter) {
      filtered = filtered.filter(note => note.tags.includes(tagFilter));
    }

    // Search
    if (searchQuery) {
      filtered = notesService.searchNotes(user.id, searchQuery);
      if (stateFilter !== 'all') {
        filtered = filtered.filter(note => note.state === stateFilter);
      }
      if (tagFilter) {
        filtered = filtered.filter(note => note.tags.includes(tagFilter));
      }
    }

    // Sort
    filtered = sortNotesByGardenLogic(filtered, sortBy);

    setFilteredNotes(filtered);
  }, [notes, stateFilter, tagFilter, searchQuery, sortBy, user?.id]);

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

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-[#0a0e1a] relative">
      <NightSkyBackground />
      <GardenMainNav />
      
      <style>{`
        /* Sparkle dot animations */
        .sparkle-dot {
          opacity: 0;
          animation: sparkle-twinkle 2s ease-in-out infinite;
        }
        
        @keyframes sparkle-twinkle {
          0%, 100% {
            opacity: 0;
            transform: scale(0.8);
          }
          50% {
            opacity: 1;
            transform: scale(1.2);
          }
        }
        
        .neighbor-garden-card:hover .sparkle-dot {
          animation: sparkle-twinkle 2s ease-in-out infinite;
        }
        
        /* Vignette depth effect */
        .vignette-effect {
          background: radial-gradient(
            ellipse at center,
            transparent 0%,
            transparent 40%,
            rgba(0, 0, 0, 0.3) 80%,
            rgba(0, 0, 0, 0.5) 100%
          );
        }
        
        /* Swaying plant animation */
        .swaying-plant {
          animation: plant-sway 3s ease-in-out infinite;
          transform-origin: bottom center;
        }
        
        @keyframes plant-sway {
          0%, 100% {
            transform: rotate(-2deg);
          }
          50% {
            transform: rotate(2deg);
          }
        }
      `}</style>
      
      <div className="relative z-10 pt-24 px-8 pb-16">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-12">
            <div>
              <div className="flex items-center gap-4 mb-3">
                <h1 
                  className="font-['Playfair_Display'] italic text-5xl text-white/95"
                  style={{ textShadow: '0 0 40px rgba(122, 155, 118, 0.4)' }}
                >
                  Your Garden
                </h1>
                {/* Seasonal indicator - based on activity patterns, not calendar */}
                <div 
                  className="flex items-center gap-3 px-4 py-2 rounded-full backdrop-blur-xl"
                  style={{
                    background: 'rgba(122, 155, 118, 0.1)',
                    border: '1px solid rgba(122, 155, 118, 0.3)',
                    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3), inset 0 0 20px rgba(122, 155, 118, 0.05)'
                  }}
                >
                  <span className="text-xl" style={{ filter: 'drop-shadow(0 0 6px rgba(122, 155, 118, 0.8))' }}>{gardenSeason.icon}</span>
                  <span className="font-['Cormorant_Garamond'] text-[11px] uppercase tracking-[0.2em] text-[#7a9b76]">
                    {gardenSeason.description}
                  </span>
                </div>
              </div>
              <p className="font-['Cormorant_Garamond'] text-lg text-white/50">
                A place to grow writing
              </p>
            </div>
            <button
              onClick={() => window.location.href = '/garden/write'}
              className="group px-8 py-4 rounded-lg backdrop-blur-xl transition-all duration-300 cursor-pointer relative overflow-hidden"
              style={{
                background: 'rgba(122, 155, 118, 0.15)',
                border: '1px solid rgba(122, 155, 118, 0.4)',
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3), inset 0 0 20px rgba(122, 155, 118, 0.1)'
              }}
            >
              <span className="relative z-10 font-['Cormorant_Garamond'] text-[13px] uppercase tracking-[0.25em] text-white flex items-center gap-2">
                <span className="text-lg">✦</span>
                New Note
              </span>
              <div 
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                style={{
                  background: 'radial-gradient(circle at center, rgba(122, 155, 118, 0.2) 0%, transparent 70%)'
                }}
              />
            </button>
          </div>

          {/* NEIGHBOURING GARDENS - shows 2-3 recent blooms from nearby gardens */}
          <div className="mb-12 pb-8">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 
                  className="font-['Playfair_Display'] italic text-3xl text-white/90 mb-2"
                  style={{ textShadow: '0 0 30px rgba(138, 157, 195, 0.3)' }}
                >
                  Neighbouring Gardens
                </h2>
                <p className="font-['Cormorant_Garamond'] text-base text-white/40">
                  Recent blooms from gardens near yours
                </p>
              </div>
              <button
                onClick={() => window.location.href = '/garden/neighbours'}
                className="font-['Cormorant_Garamond'] text-[12px] uppercase tracking-[0.2em] text-[#8b9dc3]/80 hover:text-[#8b9dc3] transition-colors"
              >
                View All →
              </button>
            </div>
            
            {/* Neighbouring blooms */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { gardenName: 'River\'s Garden', title: 'On Silence', snippet: 'The spaces between words carry more weight than...' },
                { gardenName: 'Moon\'s Garden', title: 'Fragments', snippet: 'I collect the edges of conversations, the moments when...' },
                { gardenName: 'Oak\'s Garden', title: 'Winter Light', snippet: 'In December, the sun arrives at an angle that makes...' }
              ].map((bloom, i) => (
                <div
                  key={i}
                  className="group relative rounded-xl p-6 backdrop-blur-xl transition-all duration-300 cursor-pointer overflow-hidden neighbor-garden-card"
                  style={{
                    background: 'rgba(138, 157, 195, 0.08)',
                    border: '1px solid rgba(138, 157, 195, 0.2)',
                    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)'
                  }}
                  onClick={() => {/* Navigate to bloom */}}
                >
                  {/* Sparkle dots - appear on hover */}
                  <div className="absolute top-3 right-3 w-1 h-1 rounded-full sparkle-dot" style={{ background: '#60a5fa', boxShadow: '0 0 8px rgba(96, 165, 250, 0.8)' }}></div>
                  <div className="absolute top-5 right-8 w-1.5 h-1.5 rounded-full sparkle-dot" style={{ background: '#10b981', boxShadow: '0 0 8px rgba(16, 185, 129, 0.8)', animationDelay: '0.3s' }}></div>
                  <div className="absolute bottom-6 left-4 w-1 h-1 rounded-full sparkle-dot" style={{ background: '#ec4899', boxShadow: '0 0 8px rgba(236, 72, 153, 0.8)', animationDelay: '0.6s' }}></div>
                  
                  {/* Swaying plant icon */}
                  <div className="absolute bottom-3 right-3 opacity-40 group-hover:opacity-70 transition-opacity">
                    <svg className="w-5 h-5 text-[#10b981] swaying-plant" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M12 22V8M12 8C12 8 14 6 14 4C14 2 12 2 12 2C12 2 10 2 10 4C10 6 12 8 12 8ZM12 14C12 14 14 12 16 12C18 12 18 14 18 14C18 14 18 16 16 16C14 16 12 14 12 14ZM12 14C12 14 10 12 8 12C6 12 6 14 6 14C6 14 6 16 8 16C10 16 12 14 12 14Z" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                  
                  {/* Vignette depth effect on hover */}
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none vignette-effect"></div>
                  
                  <div className="relative z-10">
                    <p className="font-['Cormorant_Garamond'] text-[11px] uppercase tracking-[0.25em] text-[#8b9dc3]/70 mb-3">
                      {bloom.gardenName}
                    </p>
                    <h3 className="font-['Playfair_Display'] italic text-xl text-white/90 mb-3">
                      {bloom.title}
                    </h3>
                    <p className="font-['Cormorant_Garamond'] text-base text-white/50 leading-relaxed line-clamp-2">
                      {bloom.snippet}
                    </p>
                  </div>
                  <div 
                    className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                    style={{
                      background: 'radial-gradient(circle at center, rgba(138, 157, 195, 0.15) 0%, transparent 70%)'
                    }}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Filters and Search */}
          <div className="mb-8 space-y-4">
            {/* Search */}
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#1a1a1a] border border-[#333] rounded px-4 py-3 text-[#e0e0e0] focus:border-[#7a9b76] focus:outline-none transition-colors"
              placeholder="Search notes..."
            />

            {/* Filters row */}
            <div className="flex flex-wrap gap-4">
              {/* State filter */}
              <div className="flex gap-2">
                <button
                  onClick={() => setStateFilter('all')}
                  className={`px-4 py-2 rounded font-['Courier_New'] text-[11px] uppercase tracking-[0.15em] transition-colors cursor-pointer ${
                    stateFilter === 'all'
                      ? 'bg-[#7a9b76] text-white'
                      : 'bg-[#1a1a1a] border border-[#333] text-[#e0e0e0] hover:border-[#7a9b76]'
                  }`}
                >
                  All
                </button>
                <button
                  onClick={() => setStateFilter('seed')}
                  className={`px-4 py-2 rounded font-['Courier_New'] text-[11px] uppercase tracking-[0.15em] transition-colors cursor-pointer ${
                    stateFilter === 'seed'
                      ? 'bg-[#7a9b76] text-white'
                      : 'bg-[#1a1a1a] border border-[#333] text-[#e0e0e0] hover:border-[#7a9b76]'
                  }`}
                >
                  🌰 Seeds
                </button>
                <button
                  onClick={() => setStateFilter('sprout')}
                  className={`px-4 py-2 rounded font-['Courier_New'] text-[11px] uppercase tracking-[0.15em] transition-colors cursor-pointer ${
                    stateFilter === 'sprout'
                      ? 'bg-[#7a9b76] text-white'
                      : 'bg-[#1a1a1a] border border-[#333] text-[#e0e0e0] hover:border-[#7a9b76]'
                  }`}
                >
                  🌱 Sprouts
                </button>
                <button
                  onClick={() => setStateFilter('bloom')}
                  className={`px-4 py-2 rounded font-['Courier_New'] text-[11px] uppercase tracking-[0.15em] transition-colors cursor-pointer ${
                    stateFilter === 'bloom'
                      ? 'bg-[#7a9b76] text-white'
                      : 'bg-[#1a1a1a] border border-[#333] text-[#e0e0e0] hover:border-[#7a9b76]'
                  }`}
                >
                  🌸 Blooms
                </button>
              </div>

              {/* Tag filter */}
              {allTags.length > 0 && (
                <select
                  value={tagFilter}
                  onChange={(e) => setTagFilter(e.target.value)}
                  className="bg-[#1a1a1a] border border-[#333] rounded px-4 py-2 text-[#e0e0e0] text-sm focus:border-[#7a9b76] focus:outline-none transition-colors cursor-pointer"
                >
                  <option value="">All tags</option>
                  {allTags.map(tag => (
                    <option key={tag} value={tag}>{tag}</option>
                  ))}
                </select>
              )}

              {/* Sort */}
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as GardenSortOption)}
                className="bg-[#1a1a1a] border border-[#333] rounded px-4 py-2 text-[#e0e0e0] text-sm focus:border-[#7a9b76] focus:outline-none transition-colors cursor-pointer"
              >
                <option value="connection-density">Most Connected</option>
                <option value="recently-tended">Recently Tended</option>
                <option value="deepest-roots">Deepest Roots</option>
                <option value="discovery">Discovery</option>
              </select>

              {/* View mode */}
              <div className="flex gap-2">
                <button
                  onClick={() => setViewMode('graph')}
                  className={`px-4 py-2 rounded font-['Courier_New'] text-[11px] uppercase tracking-[0.15em] transition-colors cursor-pointer ${
                    viewMode === 'graph'
                      ? 'bg-[#7a9b76] text-white'
                      : 'bg-[#1a1a1a] border border-[#333] text-[#e0e0e0] hover:border-[#7a9b76]'
                  }`}
                >
                  Graph
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`px-4 py-2 rounded font-['Courier_New'] text-[11px] uppercase tracking-[0.15em] transition-colors cursor-pointer ${
                    viewMode === 'list'
                      ? 'bg-[#7a9b76] text-white'
                      : 'bg-[#1a1a1a] border border-[#333] text-[#e0e0e0] hover:border-[#7a9b76]'
                  }`}
                >
                  List
                </button>
              </div>
            </div>
          </div>

          {/* Notes Display */}
          {filteredNotes.length === 0 ? (
            <div className="text-center py-20">
              <div 
                className="inline-block mb-6"
                style={{
                  filter: 'drop-shadow(0 0 20px rgba(122, 155, 118, 0.3))'
                }}
              >
                <span className="text-6xl">🌱</span>
              </div>
              <p className="font-['Playfair_Display'] italic text-2xl text-white/70 mb-6">
                {searchQuery || stateFilter !== 'all' || tagFilter
                  ? 'No notes match your filters'
                  : 'Your garden awaits'}
              </p>
              {!searchQuery && stateFilter === 'all' && !tagFilter && (
                <button
                  onClick={() => window.location.href = '/garden/write'}
                  className="group px-8 py-4 rounded-lg backdrop-blur-xl transition-all duration-300 cursor-pointer relative overflow-hidden"
                  style={{
                    background: 'rgba(122, 155, 118, 0.15)',
                    border: '1px solid rgba(122, 155, 118, 0.4)',
                    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3), inset 0 0 20px rgba(122, 155, 118, 0.1)'
                  }}
                >
                  <span className="relative z-10 font-['Cormorant_Garamond'] text-[13px] uppercase tracking-[0.25em] text-white">
                    Plant Your First Seed
                  </span>
                  <div 
                    className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    style={{
                      background: 'radial-gradient(circle at center, rgba(122, 155, 118, 0.25) 0%, transparent 70%)'
                    }}
                  />
                </button>
              )}
            </div>
          ) : (
            <div className={viewMode === 'graph' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' : 'space-y-4'}>
              {filteredNotes.map(note => {
                // Get connected notes for display
                const growsFromNotes = (note.growsFrom || [])
                  .map(id => notes.find(n => n.id === id))
                  .filter(Boolean);
                const growsIntoNotes = (note.growsInto || [])
                  .map(id => notes.find(n => n.id === id))
                  .filter(Boolean);

                return (
                  <div
                    key={note.id}
                    className="group relative rounded-xl p-6 backdrop-blur-xl transition-all duration-300 cursor-pointer overflow-hidden"
                    style={{
                      background: 'rgba(26, 30, 42, 0.6)',
                      border: '1px solid rgba(122, 155, 118, 0.2)',
                      boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3), inset 0 1px 1px rgba(255, 255, 255, 0.05)'
                    }}
                    onClick={() => window.location.href = `/garden/write?id=${note.id}`}
                  >
                    {/* Hover glow effect */}
                    <div 
                      className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                      style={{
                        background: 'radial-gradient(circle at center, rgba(122, 155, 118, 0.15) 0%, transparent 70%)'
                      }}
                    />
                    
                    <div className="relative z-10">
                      {/* State badge */}
                      <div className="flex items-center justify-between mb-4">
                        <span 
                          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full backdrop-blur-xl text-sm"
                          style={{
                            background: 'rgba(122, 155, 118, 0.2)',
                            border: '1px solid rgba(122, 155, 118, 0.4)',
                            color: '#7a9b76',
                            boxShadow: '0 4px 16px rgba(0, 0, 0, 0.2), inset 0 0 10px rgba(122, 155, 118, 0.1)'
                          }}
                        >
                          <span style={{ filter: 'drop-shadow(0 0 4px rgba(122, 155, 118, 0.8))' }}>
                            {getStateIcon(note.state)}
                          </span>
                          <span className="font-['Cormorant_Garamond'] uppercase tracking-wider text-xs">
                            {getStateLabel(note.state)}
                          </span>
                        </span>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteNote(note.id);
                          }}
                          className="text-white/30 hover:text-red-400 transition-all duration-300 hover:scale-110"
                        >
                          🗑️
                        </button>
                      </div>

                      {/* Title */}
                      <h3 
                        className="font-['Playfair_Display'] italic text-xl text-white/95 mb-3 line-clamp-2 group-hover:text-white transition-colors"
                        style={{ textShadow: '0 2px 10px rgba(0, 0, 0, 0.3)' }}
                      >
                        {note.title}
                      </h3>

                      {/* Content preview */}
                      <p className="font-['Cormorant_Garamond'] text-base text-white/60 mb-4 line-clamp-3 leading-relaxed">
                        {stripHtml(note.content) || 'No content yet...'}
                      </p>

                      {/* Connections */}
                      {(growsFromNotes.length > 0 || growsIntoNotes.length > 0) && (
                        <div className="mb-4 pb-4 border-b border-white/5">
                          {growsFromNotes.length > 0 && (
                            <div className="mb-2">
                              <p className="font-['Cormorant_Garamond'] text-xs text-[#7a9b76]/70 mb-1.5 uppercase tracking-wider">
                                Grows from:
                              </p>
                              <div className="flex flex-wrap gap-2">
                                {growsFromNotes.map(fromNote => (
                                  <span
                                    key={fromNote?.id}
                                    className="text-xs text-[#7a9b76] hover:text-[#8fb587] hover:underline transition-colors px-2 py-1 rounded"
                                    style={{
                                      background: 'rgba(122, 155, 118, 0.1)',
                                      border: '1px solid rgba(122, 155, 118, 0.2)'
                                    }}
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      window.location.href = `/garden/write?id=${fromNote?.id}`;
                                    }}
                                  >
                                    {fromNote?.title}
                                  </span>
                                ))}
                              </div>
                            </div>
                          )}
                          {growsIntoNotes.length > 0 && (
                            <div>
                              <p className="font-['Cormorant_Garamond'] text-xs text-[#7a9b76]/70 mb-1.5 uppercase tracking-wider">
                                Grows into:
                              </p>
                              <div className="flex flex-wrap gap-2">
                                {growsIntoNotes.map(intoNote => (
                                  <span
                                    key={intoNote?.id}
                                    className="text-xs text-[#7a9b76] hover:text-[#8fb587] hover:underline transition-colors px-2 py-1 rounded"
                                    style={{
                                      background: 'rgba(122, 155, 118, 0.1)',
                                      border: '1px solid rgba(122, 155, 118, 0.2)'
                                    }}
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      window.location.href = `/garden/write?id=${intoNote?.id}`;
                                    }}
                                  >
                                    {intoNote?.title}
                                  </span>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      )}

                      {/* Tags */}
                      {note.tags.length > 0 && (
                        <div className="flex flex-wrap gap-2 mb-4">
                          {note.tags.slice(0, 3).map((tag, index) => (
                            <span
                              key={index}
                              className="px-3 py-1 rounded-full text-xs font-['Cormorant_Garamond'] backdrop-blur-sm"
                              style={{
                                background: 'rgba(138, 157, 195, 0.15)',
                                border: '1px solid rgba(138, 157, 195, 0.3)',
                                color: '#8b9dc3'
                              }}
                            >
                              {tag}
                            </span>
                          ))}
                          {note.tags.length > 3 && (
                            <span className="px-3 py-1 text-white/40 text-xs font-['Cormorant_Garamond']">
                              +{note.tags.length - 3}
                            </span>
                          )}
                        </div>
                      )}

                      {/* Footer info */}
                      <div className="flex items-center justify-between text-xs text-white/40">
                        <div className="flex items-center gap-3">
                          {note.workType && <WorkTypeBadge workType={note.workType} />}
                          <span className="font-['Cormorant_Garamond']">{note.wordCount} words</span>
                        </div>
                        {note.growsFrom && note.growsFrom.length === 0 && note.growsInto && note.growsInto.length === 0 && (
                          <span className="font-['Cormorant_Garamond'] italic">Unplanted</span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}