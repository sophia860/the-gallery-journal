import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import {
  getSubmissions,
  getDashboardStats,
  updateSubmissionStatus,
  addInternalNotes,
  rateSubmission,
  scheduleSubmission,
  requestRevisions,
  type Submission,
  type DashboardStats
} from '../../services/editorService';
import { 
  X, Star, Calendar, GripVertical, Search, ChevronDown,
  Clock, CheckCircle, XCircle, AlertCircle, Send, FileText,
  TrendingUp, TrendingDown, Minus, UserPlus, Copy
} from 'lucide-react';
import { InquiriesTab } from './InquiriesTab';

// Comprehensive demo submissions with realistic content
const demoSubmissions = [
  {
    id: '1',
    userId: 'user1',
    authorName: 'Maya Rodriguez',
    title: 'Fragments of Home',
    content: `I carry fragments of home\nin my pockets—\na worn coin, a pressed flower,\nmy grandmother's recipe written in Spanish.\n\nThese small relics map\nthe distance between\nwhere I'm from\nand where I am.\n\nSometimes I forget\nwhich language I'm thinking in,\nwhich kitchen I'm standing in,\nwhich version of myself\nI'm supposed to be.`,
    type: 'poetry',
    status: 'pending',
    submittedAt: '2026-02-07T10:30:00Z',
    rating: 0,
    internalNotes: '',
    history: [
      { action: 'Submitted', timestamp: '2026-02-07T10:30:00Z', user: 'Maya Rodriguez' }
    ]
  },
  {
    id: '2',
    userId: 'user2',
    authorName: 'James Chen',
    title: 'Winter Morning',
    content: `The city wakes slowly,\nfrost on windows like lace,\nbreath visible in the air.\n\nI watch from my kitchen,\ncoffee warming my hands,\nthe sun still deciding\nwhether to show up today.\n\nEverything suspended\nin this quiet blue hour—\nthe world holding its breath\nbefore the day begins.`,
    type: 'poetry',
    status: 'queued',
    submittedAt: '2026-01-28T14:20:00Z',
    scheduledDate: '2026-02-15',
    category: 'Nature & The Natural World',
    rating: 4,
    internalNotes: 'Beautiful imagery',
    history: [
      { action: 'Submitted', timestamp: '2026-01-28T14:20:00Z', user: 'James Chen' },
      { action: 'Added to Queue', timestamp: '2026-02-01T09:00:00Z', user: 'Editor' }
    ]
  },
  {
    id: '3',
    userId: 'user3',
    authorName: 'Sarah Williams',
    title: 'After the Funeral',
    content: `We sit in the living room,\ntalking about everything\nexcept the empty chair.\n\nSomeone makes coffee.\nSomeone tells a joke.\nWe laugh, then feel guilty\nfor laughing.\n\nThis is how grief works—\nin the pauses between words,\nin the ordinary tasks\nthat keep us moving forward.`,
    type: 'poetry',
    status: 'in_issue',
    submittedAt: '2026-01-25T09:15:00Z',
    category: 'Grief, Loss & Memory',
    wallNumber: '12',
    rating: 5,
    internalNotes: 'Powerful restraint. Perfect for the issue.',
    history: [
      { action: 'Submitted', timestamp: '2026-01-25T09:15:00Z', user: 'Sarah Williams' },
      { action: 'Rated 5 stars', timestamp: '2026-01-26T10:00:00Z', user: 'Editor' },
      { action: 'Added to Issue', timestamp: '2026-01-27T11:30:00Z', user: 'Editor' }
    ]
  },
  {
    id: '4',
    userId: 'user4',
    authorName: 'David Park',
    title: 'Love Letter at 3AM',
    content: `I'm writing this at 3am\nbecause I can't sleep\nwithout telling you:\n\nYou are the answer\nto questions I didn't know\nI was asking.\n\nYour laugh is the sound\nof home,\nand I've been homeless\nfor so long.`,
    type: 'poetry',
    status: 'published',
    submittedAt: '2026-01-20T16:45:00Z',
    publishedAt: '2026-01-25T10:00:00Z',
    category: 'Love & Relationships',
    wallNumber: '09',
    rating: 5,
    history: [
      { action: 'Submitted', timestamp: '2026-01-20T16:45:00Z', user: 'David Park' },
      { action: 'Accepted', timestamp: '2026-01-22T14:00:00Z', user: 'Editor' },
      { action: 'Published', timestamp: '2026-01-25T10:00:00Z', user: 'Editor' }
    ]
  },
  {
    id: '5',
    userId: 'user5',
    authorName: 'Emily Thompson',
    title: 'Urban Pastoral',
    content: `In the concrete garden\nof my apartment building,\none dandelion\npushes through a crack.\n\nI watch it for three days,\nthis small rebellion\nagainst everything we've paved over.`,
    type: 'poetry',
    status: 'revisions_requested',
    submittedAt: '2026-01-18T11:30:00Z',
    rating: 3,
    internalNotes: 'Strong concept but needs expansion',
    feedback: { 
      general: 'Beautiful opening image but feels incomplete. Could you expand on the significance? What does this dandelion represent to you personally?',
      lines: {
        6: 'This line is powerful - consider developing this rebellion metaphor further'
      }
    },
    history: [
      { action: 'Submitted', timestamp: '2026-01-18T11:30:00Z', user: 'Emily Thompson' },
      { action: 'Revisions Requested', timestamp: '2026-01-20T09:00:00Z', user: 'Editor' }
    ]
  },
  {
    id: '6',
    userId: 'user6',
    authorName: 'Michael Johnson',
    title: 'Suburbia Blues',
    content: `Same houses, same lawns,\nsame dreams repackaged\nin different shades of beige.\n\nWe mow our grass\non Saturday mornings,\nwave to neighbors\nwhose names we can't remember.`,
    type: 'poetry',
    status: 'rejected',
    submittedAt: '2026-01-15T13:20:00Z',
    rating: 2,
    internalNotes: 'Too familiar, lacks fresh perspective',
    history: [
      { action: 'Submitted', timestamp: '2026-01-15T13:20:00Z', user: 'Michael Johnson' },
      { action: 'Rejected', timestamp: '2026-01-17T16:00:00Z', user: 'Editor' }
    ]
  },
  {
    id: '7',
    userId: 'user7',
    authorName: 'Aisha Patel',
    title: 'Monsoon Memory',
    content: `My mother taught me\nto read the sky—\nthe particular gray\nthat means rain is coming.\n\nNow, an ocean away,\nI stand at my window\nwatching different clouds,\nremembering her hands\npointing at the horizon.\n\nThe rain here\nsounds nothing like home.`,
    type: 'poetry',
    status: 'pending',
    submittedAt: '2026-02-05T08:15:00Z',
    rating: 0,
    internalNotes: '',
    history: [
      { action: 'Submitted', timestamp: '2026-02-05T08:15:00Z', user: 'Aisha Patel' }
    ]
  },
  {
    id: '8',
    userId: 'user8',
    authorName: 'Thomas Wright',
    title: "Father's Watch",
    content: `He left me his watch,\nthe one that stopped\nthe day he died.\n\nI keep it in a drawer,\nrefusing to wind it,\nas if moving the hands forward\nwould somehow\nmove me forward too.\n\nTime doesn't heal.\nIt just accumulates.`,
    type: 'poetry',
    status: 'in_issue',
    submittedAt: '2026-01-22T15:30:00Z',
    category: 'Family & Identity',
    rating: 5,
    internalNotes: 'Devastating. Must include.',
    history: [
      { action: 'Submitted', timestamp: '2026-01-22T15:30:00Z', user: 'Thomas Wright' },
      { action: 'Rated 5 stars', timestamp: '2026-01-23T10:00:00Z', user: 'Editor' },
      { action: 'Added to Issue', timestamp: '2026-01-24T14:00:00Z', user: 'Editor' }
    ]
  },
  {
    id: '9',
    userId: 'user9',
    authorName: 'Luna Martinez',
    title: 'The Space Between',
    content: `There's a moment\nbetween sleeping and waking\nwhen I forget\neverything that's happened.\n\nFor those three seconds,\nI am neither here nor there,\nneither grieving nor healed,\njust existing\nin the soft gray\nof almost-consciousness.`,
    type: 'poetry',
    status: 'queued',
    submittedAt: '2026-01-30T12:00:00Z',
    scheduledDate: '2026-02-20',
    category: 'Time & Mortality',
    rating: 4,
    internalNotes: 'Ethereal quality',
    history: [
      { action: 'Submitted', timestamp: '2026-01-30T12:00:00Z', user: 'Luna Martinez' },
      { action: 'Added to Queue', timestamp: '2026-02-02T11:00:00Z', user: 'Editor' }
    ]
  },
  {
    id: '10',
    userId: 'user10',
    authorName: 'Robert Chen',
    title: 'Sunday Afternoon',
    content: `My son asks me\nwhy the sky is blue.\n\nI give him the scientific answer—\nRayleigh scattering,\nwavelengths of light,\natmospheric particles.\n\nHe looks at me,\ndisappointed,\nand says:\n"I thought you'd say\nbecause it's happy."`,
    type: 'poetry',
    status: 'pending',
    submittedAt: '2026-02-06T09:45:00Z',
    rating: 0,
    internalNotes: '',
    history: [
      { action: 'Submitted', timestamp: '2026-02-06T09:45:00Z', user: 'Robert Chen' }
    ]
  }
];

