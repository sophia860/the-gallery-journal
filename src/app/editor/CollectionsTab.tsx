import { useState, useEffect } from 'react';
import { X, Plus, GripVertical, Trash2, Eye } from 'lucide-react';

interface Writing {
  id: string;
  title: string;
  content: string;
  growth_stage: 'seed' | 'sprout' | 'bloom';
  work_type?: string;
  tags?: string[];
  word_count?: number;
  created_at: string;
  updated_at: string;
  user_id: string;
  profiles?: {
    garden_name: string;
    full_name: string;
  };
}

interface Collection {
  id: string;
  title: string;
  description: string;
  theme_color: string;
  status: 'draft' | 'ready' | 'published';
  piece_ids: string[];
  created_at: string;
  updated_at: string;
}

interface CollectionsTabProps {
  pickedWritings: Writing[];
}

// Mock collections data
const MOCK_COLLECTIONS: Collection[] = [
  {
    id: 'col1',
    title: 'Voices of the Season',
    description: 'A curated collection exploring themes of change, transition, and seasonal reflection.',
    theme_color: '#c4a46c',
    status: 'published',
    piece_ids: ['w1', 'w6'],
    created_at: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'col2',
    title: 'Urban Narratives',
    description: 'Stories and reflections from city life - the poetry of concrete and neon.',
    theme_color: '#8b9dc3',
    status: 'draft',
    piece_ids: ['w2', 'w5'],
    created_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
  },
];

