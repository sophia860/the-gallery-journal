import { projectId, publicAnonKey } from '/utils/supabase/info';

const API_BASE = `https://${projectId}.supabase.co/functions/v1/make-server-07dc516a`;

// Check if we're in demo mode
const isDemoMode = () => {
  return localStorage.getItem('demo_mode') === 'true';
};

// Demo mode: Initialize demo data
const initializeDemoData = () => {
  if (!localStorage.getItem('editor_submissions')) {
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
    
    localStorage.setItem('editor_submissions', JSON.stringify(demoSubmissions));
  }
};

// Demo mode helper functions
const getDemoSubmissions = () => {
  initializeDemoData();
  const data = localStorage.getItem('editor_submissions');
  return data ? JSON.parse(data) : [];
};

const saveDemoSubmissions = (submissions: any[]) => {
  localStorage.setItem('editor_submissions', JSON.stringify(submissions));
};

const addDemoHistory = (submissionId: string, action: string, user: string = 'Editor') => {
  const submissions = getDemoSubmissions();
  const submission = submissions.find((s: any) => s.id === submissionId);
  if (submission) {
    submission.history = submission.history || [];
    submission.history.push({
      action,
      timestamp: new Date().toISOString(),
      user
    });
    saveDemoSubmissions(submissions);
  }
};

// Get access token from auth context or localStorage
const getAccessToken = () => {
  // In demo mode, use a demo token
  if (isDemoMode()) {
    return 'demo-editor-token';
  }
  // Otherwise, get from localStorage (set by AuthContext)
  return localStorage.getItem('editor_access_token') || publicAnonKey;
};

export interface Submission {
  id: string;
  userId: string;
  authorName: string;
  title: string;
  content: string;
  type: string;
  status: 'pending' | 'queued' | 'in_issue' | 'published' | 'revisions_requested' | 'rejected';
  submittedAt: string;
  publishedAt?: string;
  scheduledDate?: string;
  category?: string;
  wallNumber?: string;
  rating: number;
  internalNotes: string;
  feedback?: {
    general?: string;
    lines?: Record<number, string>;
  };
  history: Array<{
    action: string;
    timestamp: string;
    user: string;
  }>;
  assignedTo?: string;
}

export interface DashboardStats {
  totalSubmissions: number;
  pendingCount: number;
  queuedCount: number;
  publishedCount: number;
  inIssueCount: number;
  revisionsCount: number;
}

// Get all submissions
export const getSubmissions = async (): Promise<Submission[]> => {
  if (isDemoMode()) {
    return getDemoSubmissions();
  }

  try {
    const response = await fetch(`${API_BASE}/editor/submissions`, {
      headers: {
        'Authorization': `Bearer ${getAccessToken()}`
      }
    });

    if (!response.ok) {
      throw new Error('Failed to fetch submissions');
    }

    const data = await response.json();
    return data.submissions || [];
  } catch (error) {
    console.error('Error fetching submissions:', error);
    throw error;
  }
};

// Get single submission
export const getSubmission = async (id: string): Promise<Submission | null> => {
  if (isDemoMode()) {
    const submissions = getDemoSubmissions();
    return submissions.find((s: any) => s.id === id) || null;
  }

  try {
    const response = await fetch(`${API_BASE}/editor/submissions/${id}`, {
      headers: {
        'Authorization': `Bearer ${getAccessToken()}`
      }
    });

    if (!response.ok) {
      throw new Error('Failed to fetch submission');
    }

    const data = await response.json();
    return data.submission || null;
  } catch (error) {
    console.error('Error fetching submission:', error);
    throw error;
  }
};

// Update submission status
export const updateSubmissionStatus = async (
  id: string,
  status: Submission['status'],
  notes?: string
): Promise<void> => {
  if (isDemoMode()) {
    const submissions = getDemoSubmissions();
    const submission = submissions.find((s: any) => s.id === id);
    if (submission) {
      submission.status = status;
      if (notes !== undefined) {
        submission.internalNotes = notes;
      }
      addDemoHistory(id, `Status changed to ${status}`);
      saveDemoSubmissions(submissions);
    }
    return;
  }

  try {
    const response = await fetch(`${API_BASE}/editor/submissions/${id}/status`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${getAccessToken()}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ status, notes })
    });

    if (!response.ok) {
      throw new Error('Failed to update status');
    }
  } catch (error) {
    console.error('Error updating status:', error);
    throw error;
  }
};

// Add internal notes
export const addInternalNotes = async (id: string, notes: string): Promise<void> => {
  if (isDemoMode()) {
    const submissions = getDemoSubmissions();
    const submission = submissions.find((s: any) => s.id === id);
    if (submission) {
      submission.internalNotes = notes;
      addDemoHistory(id, 'Internal notes updated');
      saveDemoSubmissions(submissions);
    }
    return;
  }

  try {
    const response = await fetch(`${API_BASE}/editor/submissions/${id}/notes`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${getAccessToken()}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ notes })
    });

    if (!response.ok) {
      throw new Error('Failed to update notes');
    }
  } catch (error) {
    console.error('Error updating notes:', error);
    throw error;
  }
};