const categories = [
  'Love & Relationships',
  'Nature & The Natural World',
  'Grief, Loss & Memory',
  'Family & Identity',
  'Time & Mortality',
  'Self & Introspection',
];

const literaryQuotes = [
  "The first draft is just you telling yourself the story. - Terry Pratchett",
  "Words can be like X-rays if you use them properly. - Aldous Huxley",
  "There is nothing to writing. All you do is sit down and bleed. - Ernest Hemingway",
  "A writer is someone for whom writing is more difficult than it is for other people. - Thomas Mann",
  "The role of a writer is not to say what we can all say, but what we are unable to say. - Anaïs Nin"
];

type TabView = 'submissions' | 'queue' | 'issue' | 'activity' | 'inquiries';
type StatusFilter = 'all' | 'pending' | 'queued' | 'in_issue' | 'published' | 'revisions_requested' | 'rejected';
type SortBy = 'date' | 'title' | 'rating';

const statusStyles = {
  pending: 'bg-amber-500/10 text-amber-700 border-amber-500',
  queued: 'bg-purple-500/10 text-purple-700 border-purple-500',
  in_issue: 'bg-teal-500/10 text-teal-700 border-teal-500',
  published: 'bg-blue-500/10 text-blue-700 border-blue-500',
  revisions_requested: 'bg-orange-500/10 text-orange-700 border-orange-500',
  rejected: 'bg-red-500/10 text-red-700 border-red-500',
};

const statusTrends = {
  pending: 'up',
  queued: 'up',
  in_issue: 'up',
  published: 'down',
  rejected: 'same',
  total: 'up'
};