export function CollectionsTab({ pickedWritings }: CollectionsTabProps) {
  const [collections, setCollections] = useState<Collection[]>([]);
  const [view, setView] = useState<'list' | 'detail' | 'create'>('list');
  const [selectedCollection, setSelectedCollection] = useState<Collection | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showAddPiecesModal, setShowAddPiecesModal] = useState(false);
  
  // Create/Edit form state
  const [formTitle, setFormTitle] = useState('');
  const [formDescription, setFormDescription] = useState('');
  const [formThemeColor, setFormThemeColor] = useState('#c4a46c');
  
  // Drag and drop state
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);

  useEffect(() => {
    // Load collections from localStorage or use mock data
    const stored = localStorage.getItem('editor_collections');
    if (stored) {
      try {
        setCollections(JSON.parse(stored));
      } catch (e) {
        console.error('Error parsing collections:', e);
        setCollections(MOCK_COLLECTIONS);
      }
    } else {
      setCollections(MOCK_COLLECTIONS);
    }
  }, []);

  const saveCollections = (updatedCollections: Collection[]) => {
    setCollections(updatedCollections);
    localStorage.setItem('editor_collections', JSON.stringify(updatedCollections));
  };

  const handleCreateCollection = () => {
    if (!formTitle.trim()) return;

    const newCollection: Collection = {
      id: `col${Date.now()}`,
      title: formTitle,
      description: formDescription,
      theme_color: formThemeColor,
      status: 'draft',
      piece_ids: [],
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    saveCollections([...collections, newCollection]);
    setFormTitle('');
    setFormDescription('');
    setFormThemeColor('#c4a46c');
    setShowCreateModal(false);
  };

  const handlePublishCollection = (collectionId: string) => {
    const updated = collections.map(col =>
      col.id === collectionId ? { ...col, status: 'published' as const, updated_at: new Date().toISOString() } : col
    );
    saveCollections(updated);
    if (selectedCollection?.id === collectionId) {
      setSelectedCollection({ ...selectedCollection, status: 'published' });
    }
  };

  const handleDeleteCollection = (collectionId: string) => {
    if (confirm('Are you sure you want to delete this collection?')) {
      saveCollections(collections.filter(col => col.id !== collectionId));
      if (selectedCollection?.id === collectionId) {
        setSelectedCollection(null);
        setView('list');
      }
    }
  };

  const handleAddPiecesToCollection = (pieceIds: string[]) => {
    if (!selectedCollection) return;
    
    const updated = collections.map(col =>
      col.id === selectedCollection.id
        ? { ...col, piece_ids: [...new Set([...col.piece_ids, ...pieceIds])], updated_at: new Date().toISOString() }
        : col
    );
    saveCollections(updated);
    
    const updatedSelected = updated.find(col => col.id === selectedCollection.id);
    if (updatedSelected) {
      setSelectedCollection(updatedSelected);
    }
    setShowAddPiecesModal(false);
  };

  const handleRemovePieceFromCollection = (pieceId: string) => {
    if (!selectedCollection) return;
    
    const updated = collections.map(col =>
      col.id === selectedCollection.id
        ? { ...col, piece_ids: col.piece_ids.filter(id => id !== pieceId), updated_at: new Date().toISOString() }
        : col
    );
    saveCollections(updated);
    
    const updatedSelected = updated.find(col => col.id === selectedCollection.id);
    if (updatedSelected) {
      setSelectedCollection(updatedSelected);
    }
  };

  const handleReorderPieces = (fromIndex: number, toIndex: number) => {
    if (!selectedCollection) return;
    
    const newPieceIds = [...selectedCollection.piece_ids];
    const [removed] = newPieceIds.splice(fromIndex, 1);
    newPieceIds.splice(toIndex, 0, removed);
    
    const updated = collections.map(col =>
      col.id === selectedCollection.id
        ? { ...col, piece_ids: newPieceIds, updated_at: new Date().toISOString() }
        : col
    );
    saveCollections(updated);
    
    setSelectedCollection({ ...selectedCollection, piece_ids: newPieceIds });
  };

  const handleDragStart = (index: number) => {
    setDraggedIndex(index);
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === index) return;
    
    handleReorderPieces(draggedIndex, index);
    setDraggedIndex(index);
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
  };

  const getWritingById = (id: string) => {
    return pickedWritings.find(w => w.id === id);
  };

  const getStatusBadge = (status: Collection['status']) => {
    const config = {
      draft: { color: '#8b9dc3', bg: 'rgba(139, 157, 195, 0.15)', label: 'Draft' },
      ready: { color: '#c4a46c', bg: 'rgba(196, 164, 108, 0.15)', label: 'Ready' },
      published: { color: '#7a9b76', bg: 'rgba(122, 155, 118, 0.15)', label: 'Published' },
    };
    const { color, bg, label } = config[status];
    return (
      <span
        className="px-3 py-1 rounded-full text-xs font-['Cormorant_Garamond'] uppercase tracking-wider"
        style={{ color, background: bg, border: `1px solid ${color}40` }}
      >
        {label}
      </span>
    );
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  // LIST VIEW
  if (view === 'list') {
    return (
      <div>
        <div className="mb-12 flex items-end justify-between">
          <div>
            <h1 className="font-['Playfair_Display'] italic text-[52px] text-[#c4a46c] mb-3" style={{ textShadow: '0 0 30px rgba(196, 164, 108, 0.3)', lineHeight: '1.2' }}>
              Collections
            </h1>
            <p className="font-['Cormorant_Garamond'] text-[19px] text-[#8b9dc3]/80" style={{ lineHeight: '1.7' }}>
              Curate thematic groupings of picked pieces for the Gallery
            </p>
          </div>
          <button
            onClick={() => setShowCreateModal(true)}
            className="px-8 py-4 bg-[rgba(196,164,108,0.2)] border border-[#c4a46c] hover:bg-[rgba(196,164,108,0.3)] hover:shadow-xl hover:shadow-[#c4a46c]/20 text-[#c4a46c] transition-all cursor-pointer font-['Cormorant_Garamond'] text-[15px] uppercase tracking-[0.15em] rounded-lg flex items-center gap-3"
          >
            <Plus className="w-5 h-5" />
            Create Collection
          </button>
        </div>

        {collections.length === 0 ? (
          <div className="text-center py-24">
            <div className="mb-8">
              <span className="text-7xl opacity-20">📚</span>
            </div>
            <p className="font-['Cormorant_Garamond'] text-[24px] text-[#8b9dc3] mb-3">
              No collections yet
            </p>
            <p className="font-['Cormorant_Garamond'] text-[17px] text-[#8b9dc3]/60 mb-10">
              Create your first collection to curate thematic groupings
            </p>
            <button
              onClick={() => setShowCreateModal(true)}
              className="px-10 py-4 bg-[rgba(196,164,108,0.2)] border border-[#c4a46c] hover:bg-[rgba(196,164,108,0.3)] hover:shadow-xl hover:shadow-[#c4a46c]/20 text-[#c4a46c] transition-all cursor-pointer font-['Cormorant_Garamond'] text-[15px] uppercase tracking-[0.15em] rounded-lg"
            >
              Create Collection
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {collections.map((collection) => (
              <div
                key={collection.id}
                className="bg-[rgba(15,21,37,0.7)] border border-[rgba(196,164,108,0.2)] rounded-xl p-6 hover:border-[#c4a46c] hover:shadow-2xl hover:shadow-[#c4a46c]/10 transition-all backdrop-blur-sm"
              >
                <div className="flex items-start justify-between mb-4">
                  <div
                    className="w-12 h-12 rounded-lg flex items-center justify-center"
                    style={{ backgroundColor: `${collection.theme_color}20`, border: `2px solid ${collection.theme_color}40` }}
                  >
                    <span className="text-2xl" style={{ color: collection.theme_color }}>📚</span>
                  </div>
                  {getStatusBadge(collection.status)}
                </div>

                <h3 className="font-['Playfair_Display'] italic text-[28px] text-[#e0e0e0] mb-3 leading-tight">
                  {collection.title}
                </h3>
                
                <p className="font-['Cormorant_Garamond'] text-[15px] text-[#8b9dc3] mb-4 line-clamp-2" style={{ lineHeight: '1.7' }}>
                  {collection.description}
                </p>

                <div className="flex items-center gap-4 mb-6 text-sm text-[#8b9dc3]/70 font-['Cormorant_Garamond']">
                  <span>{collection.piece_ids.length} {collection.piece_ids.length === 1 ? 'piece' : 'pieces'}</span>
                  <span>•</span>
                  <span>Created {formatDate(collection.created_at)}</span>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => {
                      setSelectedCollection(collection);
                      setView('detail');
                    }}
                    className="flex-1 px-4 py-2.5 border border-[rgba(196,164,108,0.3)] hover:border-[#c4a46c] hover:bg-[rgba(196,164,108,0.1)] text-[#c4a46c] transition-all cursor-pointer font-['Cormorant_Garamond'] text-[13px] uppercase tracking-[0.15em] rounded-lg"
                  >
                    Edit
                  </button>
                  {collection.status === 'draft' && (
                    <button
                      onClick={() => handlePublishCollection(collection.id)}
                      className="flex-1 px-4 py-2.5 bg-[rgba(122,155,118,0.2)] border border-[rgba(122,155,118,0.4)] hover:bg-[rgba(122,155,118,0.3)] text-[#7a9b76] transition-all cursor-pointer font-['Cormorant_Garamond'] text-[13px] uppercase tracking-[0.15em] rounded-lg"
                    >
                      Publish
                    </button>
                  )}
                  {collection.status === 'published' && (
                    <button
                      onClick={() => window.open('/collection-gallery', '_blank')}
                      className="flex-1 px-4 py-2.5 border border-[rgba(122,155,118,0.4)] hover:bg-[rgba(122,155,118,0.1)] text-[#7a9b76] transition-all cursor-pointer font-['Cormorant_Garamond'] text-[13px] uppercase tracking-[0.15em] rounded-lg flex items-center justify-center gap-2"
                    >
                      <Eye className="w-4 h-4" />
                      View
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Create Collection Modal */}
        {showCreateModal && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-8"
            onClick={() => setShowCreateModal(false)}
          >
            <div
              className="bg-[rgba(15,21,37,0.95)] border border-[rgba(196,164,108,0.4)] rounded-2xl p-10 max-w-2xl w-full shadow-2xl"
              onClick={(e) => e.stopPropagation()}
              style={{ backdropFilter: 'blur(20px)' }}
            >
              <div className="flex items-center justify-between mb-8">
                <h2 className="font-['Playfair_Display'] italic text-[36px] text-[#c4a46c]" style={{ textShadow: '0 0 20px rgba(196, 164, 108, 0.3)' }}>
                  Create Collection
                </h2>
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="w-10 h-10 flex items-center justify-center rounded-lg border border-[rgba(139,157,195,0.3)] hover:border-[#8b9dc3] hover:bg-[rgba(139,157,195,0.1)] text-[#8b9dc3] transition-all"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-6 mb-8">
                <div>
                  <label className="block font-['Cormorant_Garamond'] text-[13px] uppercase tracking-[0.15em] text-[#8b9dc3]/70 mb-2">
                    Collection Title *
                  </label>
                  <input
                    type="text"
                    value={formTitle}
                    onChange={(e) => setFormTitle(e.target.value)}
                    className="w-full bg-[rgba(15,21,37,0.7)] border border-[rgba(196,164,108,0.2)] rounded-lg px-4 py-3 text-[#e0e0e0] focus:border-[#c4a46c] focus:outline-none transition-colors font-['Cormorant_Garamond'] text-[16px]"
                    placeholder="e.g., Voices of the Season"
                  />
                </div>

                <div>
                  <label className="block font-['Cormorant_Garamond'] text-[13px] uppercase tracking-[0.15em] text-[#8b9dc3]/70 mb-2">
                    Description
                  </label>
                  <textarea
                    value={formDescription}
                    onChange={(e) => setFormDescription(e.target.value)}
                    rows={4}
                    className="w-full bg-[rgba(15,21,37,0.7)] border border-[rgba(196,164,108,0.2)] rounded-lg px-4 py-3 text-[#e0e0e0] focus:border-[#c4a46c] focus:outline-none transition-colors font-['Cormorant_Garamond'] text-[16px] resize-none"
                    placeholder="Describe the theme or focus of this collection..."
                  />
                </div>

                <div>
                  <label className="block font-['Cormorant_Garamond'] text-[13px] uppercase tracking-[0.15em] text-[#8b9dc3]/70 mb-3">
                    Theme Color
                  </label>
                  <div className="flex gap-3">
                    {['#c4a46c', '#8b9dc3', '#7a9b76', '#d4a574', '#a78bfa', '#f472b6'].map((color) => (
                      <button
                        key={color}
                        onClick={() => setFormThemeColor(color)}
                        className="w-12 h-12 rounded-lg transition-all cursor-pointer"
                        style={{
                          backgroundColor: color,
                          border: formThemeColor === color ? `3px solid ${color}` : '2px solid transparent',
                          opacity: formThemeColor === color ? 1 : 0.6,
                          transform: formThemeColor === color ? 'scale(1.1)' : 'scale(1)',
                        }}
                      />
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex gap-4">
                <button
                  onClick={handleCreateCollection}
                  disabled={!formTitle.trim()}
                  className="flex-1 px-8 py-4 bg-[rgba(196,164,108,0.2)] border border-[#c4a46c] hover:bg-[rgba(196,164,108,0.3)] hover:shadow-xl hover:shadow-[#c4a46c]/20 disabled:opacity-50 disabled:cursor-not-allowed text-[#c4a46c] transition-all cursor-pointer font-['Cormorant_Garamond'] text-[15px] uppercase tracking-[0.15em] rounded-lg"
                >
                  Create Collection
                </button>
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="px-8 py-4 border border-[rgba(139,157,195,0.3)] hover:border-[#8b9dc3] hover:bg-[rgba(139,157,195,0.1)] text-[#8b9dc3] transition-all cursor-pointer font-['Cormorant_Garamond'] text-[15px] uppercase tracking-[0.15em] rounded-lg"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // DETAIL VIEW
  if (view === 'detail' && selectedCollection) {
    const collectionPieces = selectedCollection.piece_ids
      .map(id => getWritingById(id))
      .filter(w => w !== undefined) as Writing[];

    return (
      <div>
        <div className="mb-8">
          <button
            onClick={() => {
              setSelectedCollection(null);
              setView('list');
            }}
            className="flex items-center gap-2 text-[#8b9dc3] hover:text-[#c4a46c] transition-colors mb-6 font-['Cormorant_Garamond'] text-[14px]"
          >
            <span>←</span>
            Back to Collections
          </button>

          <div className="flex items-start justify-between mb-6">
            <div className="flex items-start gap-4">
              <div
                className="w-16 h-16 rounded-lg flex items-center justify-center flex-shrink-0"
                style={{ backgroundColor: `${selectedCollection.theme_color}20`, border: `2px solid ${selectedCollection.theme_color}40` }}
              >
                <span className="text-3xl" style={{ color: selectedCollection.theme_color }}>📚</span>
              </div>
              <div>
                <h1 className="font-['Playfair_Display'] italic text-[42px] text-[#c4a46c] mb-2" style={{ textShadow: '0 0 30px rgba(196, 164, 108, 0.3)', lineHeight: '1.2' }}>
                  {selectedCollection.title}
                </h1>
                <p className="font-['Cormorant_Garamond'] text-[17px] text-[#8b9dc3]/80 mb-3" style={{ lineHeight: '1.7' }}>
                  {selectedCollection.description}
                </p>
                <div className="flex items-center gap-3">
                  {getStatusBadge(selectedCollection.status)}
                  <span className="text-[#8b9dc3]/70 font-['Cormorant_Garamond'] text-sm">
                    {collectionPieces.length} {collectionPieces.length === 1 ? 'piece' : 'pieces'}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              {selectedCollection.status === 'draft' && (
                <button
                  onClick={() => handlePublishCollection(selectedCollection.id)}
                  className="px-6 py-3 bg-[rgba(122,155,118,0.2)] border border-[rgba(122,155,118,0.4)] hover:bg-[rgba(122,155,118,0.3)] hover:shadow-xl text-[#7a9b76] transition-all cursor-pointer font-['Cormorant_Garamond'] text-[14px] uppercase tracking-[0.15em] rounded-lg"
                >
                  Publish Collection
                </button>
              )}
              <button
                onClick={() => handleDeleteCollection(selectedCollection.id)}
                className="px-6 py-3 border border-[rgba(220,38,38,0.4)] hover:bg-[rgba(220,38,38,0.1)] text-red-400 transition-all cursor-pointer font-['Cormorant_Garamond'] text-[14px] uppercase tracking-[0.15em] rounded-lg"
              >
                Delete
              </button>
            </div>
          </div>
        </div>

        <div className="mb-6">
          <button
            onClick={() => setShowAddPiecesModal(true)}
            className="px-6 py-3 bg-[rgba(196,164,108,0.2)] border border-[#c4a46c] hover:bg-[rgba(196,164,108,0.3)] hover:shadow-xl hover:shadow-[#c4a46c]/20 text-[#c4a46c] transition-all cursor-pointer font-['Cormorant_Garamond'] text-[14px] uppercase tracking-[0.15em] rounded-lg flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Add Pieces
          </button>
        </div>

        {collectionPieces.length === 0 ? (
          <div className="text-center py-20 border-2 border-dashed border-[rgba(196,164,108,0.2)] rounded-xl">
            <p className="font-['Cormorant_Garamond'] text-[20px] text-[#8b9dc3] mb-2">
              No pieces in this collection yet
            </p>
            <p className="font-['Cormorant_Garamond'] text-[15px] text-[#8b9dc3]/60 mb-6">
              Add pieces from your picked writings
            </p>
            <button
              onClick={() => setShowAddPiecesModal(true)}
              className="px-8 py-3 bg-[rgba(196,164,108,0.2)] border border-[#c4a46c] hover:bg-[rgba(196,164,108,0.3)] text-[#c4a46c] transition-all cursor-pointer font-['Cormorant_Garamond'] text-[14px] uppercase tracking-[0.15em] rounded-lg"
            >
              Add Pieces
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            <p className="font-['Cormorant_Garamond'] text-[14px] text-[#8b9dc3]/70 mb-4">
              Drag to reorder pieces in the collection
            </p>
            {collectionPieces.map((piece, index) => (
              <div
                key={piece.id}
                draggable
                onDragStart={() => handleDragStart(index)}
                onDragOver={(e) => handleDragOver(e, index)}
                onDragEnd={handleDragEnd}
                className="bg-[rgba(15,21,37,0.7)] border border-[rgba(196,164,108,0.2)] rounded-xl p-5 hover:border-[#c4a46c] transition-all backdrop-blur-sm flex items-center gap-4 cursor-move"
                style={{ opacity: draggedIndex === index ? 0.5 : 1 }}
              >
                <GripVertical className="w-5 h-5 text-[#8b9dc3]/50 flex-shrink-0" />
                
                <div className="flex-1">
                  <h3 className="font-['Playfair_Display'] italic text-[22px] text-[#e0e0e0] mb-1 leading-tight">
                    {piece.title}
                  </h3>
                  <p className="font-['Cormorant_Garamond'] text-[14px] text-[#8b9dc3]/70">
                    by {piece.profiles?.garden_name || piece.profiles?.full_name || 'Anonymous'}
                  </p>
                </div>

                <button
                  onClick={() => handleRemovePieceFromCollection(piece.id)}
                  className="p-2 rounded-lg border border-[rgba(220,38,38,0.3)] hover:bg-[rgba(220,38,38,0.1)] text-red-400 transition-all"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Add Pieces Modal */}
        {showAddPiecesModal && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-8"
            onClick={() => setShowAddPiecesModal(false)}
          >
            <div
              className="bg-[rgba(15,21,37,0.95)] border border-[rgba(196,164,108,0.4)] rounded-2xl p-10 max-w-4xl w-full max-h-[80vh] overflow-y-auto shadow-2xl"
              onClick={(e) => e.stopPropagation()}
              style={{ backdropFilter: 'blur(20px)' }}
            >
              <div className="flex items-center justify-between mb-8">
                <h2 className="font-['Playfair_Display'] italic text-[36px] text-[#c4a46c]" style={{ textShadow: '0 0 20px rgba(196, 164, 108, 0.3)' }}>
                  Add Pieces
                </h2>
                <button
                  onClick={() => setShowAddPiecesModal(false)}
                  className="w-10 h-10 flex items-center justify-center rounded-lg border border-[rgba(139,157,195,0.3)] hover:border-[#8b9dc3] hover:bg-[rgba(139,157,195,0.1)] text-[#8b9dc3] transition-all"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {pickedWritings.length === 0 ? (
                <div className="text-center py-12">
                  <p className="font-['Cormorant_Garamond'] text-[18px] text-[#8b9dc3] mb-2">
                    No picked pieces available
                  </p>
                  <p className="font-['Cormorant_Garamond'] text-[15px] text-[#8b9dc3]/60">
                    Pick pieces from the Wander tab first
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {pickedWritings
                    .filter(w => !selectedCollection.piece_ids.includes(w.id))
                    .map((piece) => (
                      <div
                        key={piece.id}
                        className="bg-[rgba(15,21,37,0.7)] border border-[rgba(196,164,108,0.2)] rounded-xl p-5 hover:border-[#c4a46c] transition-all backdrop-blur-sm"
                      >
                        <h3 className="font-['Playfair_Display'] italic text-[20px] text-[#e0e0e0] mb-2 leading-tight">
                          {piece.title}
                        </h3>
                        <p className="font-['Cormorant_Garamond'] text-[13px] text-[#8b9dc3]/70 mb-4">
                          by {piece.profiles?.garden_name || piece.profiles?.full_name || 'Anonymous'}
                        </p>
                        <button
                          onClick={() => handleAddPiecesToCollection([piece.id])}
                          className="w-full px-4 py-2 bg-[rgba(196,164,108,0.2)] border border-[#c4a46c] hover:bg-[rgba(196,164,108,0.3)] text-[#c4a46c] transition-all cursor-pointer font-['Cormorant_Garamond'] text-[13px] uppercase tracking-[0.15em] rounded-lg"
                        >
                          Add to Collection
                        </button>
                      </div>
                    ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    );
  }

  return null;
}
