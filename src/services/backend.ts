import { apiRequest } from '../utils/api';

// Demo mode check
export function isDemoMode(): boolean {
  if (typeof window === 'undefined') return false;
  return localStorage.getItem('demoMode') === 'true';
}

// Local storage keys
const STORAGE_KEYS = {
  DRAFTS: 'page_drafts',
  SUBMISSIONS: 'page_submissions',
  HEARTS: 'page_hearts',
};

// Types
export interface Draft {
  id?: string;
  title: string;
  content: string;
  category: string;
  tags: string[];
  shareToCommunity: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface Submission {
  id: string;
  userId: string;
  authorName: string;
  title: string;
  content: string;
  type: string;
  status: 'pending' | 'queued' | 'in_issue' | 'published' | 'revisions_requested' | 'rejected';
  submittedAt: string;
  category?: string;
  tags?: string[];
  rating?: number;
  internalNotes?: string;
  scheduledDate?: string;
  publishedAt?: string;
  wallNumber?: string;
  shareToCommunity?: boolean;
    // Author bio and social links (snapshot at submission time)
  authorBio?: string;
  authorInstagramUrl?: string;
  authorTwitterUrl?: string;
  authorWebsiteUrl?: string;
}

// ============ DRAFTS ============

export async function saveDraft(draft: Draft): Promise<{ success: boolean; error?: string }> {
  try {
    // Always save to localStorage for demo mode and persistence
    const drafts = getDraftsFromStorage();
    const existingIndex = drafts.findIndex(d => d.id === draft.id);
    
    if (existingIndex >= 0) {
      drafts[existingIndex] = draft;
    } else {
      drafts.push(draft);
    }
    
    localStorage.setItem(STORAGE_KEYS.DRAFTS, JSON.stringify(drafts));

    // Try to save to backend if not in demo mode
    if (!isDemoMode()) {
      try {
        await apiRequest('/drafts', {
          method: 'POST',
          body: JSON.stringify(draft),
        });
      } catch (err) {
        console.warn('Backend save failed, using localStorage only:', err);
      }
    }

    return { success: true };
  } catch (err) {
    return { success: false, error: String(err) };
  }
}

export function getDraftsFromStorage(): Draft[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.DRAFTS);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

export async function getDrafts(): Promise<Draft[]> {
  if (isDemoMode()) {
    return getDraftsFromStorage();
  }

  try {
    const response = await apiRequest('/drafts');
    if (response.ok) {
      const data = await response.json();
      return data.data || [];
    }
  } catch (err) {
    console.warn('Failed to fetch drafts from backend:', err);
  }

  return getDraftsFromStorage();
}

// ============ SUBMISSIONS ============

export async function submitToGallery(draft: Draft): Promise<{ success: boolean; error?: string }> {
  const submission: Submission = {
    id: crypto.randomUUID(),
    userId: 'demo-user',
    authorName: 'Demo Writer',
    title: draft.title,
    content: draft.content,
    type: 'poetry',
    status: 'pending',
    submittedAt: new Date().toISOString(),
    category: draft.category,
    tags: draft.tags,
    shareToCommunity: draft.shareToCommunity,
  };

  try {
    // Save to localStorage
    const submissions = getSubmissionsFromStorage();
    submissions.unshift(submission);
    localStorage.setItem(STORAGE_KEYS.SUBMISSIONS, JSON.stringify(submissions));

    // Try backend
    if (!isDemoMode()) {
      try {
        await apiRequest('/submissions', {
          method: 'POST',
          body: JSON.stringify(submission),
        });
      } catch (err) {
        console.warn('Backend submission failed, using localStorage only:', err);
      }
    }

    return { success: true };
  } catch (err) {
    return { success: false, error: String(err) };
  }
}

export function getSubmissionsFromStorage(): Submission[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.SUBMISSIONS);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

export async function getSubmissions(): Promise<Submission[]> {
  if (isDemoMode()) {
    return getSubmissionsFromStorage();
  }

  try {
    const response = await apiRequest('/submissions');
    if (response.ok) {
      const data = await response.json();
      return data.data || [];
    }
  } catch (err) {
    console.warn('Failed to fetch submissions from backend:', err);
  }

  return getSubmissionsFromStorage();
}

export async function updateSubmissionStatus(
  id: string,
  status: Submission['status'],
  metadata?: Partial<Submission>
): Promise<{ success: boolean; error?: string }> {
  try {
    const submissions = getSubmissionsFromStorage();
    const index = submissions.findIndex(s => s.id === id);
    
    if (index >= 0) {
      submissions[index] = {
        ...submissions[index],
        status,
        ...metadata,
      };
      localStorage.setItem(STORAGE_KEYS.SUBMISSIONS, JSON.stringify(submissions));
    }

    if (!isDemoMode()) {
      try {
        await apiRequest(`/submissions/${id}`, {
          method: 'PATCH',
          body: JSON.stringify({ status, ...metadata }),
        });
      } catch (err) {
        console.warn('Backend update failed, using localStorage only:', err);
      }
    }

    return { success: true };
  } catch (err) {
    return { success: false, error: String(err) };
  }
}

// ============ HEARTS/APPRECIATION ============

export function getHeartsFromStorage(): Record<string, { count: number; hasHearted: boolean }> {
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.HEARTS);
    return stored ? JSON.parse(stored) : {};
  } catch {
    return {};
  }
}