export function EditorDashboard() {
  const { user } = useAuth();
  const [currentTab, setCurrentTab] = useState<TabView>('submissions');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  const [sortBy, setSortBy] = useState<SortBy>('date');
  const [searchQuery, setSearchQuery] = useState('');
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedPoem, setExpandedPoem] = useState<string | null>(null);
  const [detailModal, setDetailModal] = useState<string | null>(null);
  const [publishModal, setPublishModal] = useState<string | null>(null);
  const [queueModal, setQueueModal] = useState<string | null>(null);
  const [rejectModal, setRejectModal] = useState<string | null>(null);
  const [revisionModal, setRevisionModal] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [wallNumber, setWallNumber] = useState('');
  const [scheduledDate, setScheduledDate] = useState('');
  const [rejectFeedback, setRejectFeedback] = useState('');
  const [revisionFeedback, setRevisionFeedback] = useState('');
  const [lineFeedback, setLineFeedback] = useState<Record<number, string>>({});
  const [issueTitle, setIssueTitle] = useState('Winter 2026 - Issue 02');
  const [issueSeason, setIssueSeason] = useState('Winter 2026');
  const [currentQuote] = useState(literaryQuotes[Math.floor(Math.random() * literaryQuotes.length)]);
  const [inviteModal, setInviteModal] = useState(false);
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState<'editor' | 'managing_editor'>('editor');
  const [generatedInviteLink, setGeneratedInviteLink] = useState('');
  const [copied, setCopied] = useState(false);

  // Load submissions on mount
  useEffect(() => {
    loadSubmissions();
  }, []);

  const loadSubmissions = async () => {
    try {
      setLoading(true);
      const data = await getSubmissions();
      setSubmissions(data);
    } catch (error) {
      console.error('Failed to load submissions:', error);
    } finally {
      setLoading(false);
    }
  };

  const stats = {
    total: submissions.length,
    pending: submissions.filter(s => s.status === 'pending').length,
    queued: submissions.filter(s => s.status === 'queued').length,
    in_issue: submissions.filter(s => s.status === 'in_issue').length,
    published: submissions.filter(s => s.status === 'published').length,
    rejected: submissions.filter(s => s.status === 'rejected').length,
  };

  const filteredSubmissions = submissions
    .filter(s => statusFilter === 'all' || s.status === statusFilter)
    .filter(s => 
      searchQuery === '' || 
      s.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.authorName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.content.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .sort((a, b) => {
      if (sortBy === 'date') return new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime();
      if (sortBy === 'title') return a.title.localeCompare(b.title);
      if (sortBy === 'rating') return (b.rating || 0) - (a.rating || 0);
      return 0;
    });

  const queuedSubmissions = submissions
    .filter(s => s.status === 'queued')
    .sort((a, b) => new Date(a.scheduledDate!).getTime() - new Date(b.scheduledDate!).getTime());

  const issueSubmissions = submissions.filter(s => s.status === 'in_issue');

  const activities = [
    { id: 'a1', action: 'Published "Love Letter at 3AM" by David Park', timestamp: '2026-01-25T10:00:00Z', type: 'publish' },
    { id: 'a2', action: 'Requested revisions for "Urban Pastoral" by Emily Thompson', timestamp: '2026-01-20T09:00:00Z', type: 'revise' },
    { id: 'a3', action: 'Added "After the Funeral" to Issue Builder', timestamp: '2026-01-27T11:30:00Z', type: 'issue' },
    { id: 'a4', action: 'Queued "Winter Morning" for Feb 15', timestamp: '2026-02-01T09:00:00Z', type: 'queue' },
    { id: 'a5', action: 'Rejected "Suburbia Blues" by Michael Johnson', timestamp: '2026-01-17T16:00:00Z', type: 'reject' },
    { id: 'a6', action: "Rated \"Father's Watch\" 5 stars", timestamp: '2026-01-23T10:00:00Z', type: 'rate' },
    { id: 'a7', action: 'Added "The Space Between" to Queue', timestamp: '2026-02-02T11:00:00Z', type: 'queue' },
    { id: 'a8', action: "Added \"Father's Watch\" to Issue Builder", timestamp: '2026-01-24T14:00:00Z', type: 'issue' },
  ];

  const handleRating = async (submissionId: string, rating: number) => {
    try {
      await rateSubmission(submissionId, rating);
      setSubmissions(prev => prev.map(s =>
        s.id === submissionId ? { ...s, rating } : s
      ));
    } catch (error) {
      console.error('Failed to rate submission:', error);
    }
  };

  const handleAcceptAndPublish = async (id: string) => {
    if (!selectedCategory || !wallNumber) return;
    try {
      await updateSubmissionStatus(id, 'published');
      setSubmissions(prev => prev.map(s =>
        s.id === id
          ? { 
              ...s, 
              status: 'published', 
              category: selectedCategory, 
              wallNumber, 
              publishedAt: new Date().toISOString(),
              history: [...s.history, { action: 'Published', timestamp: new Date().toISOString(), user: 'Editor' }]
            }
          : s
      ));
      setPublishModal(null);
      setSelectedCategory('');
      setWallNumber('');
    } catch (error) {
      console.error('Failed to publish submission:', error);
    }
  };

  const handleAddToQueue = async (id: string) => {
    if (!scheduledDate || !selectedCategory) return;
    try {
      await scheduleSubmission(id, scheduledDate);
      await updateSubmissionStatus(id, 'queued');
      setSubmissions(prev => prev.map(s =>
        s.id === id
          ? { 
              ...s, 
              status: 'queued', 
              scheduledDate, 
              category: selectedCategory,
              history: [...s.history, { action: 'Added to Queue', timestamp: new Date().toISOString(), user: 'Editor' }]
            }
          : s
      ));
      setQueueModal(null);
      setScheduledDate('');
      setSelectedCategory('');
    } catch (error) {
      console.error('Failed to add to queue:', error);
    }
  };

  const handleAddToIssue = async (id: string) => {
    try {
      await updateSubmissionStatus(id, 'in_issue');
      setSubmissions(prev => prev.map(s =>
        s.id === id 
          ? { 
              ...s, 
              status: 'in_issue',
              history: [...s.history, { action: 'Added to Issue', timestamp: new Date().toISOString(), user: 'Editor' }]
            } 
          : s
      ));
    } catch (error) {
      console.error('Failed to add to issue:', error);
    }
  };

  const handleGenerateInvite = () => {
    if (!inviteEmail) return;
    
    // Generate unique token
    const token = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    
    // Create invite object
    const invite = {
      token,
      email: inviteEmail,
      role: inviteRole,
      used: false,
      createdAt: new Date().toISOString()
    };
    
    // Store in localStorage
    const invites = JSON.parse(localStorage.getItem('editor_invites') || '[]');
    invites.push(invite);
    localStorage.setItem('editor_invites', JSON.stringify(invites));
    
    // Generate invite link
    const link = `${window.location.origin}/editors?invite=${token}`;
    setGeneratedInviteLink(link);
    
    // Reset form
    setInviteEmail('');
  };

  const handleCopyInviteLink = () => {
    // Fallback copy method that works in all contexts
    const textArea = document.createElement('textarea');
    textArea.value = generatedInviteLink;
    textArea.style.position = 'fixed';
    textArea.style.left = '-999999px';
    textArea.style.top = '-999999px';
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    
    try {
      document.execCommand('copy');
      textArea.remove();
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
      textArea.remove();
      // Try modern API as fallback
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(generatedInviteLink)
          .then(() => {
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
          })
          .catch(err => console.error('Clipboard API failed:', err));
      }
    }
  };

  const handleReject = (id: string) => {
    setSubmissions(prev => prev.map(s =>
      s.id === id 
        ? { 
            ...s, 
            status: 'rejected',
            history: [...s.history, { action: 'Rejected', timestamp: new Date().toISOString(), user: 'Editor' }]
          } 
        : s
    ));
    setRejectModal(null);
    setRejectFeedback('');
  };

  const handleRequestRevisions = (id: string) => {
    setSubmissions(prev => prev.map(s =>
      s.id === id
        ? {
            ...s,
            status: 'revisions_requested',
            feedback: { general: revisionFeedback, lines: lineFeedback },
            history: [...s.history, { action: 'Revisions Requested', timestamp: new Date().toISOString(), user: 'Editor' }]
          }
        : s
    ));
    setRevisionModal(null);
    setRevisionFeedback('');
    setLineFeedback({});
  };

  const handlePublishFromQueue = (id: string) => {
    setSubmissions(prev => prev.map(s =>
      s.id === id 
        ? { 
            ...s, 
            status: 'published', 
            publishedAt: new Date().toISOString(),
            history: [...s.history, { action: 'Published', timestamp: new Date().toISOString(), user: 'Editor' }]
          } 
        : s
    ));
  };

  const handleRemoveFromQueue = (id: string) => {
    setSubmissions(prev => prev.map(s =>
      s.id === id 
        ? { 
            ...s, 
            status: 'pending', 
            scheduledDate: undefined,
            history: [...s.history, { action: 'Removed from Queue', timestamp: new Date().toISOString(), user: 'Editor' }]
          } 
        : s
    ));
  };

  const handleRemoveFromIssue = (id: string) => {
    setSubmissions(prev => prev.map(s =>
      s.id === id 
        ? { 
            ...s, 
            status: 'pending',
            history: [...s.history, { action: 'Removed from Issue', timestamp: new Date().toISOString(), user: 'Editor' }]
          } 
        : s
    ));
  };

  const TrendIndicator = ({ trend }: { trend: string }) => {
    if (trend === 'up') return <TrendingUp className="w-4 h-4 text-green-600" />;
    if (trend === 'down') return <TrendingDown className="w-4 h-4 text-red-600" />;
    return <Minus className="w-4 h-4 text-gray-400" />;
  };

  const currentDate = new Date().toLocaleDateString('en-US', { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });

  return (
    <div className="min-h-screen bg-[#FAF8F5]">
      {/* Top Navigation */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-white border-b-2 border-[#0D0D0D] shadow-sm">
        <div className="px-8 py-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="font-['Lora'] text-3xl text-[#0D0D0D] mb-1">
                Welcome back, <span className="italic">Editor</span>
              </h1>
              <p className="text-[#717171] font-['Inter'] text-sm">
                Manage submissions, curate issues, and publish to the gallery.
              </p>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-sm text-[#0D0D0D] font-['Inter'] mb-1">{currentDate}</p>
                <a href="/" className="text-sm text-[#C41E3A] hover:text-[#A01030] transition-colors font-['Inter']">
                  Exit to Gallery →
                </a>
              </div>
              <button
                onClick={() => setInviteModal(true)}
                className="inline-flex items-center gap-2 px-4 py-2 bg-[#8A9A7B] text-white hover:bg-[#7A8A6B] transition-all font-['Inter'] text-sm font-medium rounded-lg"
              >
                <UserPlus className="w-4 h-4" />
                Invite Editor
              </button>
            </div>
          </div>

          {/* Literary Quote */}
          <div className="py-3 px-4 bg-[#C41E3A]/5 border-l-4 border-[#C41E3A]">
            <p className="text-sm font-['Lora'] italic text-[#0D0D0D]">
              "{currentQuote}"
            </p>
          </div>

          {/* Tab Navigation */}
          <div className="flex gap-8 border-t border-[#E8E0D8] pt-4 mt-4">
            {(['submissions', 'queue', 'issue', 'activity', 'inquiries'] as TabView[]).map(tab => (
              <button
                key={tab}
                onClick={() => setCurrentTab(tab)}
                className={`pb-2 px-1 text-sm uppercase tracking-[0.15em] font-['Inter'] font-semibold transition-all ${
                  currentTab === tab
                    ? 'border-b-2 border-[#C41E3A] text-[#C41E3A]'
                    : 'text-[#717171] hover:text-[#0D0D0D]'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="pt-64 px-8 pb-16">
        <div className="max-w-7xl mx-auto">
          {/* Stats Dashboard */}
          {currentTab === 'submissions' && (
            <>
              <div className="mb-12">
                <h2 className="font-['Lora'] text-2xl text-[#0D0D0D] mb-6">
                  Dashboard Overview
                </h2>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                  {Object.entries(stats).map(([key, value]) => (
                    <div 
                      key={key} 
                      className="bg-white border border-[#E8E0D8] p-6 hover:shadow-lg hover:-translate-y-1 transition-all cursor-pointer"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="text-xs uppercase tracking-[0.12em] text-[#717171] font-['Inter']">
                          {key.replace('_', ' ')}
                        </div>
                        <TrendIndicator trend={statusTrends[key as keyof typeof statusTrends]} />
                      </div>
                      <div className="text-4xl font-bold text-[#C41E3A] font-['Inter']">
                        {value}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Search and Controls */}
              <div className="mb-8 space-y-4">
                <div className="flex gap-4">
                  <div className="flex-1 relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#717171]" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search title, author, content..."
                      className="w-full pl-12 pr-4 py-3 border-2 border-[#E8E0D8] focus:border-[#C41E3A] focus:outline-none font-['Inter'] text-[#0D0D0D] placeholder:text-[#717171]"
                    />
                  </div>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as SortBy)}
                    className="px-4 py-3 border-2 border-[#E8E0D8] bg-white text-[#0D0D0D] font-['Inter'] focus:border-[#C41E3A] focus:outline-none"
                  >
                    <option value="date">Sort by Date</option>
                    <option value="title">Sort by Title</option>
                    <option value="rating">Sort by Rating</option>
                  </select>
                </div>

                {/* Filter Buttons */}
                <div className="flex flex-wrap gap-3">
                  {(['all', 'pending', 'queued', 'in_issue', 'published', 'revisions_requested', 'rejected'] as StatusFilter[]).map(filter => {
                    const count = filter === 'all' ? submissions.length : submissions.filter(s => s.status === filter).length;
                    return (
                      <button
                        key={filter}
                        onClick={() => setStatusFilter(filter)}
                        className={`px-4 py-2 text-sm uppercase tracking-[0.08em] font-['Inter'] font-medium transition-all ${
                          statusFilter === filter
                            ? 'bg-[#0D0D0D] text-white shadow-md'
                            : 'bg-white text-[#0D0D0D] border border-[#E8E0D8] hover:border-[#C41E3A]'
                        }`}
                      >
                        {filter.replace('_', ' ')} ({count})
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Submission Cards */}
              <div className="space-y-4">
                {filteredSubmissions.map(submission => (
                  <div
                    key={submission.id}
                    className="bg-white border border-[#E8E0D8] p-6 hover:shadow-lg hover:-translate-y-0.5 transition-all"
                  >
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex-1">
                        <h3 className="font-['Lora'] text-2xl text-[#0D0D0D] mb-2">
                          {submission.title}
                        </h3>
                        <div className="flex items-center gap-4 text-sm text-[#717171] font-['Inter']">
                          <span>by {submission.authorName}</span>
                          <span>•</span>
                          <span>{new Date(submission.submittedAt).toLocaleDateString()}</span>
                          {submission.scheduledDate && (
                            <>
                              <span>•</span>
                              <span className="text-purple-600 font-medium">
                                Scheduled: {new Date(submission.scheduledDate).toLocaleDateString()}
                              </span>
                            </>
                          )}
                          {submission.category && submission.status === 'in_issue' && (
                            <>
                              <span>•</span>
                              <span className="text-teal-600 font-medium">
                                {submission.category}
                              </span>
                            </>
                          )}
                        </div>
                      </div>
                      <span className={`px-3 py-1 text-xs uppercase tracking-wider border ${statusStyles[submission.status as keyof typeof statusStyles]} rounded-full font-['Inter'] font-semibold`}>
                        {submission.status.replace('_', ' ')}
                      </span>
                    </div>

                    {/* Star Rating */}
                    <div className="flex items-center gap-2 mb-4">
                      {[1, 2, 3, 4, 5].map(rating => (
                        <button
                          key={rating}
                          onClick={() => handleRating(submission.id, rating)}
                          className="hover:scale-110 transition-transform"
                        >
                          <Star
                            className={`w-5 h-5 ${
                              rating <= (submission.rating || 0)
                                ? 'fill-[#C41E3A] text-[#C41E3A]'
                                : 'text-[#E8E0D8]'
                            }`}
                          />
                        </button>
                      ))}
                    </div>

                    {/* Poem Preview */}
                    <div className="mb-4">
                      <div className={`font-['Lora'] text-base leading-relaxed whitespace-pre-wrap text-[#0D0D0D] ${
                        expandedPoem === submission.id ? '' : 'line-clamp-3'
                      }`}>
                        {submission.content}
                      </div>
                      <button
                        onClick={() => setExpandedPoem(expandedPoem === submission.id ? null : submission.id)}
                        className="text-sm text-[#C41E3A] hover:underline mt-2 font-['Inter']"
                      >
                        {expandedPoem === submission.id ? 'Show less' : 'Read full poem'}
                      </button>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-wrap gap-3">
                      {submission.status === 'pending' && (
                        <>
                          <button
                            onClick={() => setPublishModal(submission.id)}
                            className="px-4 py-2 bg-[#C41E3A] text-white text-xs uppercase tracking-[0.12em] hover:bg-[#A01030] transition-colors font-['Inter'] font-semibold"
                          >
                            Accept & Publish
                          </button>
                          <button
                            onClick={() => setQueueModal(submission.id)}
                            className="px-4 py-2 bg-purple-600 text-white text-xs uppercase tracking-[0.12em] hover:bg-purple-700 transition-colors font-['Inter'] font-semibold"
                          >
                            Add to Queue
                          </button>
                          <button
                            onClick={() => handleAddToIssue(submission.id)}
                            className="px-4 py-2 bg-teal-600 text-white text-xs uppercase tracking-[0.12em] hover:bg-teal-700 transition-colors font-['Inter'] font-semibold"
                          >
                            Add to Issue
                          </button>
                          <button
                            onClick={() => setRevisionModal(submission.id)}
                            className="px-4 py-2 bg-orange-600 text-white text-xs uppercase tracking-[0.12em] hover:bg-orange-700 transition-colors font-['Inter'] font-semibold"
                          >
                            Request Revisions
                          </button>
                          <button
                            onClick={() => setRejectModal(submission.id)}
                            className="px-4 py-2 bg-red-600 text-white text-xs uppercase tracking-[0.12em] hover:bg-red-700 transition-colors font-['Inter'] font-semibold"
                          >
                            Reject
                          </button>
                        </>
                      )}
                      {submission.status === 'queued' && (
                        <>
                          <button
                            onClick={() => handlePublishFromQueue(submission.id)}
                            className="px-4 py-2 bg-[#C41E3A] text-white text-xs uppercase tracking-[0.12em] hover:bg-[#A01030] transition-colors font-['Inter'] font-semibold"
                          >
                            Publish Now
                          </button>
                          <button
                            onClick={() => handleRemoveFromQueue(submission.id)}
                            className="px-4 py-2 bg-white border-2 border-[#E8E0D8] text-[#0D0D0D] text-xs uppercase tracking-[0.12em] hover:border-[#C41E3A] transition-colors font-['Inter'] font-semibold"
                          >
                            Remove from Queue
                          </button>
                        </>
                      )}
                      {submission.status === 'in_issue' && (
                        <>
                          <button
                            onClick={() => handlePublishFromQueue(submission.id)}
                            className="px-4 py-2 bg-[#C41E3A] text-white text-xs uppercase tracking-[0.12em] hover:bg-[#A01030] transition-colors font-['Inter'] font-semibold"
                          >
                            Publish Now
                          </button>
                          <button
                            onClick={() => handleRemoveFromIssue(submission.id)}
                            className="px-4 py-2 bg-white border-2 border-[#E8E0D8] text-[#0D0D0D] text-xs uppercase tracking-[0.12em] hover:border-[#C41E3A] transition-colors font-['Inter'] font-semibold"
                          >
                            Remove from Issue
                          </button>
                        </>
                      )}
                      <button
                        onClick={() => setDetailModal(submission.id)}
                        className="px-4 py-2 bg-[#0D0D0D] text-white text-xs uppercase tracking-[0.12em] hover:bg-[#2C2C2C] transition-colors font-['Inter'] font-semibold"
                      >
                        View Details
                      </button>
                    </div>
                  </div>
                ))}

                {filteredSubmissions.length === 0 && (
                  <div className="text-center py-16">
                    <FileText className="w-16 h-16 mx-auto mb-4 text-[#E8E0D8]" />
                    <p className="text-[#717171] font-['Inter']">
                      No submissions found matching your criteria.
                    </p>
                  </div>
                )}
              </div>
            </>
          )}

          {/* Queue View */}
          {currentTab === 'queue' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-['Lora'] text-3xl text-[#0D0D0D]">Publishing Queue</h2>
                <span className="text-sm text-[#717171] font-['Inter']">
                  {queuedSubmissions.length} items scheduled
                </span>
              </div>

              {queuedSubmissions.length === 0 ? (
                <div className="text-center py-16 bg-white border border-[#E8E0D8]">
                  <Calendar className="w-16 h-16 mx-auto mb-4 text-[#E8E0D8]" />
                  <p className="text-[#717171] font-['Inter']">No submissions in queue</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {queuedSubmissions.map(submission => (
                    <div key={submission.id} className="bg-white border border-[#E8E0D8] p-6 hover:shadow-lg transition-shadow">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <h3 className="font-['Lora'] text-xl text-[#0D0D0D] mb-2">{submission.title}</h3>
                          <div className="text-sm text-[#717171] font-['Inter'] space-y-1">
                            <p>by {submission.authorName}</p>
                            <p>Category: <span className="text-[#0D0D0D] font-medium">{submission.category}</span></p>
                            <p className="text-purple-600 font-semibold flex items-center gap-2">
                              <Calendar className="w-4 h-4" />
                              Scheduled: {new Date(submission.scheduledDate!).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => handlePublishFromQueue(submission.id)}
                            className="px-4 py-2 bg-[#C41E3A] text-white text-xs uppercase tracking-[0.12em] hover:bg-[#A01030] transition-colors font-['Inter'] font-semibold"
                          >
                            Publish Now
                          </button>
                          <button
                            onClick={() => handleRemoveFromQueue(submission.id)}
                            className="px-4 py-2 bg-white border-2 border-[#E8E0D8] text-[#0D0D0D] text-xs uppercase tracking-[0.12em] hover:border-[#C41E3A] transition-colors font-['Inter'] font-semibold"
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Issue Builder View */}
          {currentTab === 'issue' && (
            <div className="space-y-6">
              <h2 className="font-['Lora'] text-3xl text-[#0D0D0D] mb-6">Assemble New Issue</h2>

              <div className="bg-white border border-[#E8E0D8] p-6 space-y-4">
                <div>
                  <label className="block text-xs uppercase tracking-[0.12em] text-[#717171] mb-2 font-['Inter'] font-semibold">
                    Issue Title
                  </label>
                  <input
                    type="text"
                    value={issueTitle}
                    onChange={(e) => setIssueTitle(e.target.value)}
                    className="w-full px-4 py-3 bg-[#FAF8F5] border-2 border-[#E8E0D8] focus:border-[#C41E3A] focus:outline-none font-['Lora'] text-[#0D0D0D]"
                  />
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-[0.12em] text-[#717171] mb-2 font-['Inter'] font-semibold">
                    Season / Theme
                  </label>
                  <select
                    value={issueSeason}
                    onChange={(e) => setIssueSeason(e.target.value)}
                    className="w-full px-4 py-3 bg-[#FAF8F5] border-2 border-[#E8E0D8] focus:border-[#C41E3A] focus:outline-none font-['Inter'] text-[#0D0D0D]"
                  >
                    <option>Winter 2026</option>
                    <option>Spring 2026</option>
                    <option>Summer 2026</option>
                    <option>Fall 2026</option>
                  </select>
                </div>
              </div>

              <div className="space-y-3">
                <h3 className="font-['Inter'] text-sm uppercase tracking-[0.12em] text-[#717171] font-semibold">
                  Pieces in Issue ({issueSubmissions.length})
                </h3>
                {issueSubmissions.length === 0 ? (
                  <div className="text-center py-16 bg-white border border-[#E8E0D8]">
                    <FileText className="w-16 h-16 mx-auto mb-4 text-[#E8E0D8]" />
                    <p className="text-[#717171] font-['Inter']">No pieces added yet</p>
                  </div>
                ) : (
                  issueSubmissions.map((submission) => (
                    <div key={submission.id} className="bg-white border border-[#E8E0D8] p-4 flex items-center gap-4 hover:shadow-md transition-shadow">
                      <GripVertical className="w-5 h-5 text-[#717171]" />
                      <div className="flex-1">
                        <p className="font-['Lora'] text-[#0D0D0D] text-lg">{submission.title}</p>
                        <p className="text-sm text-[#717171] font-['Inter']">by {submission.authorName}</p>
                      </div>
                      <select
                        value={submission.category || ''}
                        onChange={(e) => {
                          setSubmissions(prev => prev.map(s =>
                            s.id === submission.id ? { ...s, category: e.target.value } : s
                          ));
                        }}
                        className="px-3 py-2 border-2 border-[#E8E0D8] bg-white text-[#0D0D0D] text-sm font-['Inter'] focus:border-[#C41E3A] focus:outline-none"
                      >
                        <option value="">Select category</option>
                        {categories.map(cat => (
                          <option key={cat} value={cat}>{cat}</option>
                        ))}
                      </select>
                    </div>
                  ))
                )}
              </div>

              {issueSubmissions.length > 0 && (
                <button className="w-full py-4 bg-[#C41E3A] text-white text-sm uppercase tracking-[0.15em] hover:bg-[#A01030] transition-colors font-['Inter'] font-semibold shadow-lg hover:shadow-xl">
                  Publish Issue to Gallery
                </button>
              )}
            </div>
          )}

          {/* Activity Feed */}
          {currentTab === 'activity' && (
            <div className="space-y-6">
              <h2 className="font-['Lora'] text-3xl text-[#0D0D0D] mb-6">Recent Activity</h2>
              <div className="space-y-3">
                {activities.map(activity => (
                  <div key={activity.id} className="bg-white border border-[#E8E0D8] p-4 flex items-start gap-4 hover:shadow-md transition-shadow">
                    <div className="mt-1">
                      {activity.type === 'publish' && <CheckCircle className="w-5 h-5 text-blue-600" />}
                      {activity.type === 'reject' && <XCircle className="w-5 h-5 text-red-600" />}
                      {activity.type === 'revise' && <Send className="w-5 h-5 text-orange-600" />}
                      {activity.type === 'queue' && <Clock className="w-5 h-5 text-purple-600" />}
                      {activity.type === 'issue' && <FileText className="w-5 h-5 text-teal-600" />}
                      {activity.type === 'rate' && <Star className="w-5 h-5 text-amber-600" />}
                    </div>
                    <div className="flex-1">
                      <p className="font-['Inter'] text-[#0D0D0D]">{activity.action}</p>
                      <p className="text-sm text-[#717171] font-['Inter']">
                        {new Date(activity.timestamp).toLocaleString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Inquiries View */}
          {currentTab === 'inquiries' && (
            <InquiriesTab />
          )}
        </div>
      </div>

      {/* MODALS */}

      {/* Detail Modal */}
      {detailModal && (() => {
        const submission = submissions.find(s => s.id === detailModal);
        if (!submission) return null;

        return (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-8 animate-in fade-in duration-300">
            <div className="bg-white max-w-4xl w-full max-h-[90vh] overflow-y-auto relative shadow-2xl animate-in slide-in-from-bottom duration-300">
              <button
                onClick={() => setDetailModal(null)}
                className="absolute top-6 right-6 p-2 hover:bg-[#E8E0D8] transition-colors z-10"
              >
                <X className="w-6 h-6" />
              </button>

              <div className="p-12">
                <h3 className="font-['Lora'] text-4xl text-[#0D0D0D] mb-3">{submission.title}</h3>
                <p className="text-[#717171] font-['Inter'] mb-8">by {submission.authorName}</p>

                <div className="font-['Lora'] text-lg leading-loose whitespace-pre-wrap text-[#0D0D0D] mb-8 p-6 bg-[#FAF8F5] border border-[#E8E0D8]">
                  {submission.content}
                </div>

                {/* Rating */}
                <div className="mb-6">
                  <label className="block text-xs uppercase tracking-[0.12em] text-[#717171] mb-2 font-['Inter'] font-semibold">
                    Rating
                  </label>
                  <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map(rating => (
                      <button
                        key={rating}
                        onClick={() => handleRating(submission.id, rating)}
                        className="p-2 hover:scale-110 transition-transform"
                      >
                        <Star
                          className={`w-7 h-7 ${
                            rating <= (submission.rating || 0)
                              ? 'fill-[#C41E3A] text-[#C41E3A]'
                              : 'text-[#E8E0D8]'
                          }`}
                        />
                      </button>
                    ))}
                  </div>
                </div>

                {/* Internal Notes */}
                <div className="mb-6">
                  <label className="block text-xs uppercase tracking-[0.12em] text-[#717171] mb-2 font-['Inter'] font-semibold">
                    Internal Notes
                  </label>
                  <textarea
                    value={submission.internalNotes || ''}
                    onChange={(e) => {
                      setSubmissions(prev => prev.map(s =>
                        s.id === submission.id ? { ...s, internalNotes: e.target.value } : s
                      ));
                    }}
                    rows={4}
                    className="w-full px-4 py-3 bg-[#FAF8F5] border-2 border-[#E8E0D8] focus:border-[#C41E3A] focus:outline-none font-['Inter'] text-[#0D0D0D]"
                    placeholder="Add private notes about this submission..."
                  />
                </div>

                {/* History Timeline */}
                <div className="mb-8">
                  <label className="block text-xs uppercase tracking-[0.12em] text-[#717171] mb-3 font-['Inter'] font-semibold">
                    History
                  </label>
                  <div className="space-y-2">
                    {submission.history.map((entry, idx) => (
                      <div key={idx} className="flex items-center gap-3 text-sm">
                        <Clock className="w-4 h-4 text-[#C41E3A]" />
                        <span className="font-['Inter'] text-[#0D0D0D]">{entry.action}</span>
                        <span className="text-[#717171] font-['Inter']">
                          {new Date(entry.timestamp).toLocaleString()}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-wrap gap-3 border-t border-[#E8E0D8] pt-6">
                  {submission.status === 'pending' && (
                    <>
                      <button
                        onClick={() => {
                          setDetailModal(null);
                          setPublishModal(submission.id);
                        }}
                        className="px-6 py-3 bg-[#C41E3A] text-white text-xs uppercase tracking-[0.12em] hover:bg-[#A01030] transition-colors font-['Inter'] font-semibold"
                      >
                        Accept & Publish
                      </button>
                      <button
                        onClick={() => {
                          setDetailModal(null);
                          setQueueModal(submission.id);
                        }}
                        className="px-6 py-3 bg-purple-600 text-white text-xs uppercase tracking-[0.12em] hover:bg-purple-700 transition-colors font-['Inter'] font-semibold"
                      >
                        Add to Queue
                      </button>
                      <button
                        onClick={() => {
                          handleAddToIssue(submission.id);
                          setDetailModal(null);
                        }}
                        className="px-6 py-3 bg-teal-600 text-white text-xs uppercase tracking-[0.12em] hover:bg-teal-700 transition-colors font-['Inter'] font-semibold"
                      >
                        Add to Issue
                      </button>
                      <button
                        onClick={() => {
                          setDetailModal(null);
                          setRejectModal(submission.id);
                        }}
                        className="px-6 py-3 bg-red-600 text-white text-xs uppercase tracking-[0.12em] hover:bg-red-700 transition-colors font-['Inter'] font-semibold"
                      >
                        Reject
                      </button>
                      <button
                        onClick={() => {
                          setDetailModal(null);
                          setRevisionModal(submission.id);
                        }}
                        className="px-6 py-3 bg-orange-600 text-white text-xs uppercase tracking-[0.12em] hover:bg-orange-700 transition-colors font-['Inter'] font-semibold"
                      >
                        Request Revisions
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        );
      })()}

      {/* Publish Modal */}
      {publishModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-8 animate-in fade-in duration-300">
          <div className="bg-white max-w-md w-full p-8 relative shadow-2xl animate-in slide-in-from-bottom duration-300">
            <button
              onClick={() => setPublishModal(null)}
              className="absolute top-4 right-4 p-2 hover:bg-[#E8E0D8] transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="font-['Lora'] text-2xl text-[#0D0D0D] mb-6">Publish to Gallery</h3>

            <div className="space-y-4">
              <div>
                <label className="block text-xs uppercase tracking-[0.12em] text-[#717171] mb-2 font-['Inter'] font-semibold">
                  Category
                </label>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full px-4 py-3 bg-[#FAF8F5] border-2 border-[#E8E0D8] focus:border-[#C41E3A] focus:outline-none font-['Inter'] text-[#0D0D0D]"
                >
                  <option value="">Select category</option>
                  {categories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs uppercase tracking-[0.12em] text-[#717171] mb-2 font-['Inter'] font-semibold">
                  Wall Number (Optional)
                </label>
                <input
                  type="text"
                  value={wallNumber}
                  onChange={(e) => setWallNumber(e.target.value)}
                  placeholder="e.g., 14"
                  className="w-full px-4 py-3 bg-[#FAF8F5] border-2 border-[#E8E0D8] focus:border-[#C41E3A] focus:outline-none font-['Inter'] text-[#0D0D0D]"
                />
              </div>

              <button
                onClick={() => handleAcceptAndPublish(publishModal)}
                disabled={!selectedCategory || !wallNumber}
                className="w-full py-3 bg-[#C41E3A] text-white text-sm uppercase tracking-[0.15em] hover:bg-[#A01030] transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-['Inter'] font-semibold"
              >
                Publish Now
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Queue Modal */}
      {queueModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-8 animate-in fade-in duration-300">
          <div className="bg-white max-w-md w-full p-8 relative shadow-2xl animate-in slide-in-from-bottom duration-300">
            <button
              onClick={() => setQueueModal(null)}
              className="absolute top-4 right-4 p-2 hover:bg-[#E8E0D8] transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="font-['Lora'] text-2xl text-[#0D0D0D] mb-6">Add to Queue</h3>

            <div className="space-y-4">
              <div>
                <label className="block text-xs uppercase tracking-[0.12em] text-[#717171] mb-2 font-['Inter'] font-semibold">
                  Category
                </label>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full px-4 py-3 bg-[#FAF8F5] border-2 border-[#E8E0D8] focus:border-[#C41E3A] focus:outline-none font-['Inter'] text-[#0D0D0D]"
                >
                  <option value="">Select category</option>
                  {categories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs uppercase tracking-[0.12em] text-[#717171] mb-2 font-['Inter'] font-semibold">
                  Scheduled Date
                </label>
                <input
                  type="date"
                  value={scheduledDate}
                  onChange={(e) => setScheduledDate(e.target.value)}
                  className="w-full px-4 py-3 bg-[#FAF8F5] border-2 border-[#E8E0D8] focus:border-[#C41E3A] focus:outline-none font-['Inter'] text-[#0D0D0D]"
                />
              </div>

              <button
                onClick={() => handleAddToQueue(queueModal)}
                disabled={!selectedCategory || !scheduledDate}
                className="w-full py-3 bg-purple-600 text-white text-sm uppercase tracking-[0.15em] hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-['Inter'] font-semibold"
              >
                Add to Queue
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Reject Modal */}
      {rejectModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-8 animate-in fade-in duration-300">
          <div className="bg-white max-w-md w-full p-8 relative shadow-2xl animate-in slide-in-from-bottom duration-300">
            <button
              onClick={() => setRejectModal(null)}
              className="absolute top-4 right-4 p-2 hover:bg-[#E8E0D8] transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="font-['Lora'] text-2xl text-[#0D0D0D] mb-6">Reject Submission</h3>

            <div className="space-y-4">
              <div>
                <label className="block text-xs uppercase tracking-[0.12em] text-[#717171] mb-2 font-['Inter'] font-semibold">
                  Feedback (Optional)
                </label>
                <textarea
                  value={rejectFeedback}
                  onChange={(e) => setRejectFeedback(e.target.value)}
                  rows={6}
                  className="w-full px-4 py-3 bg-[#FAF8F5] border-2 border-[#E8E0D8] focus:border-[#C41E3A] focus:outline-none font-['Inter'] text-[#0D0D0D]"
                  placeholder="Provide feedback to the writer..."
                />
              </div>

              <button
                onClick={() => handleReject(rejectModal)}
                className="w-full py-3 bg-red-600 text-white text-sm uppercase tracking-[0.15em] hover:bg-red-700 transition-colors font-['Inter'] font-semibold"
              >
                Confirm Rejection
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Revision Modal */}
      {revisionModal && (() => {
        const submission = submissions.find(s => s.id === revisionModal);
        if (!submission) return null;

        const lines = submission.content.split('\n');

        return (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-8 animate-in fade-in duration-300">
            <div className="bg-white max-w-4xl w-full max-h-[90vh] overflow-y-auto p-8 relative shadow-2xl animate-in slide-in-from-bottom duration-300">
              <button
                onClick={() => setRevisionModal(null)}
                className="absolute top-4 right-4 p-2 hover:bg-[#E8E0D8] transition-colors z-10"
              >
                <X className="w-5 h-5" />
              </button>

              <h3 className="font-['Lora'] text-2xl text-[#0D0D0D] mb-2">Request Revisions</h3>
              <p className="text-sm text-[#717171] font-['Inter'] mb-6">
                Click any line to add specific feedback. Lines with feedback will be highlighted.
              </p>

              <div className="mb-6 p-6 bg-[#FAF8F5] space-y-1 border border-[#E8E0D8]">
                {lines.map((line, index) => (
                  <div key={index} className="group">
                    <div className="flex gap-4 items-start hover:bg-white transition-colors p-2">
                      <span className="text-[#717171] text-sm font-mono w-8 flex-shrink-0 text-right">
                        {index + 1}
                      </span>
                      <div className={`flex-1 border-l-2 pl-4 ${
                        lineFeedback[index] ? 'border-red-500' : 'border-transparent group-hover:border-[#C41E3A]/20'
                      }`}>
                        <p className="font-['Lora'] text-[#0D0D0D]">{line || '\u00A0'}</p>
                        {lineFeedback[index] && (
                          <div className="mt-2 p-3 bg-red-50 border border-red-200 text-sm text-[#0D0D0D] font-['Inter']">
                            {lineFeedback[index]}
                          </div>
                        )}
                      </div>
                      <button
                        onClick={() => {
                          const feedback = prompt('Add feedback for this line:');
                          if (feedback) {
                            setLineFeedback({ ...lineFeedback, [index]: feedback });
                          }
                        }}
                        className="opacity-0 group-hover:opacity-100 px-3 py-1 text-xs bg-[#C41E3A] text-white hover:bg-[#A01030] transition-all font-['Inter']"
                      >
                        Add
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mb-6">
                <label className="block text-xs uppercase tracking-[0.12em] text-[#717171] mb-2 font-['Inter'] font-semibold">
                  General Feedback
                </label>
                <textarea
                  value={revisionFeedback}
                  onChange={(e) => setRevisionFeedback(e.target.value)}
                  rows={6}
                  className="w-full px-4 py-3 bg-[#FAF8F5] border-2 border-[#E8E0D8] focus:border-[#C41E3A] focus:outline-none font-['Inter'] text-[#0D0D0D]"
                  placeholder="Provide overall feedback for the writer..."
                />
              </div>

              <button
                onClick={() => handleRequestRevisions(revisionModal)}
                className="w-full py-3 bg-orange-600 text-white text-sm uppercase tracking-[0.15em] hover:bg-orange-700 transition-colors font-['Inter'] font-semibold"
              >
                Send Revision Request
              </button>
            </div>
          </div>
        );
      })()}

      {/* Invite Editor Modal */}
      {inviteModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-8 animate-in fade-in duration-300">
          <div className="bg-white max-w-lg w-full p-8 relative shadow-2xl animate-in slide-in-from-bottom duration-300 rounded-2xl">
            <button
              onClick={() => {
                setInviteModal(false);
                setGeneratedInviteLink('');
                setCopied(false);
              }}
              className="absolute top-4 right-4 p-2 hover:bg-[#E8E0D8] transition-colors rounded-lg"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-xl bg-[#8A9A7B]/10 flex items-center justify-center">
                <UserPlus className="w-6 h-6 text-[#8A9A7B]" />
              </div>
              <div>
                <h3 className="font-['Cardo'] text-2xl text-[#2C1810]">Invite Editor</h3>
                <p className="text-sm text-[#8B7355] font-['Inter']">Grant access to The Gallery editorial system</p>
              </div>
            </div>

            {!generatedInviteLink ? (
              <div className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-[#2C1810] mb-2 font-['Inter']">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={inviteEmail}
                    onChange={(e) => setInviteEmail(e.target.value)}
                    placeholder="editor@example.com"
                    className="w-full px-4 py-3 border-2 border-[#E0D8D0] rounded-xl focus:border-[#8A9A7B] focus:outline-none font-['Inter'] text-sm"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#2C1810] mb-2 font-['Inter']">
                    Role
                  </label>
                  <select
                    value={inviteRole}
                    onChange={(e) => setInviteRole(e.target.value as 'editor' | 'managing_editor')}
                    className="w-full px-4 py-3 border-2 border-[#E0D8D0] rounded-xl focus:border-[#8A9A7B] focus:outline-none font-['Inter'] text-sm"
                  >
                    <option value="editor">Editor</option>
                    <option value="managing_editor">Managing Editor</option>
                  </select>
                </div>

                <div className="pt-2">
                  <button
                    onClick={handleGenerateInvite}
                    disabled={!inviteEmail}
                    className="w-full px-6 py-3 bg-[#2C1810] text-white hover:bg-[#1A1A1A] transition-all font-['Cardo'] text-lg tracking-wide disabled:opacity-50 disabled:cursor-not-allowed rounded-xl"
                  >
                    Generate Invite Link
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="p-4 bg-[#8A9A7B]/10 border-2 border-[#8A9A7B]/20 rounded-xl">
                  <p className="text-sm text-[#2C1810] font-['Inter'] mb-2 font-medium">
                    Invite link generated!
                  </p>
                  <p className="text-xs text-[#8B7355] font-['Inter']">
                    Share this link with the new editor. It can only be used once.
                  </p>
                </div>

                <div className="relative">
                  <input
                    type="text"
                    value={generatedInviteLink}
                    readOnly
                    className="w-full px-4 py-3 pr-24 border-2 border-[#E0D8D0] rounded-xl bg-[#F5F0EB] font-['Courier_New'] text-xs text-[#2C1810]"
                  />
                  <button
                    onClick={handleCopyInviteLink}
                    className="absolute right-2 top-1/2 -translate-y-1/2 px-4 py-2 bg-[#2C1810] text-white hover:bg-[#1A1A1A] transition-all font-['Inter'] text-xs font-medium rounded-lg inline-flex items-center gap-2"
                  >
                    {copied ? (
                      <>
                        <CheckCircle className="w-3.5 h-3.5" />
                        Copied!
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        Copy
                      </>
                    )}
                  </button>
                </div>

                <button
                  onClick={() => {
                    setGeneratedInviteLink('');
                    setInviteEmail('');
                    setCopied(false);
                  }}
                  className="w-full px-4 py-2 border-2 border-[#E0D8D0] text-[#2C1810] hover:bg-[#F5F0EB] transition-all font-['Inter'] text-sm rounded-xl"
                >
                  Generate Another Invite
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