// Rate submission
export const rateSubmission = async (id: string, rating: number): Promise<void> => {
  if (isDemoMode()) {
    const submissions = getDemoSubmissions();
    const submission = submissions.find((s: any) => s.id === id);
    if (submission) {
      submission.rating = rating;
      addDemoHistory(id, `Rated ${rating} stars`);
      saveDemoSubmissions(submissions);
    }
    return;
  }

  try {
    const response = await fetch(`${API_BASE}/editor/submissions/${id}/rating`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${getAccessToken()}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ rating })
    });

    if (!response.ok) {
      throw new Error('Failed to update rating');
    }
  } catch (error) {
    console.error('Error updating rating:', error);
    throw error;
  }
};

// Schedule submission
export const scheduleSubmission = async (id: string, date: string): Promise<void> => {
  if (isDemoMode()) {
    const submissions = getDemoSubmissions();
    const submission = submissions.find((s: any) => s.id === id);
    if (submission) {
      submission.scheduledDate = date;
      addDemoHistory(id, `Scheduled for ${date}`);
      saveDemoSubmissions(submissions);
    }
    return;
  }

  try {
    const response = await fetch(`${API_BASE}/editor/submissions/${id}/schedule`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${getAccessToken()}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ scheduledDate: date })
    });

    if (!response.ok) {
      throw new Error('Failed to schedule submission');
    }
  } catch (error) {
    console.error('Error scheduling submission:', error);
    throw error;
  }
};

// Request revisions
export const requestRevisions = async (
  id: string,
  feedback: { general?: string; lines?: Record<number, string> }
): Promise<void> => {
  if (isDemoMode()) {
    const submissions = getDemoSubmissions();
    const submission = submissions.find((s: any) => s.id === id);
    if (submission) {
      submission.status = 'revisions_requested';
      submission.feedback = feedback;
      addDemoHistory(id, 'Revisions requested');
      saveDemoSubmissions(submissions);
    }
    return;
  }

  try {
    const response = await fetch(`${API_BASE}/editor/submissions/${id}/revisions`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${getAccessToken()}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ feedback })
    });

    if (!response.ok) {
      throw new Error('Failed to request revisions');
    }
  } catch (error) {
    console.error('Error requesting revisions:', error);
    throw error;
  }
};

// Get submission history
export const getSubmissionHistory = async (id: string): Promise<any[]> => {
  if (isDemoMode()) {
    const submissions = getDemoSubmissions();
    const submission = submissions.find((s: any) => s.id === id);
    return submission?.history || [];
  }

  try {
    const response = await fetch(`${API_BASE}/editor/submissions/${id}/history`, {
      headers: {
        'Authorization': `Bearer ${getAccessToken()}`
      }
    });

    if (!response.ok) {
      throw new Error('Failed to fetch history');
    }

    const data = await response.json();
    return data.history || [];
  } catch (error) {
    console.error('Error fetching history:', error);
    throw error;
  }
};

// Assign editor
export const assignEditor = async (submissionId: string, editorId: string): Promise<void> => {
  if (isDemoMode()) {
    const submissions = getDemoSubmissions();
    const submission = submissions.find((s: any) => s.id === submissionId);
    if (submission) {
      submission.assignedTo = editorId;
      addDemoHistory(submissionId, `Assigned to editor ${editorId}`);
      saveDemoSubmissions(submissions);
    }
    return;
  }

  try {
    const response = await fetch(`${API_BASE}/editor/submissions/${submissionId}/assign`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${getAccessToken()}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ editorId })
    });

    if (!response.ok) {
      throw new Error('Failed to assign editor');
    }
  } catch (error) {
    console.error('Error assigning editor:', error);
    throw error;
  }
};

// Get dashboard statistics
export const getDashboardStats = async (): Promise<DashboardStats> => {
  if (isDemoMode()) {
    const submissions = getDemoSubmissions();
    return {
      totalSubmissions: submissions.length,
      pendingCount: submissions.filter((s: any) => s.status === 'pending').length,
      queuedCount: submissions.filter((s: any) => s.status === 'queued').length,
      publishedCount: submissions.filter((s: any) => s.status === 'published').length,
      inIssueCount: submissions.filter((s: any) => s.status === 'in_issue').length,
      revisionsCount: submissions.filter((s: any) => s.status === 'revisions_requested').length
    };
  }

  try {
    const response = await fetch(`${API_BASE}/editor/stats`, {
      headers: {
        'Authorization': `Bearer ${getAccessToken()}`
      }
    });

    if (!response.ok) {
      throw new Error('Failed to fetch stats');
    }

    const data = await response.json();
    return data.stats;
  } catch (error) {
    console.error('Error fetching stats:', error);
    throw error;
  }
};

// Enable demo mode
export const enableDemoMode = () => {
  localStorage.setItem('demo_mode', 'true');
  initializeDemoData();
};

// Disable demo mode
export const disableDemoMode = () => {
  localStorage.removeItem('demo_mode');
};