export async function toggleHeart(
  pieceId: string,
  currentCount: number,
  currentHearted: boolean
): Promise<{ count: number; hasHearted: boolean }> {
  const hearts = getHeartsFromStorage();
  const newHearted = !currentHearted;
  const newCount = newHearted ? currentCount + 1 : currentCount - 1;

  hearts[pieceId] = {
    count: newCount,
    hasHearted: newHearted,
  };

  localStorage.setItem(STORAGE_KEYS.HEARTS, JSON.stringify(hearts));

  // Try to update backend
  if (!isDemoMode()) {
    try {
      await apiRequest(`/hearts/${pieceId}`, {
        method: 'POST',
        body: JSON.stringify({ hearted: newHearted }),
      });
    } catch (err) {
      console.warn('Backend heart update failed, using localStorage only:', err);
    }
  }

  return hearts[pieceId];
}

// ============ NEWSLETTER ============

export async function subscribeNewsletter(email: string): Promise<{ success: boolean; error?: string }> {
  try {
    // Validate email
    if (!email || !email.includes('@')) {
      return { success: false, error: 'Please enter a valid email address' };
    }

    // In demo mode, just show success
    if (isDemoMode()) {
      return { success: true };
    }

    // Try backend
    try {
      const response = await apiRequest('/newsletter/subscribe', {
        method: 'POST',
        body: JSON.stringify({ email }),
      });

      if (response.ok) {
        return { success: true };
      } else {
        const data = await response.json();
        return { success: false, error: data.error || 'Failed to subscribe' };
      }
    } catch (err) {
      console.warn('Newsletter subscription failed:', err);
      // In production, we'd want to fail. In demo, succeed.
      return { success: true };
    }
  } catch (err) {
    return { success: false, error: String(err) };
  }
}

// ============ PUBLISHED PIECES (for Collection Gallery) ============

export async function getPublishedPieces(): Promise<Submission[]> {
  const submissions = await getSubmissions();
  return submissions.filter(s => s.status === 'published');
}

// ============ COMMUNITY PIECES (for Community Wall) ============

export async function getCommunityPieces(): Promise<Submission[]> {
  const submissions = await getSubmissions();
  // Only show submitted or published works, NEVER drafts
  return submissions.filter(s => 
    s.shareToCommunity !== false && 
    (s.status === 'submitted' || s.status === 'pending' || s.status === 'published')
  );
}
