import { getSupabaseClient } from '/src/utils/supabase/client';
import { Writing } from '/src/types/garden';

const supabase = getSupabaseClient();

// Get user's writings
export async function getUserWritings(userId: string): Promise<Writing[]> {
  try {
    const { data, error } = await supabase
      .from('writings')
      .select(`
        *,
        profile:profiles(*)
      `)
      .eq('user_id', userId)
      .order('updated_at', { ascending: false });

    if (error) {
      console.log('Database tables not yet available for user writings');
      return [];
    }

    return data || [];
  } catch (error) {
    console.log('Database not available, returning empty writings list');
    return [];
  }
}

// Get public blooms for explore page
export async function getPublicBlooms(limit = 50, offset = 0): Promise<Writing[]> {
  try {
    const currentUserId = (await supabase.auth.getUser()).data.user?.id;

    const { data, error } = await supabase
      .from('writings')
      .select(`
        *,
        profile:profiles(*),
        tends(count)
      `)
      .eq('visibility', 'public')
      .eq('growth_stage', 'bloom')
      .order('published_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) {
      console.log('Database tables not yet available, will use mock data');
      return [];
    }

    // Add has_tended flag for current user
    if (currentUserId && data) {
      const writingIds = data.map(w => w.id);
      const { data: userTends } = await supabase
        .from('tends')
        .select('writing_id')
        .eq('user_id', currentUserId)
        .in('writing_id', writingIds);

      const tendedIds = new Set(userTends?.map(t => t.writing_id) || []);

      return data.map(writing => ({
        ...writing,
        has_tended: tendedIds.has(writing.id)
      }));
    }

    return data || [];
  } catch (error) {
    // Silently fail and return empty array - ExplorePage will use mock data
    console.log('Database not available, using mock data in Explore page');
    return [];
  }
}

// Get a single writing
export async function getWriting(id: string): Promise<Writing | null> {
  const currentUserId = (await supabase.auth.getUser()).data.user?.id;

  const { data, error } = await supabase
    .from('writings')
    .select(`
      *,
      profile:profiles(*),
      tends(count)
    `)
    .eq('id', id)
    .single();

  if (error) {
    console.error('Error fetching writing:', error);
    return null;
  }

  // Check if current user has access
  if (data.visibility === 'private' && data.user_id !== currentUserId) {
    return null; // No access
  }

  // Add has_tended flag
  if (currentUserId) {
    const { data: tend } = await supabase
      .from('tends')
      .select('id')
      .eq('user_id', currentUserId)
      .eq('writing_id', id)
      .single();

    data.has_tended = !!tend;
  }

  return data;
}

// Create a new writing
export async function createWriting(writing: Omit<Writing, 'id' | 'created_at' | 'updated_at'>): Promise<Writing | null> {
  const { data, error } = await supabase
    .from('writings')
    .insert(writing)
    .select()
    .single();

  if (error) {
    console.error('Error creating writing:', error);
    return null;
  }

  return data;
}

// Update a writing
export async function updateWriting(id: string, updates: Partial<Writing>): Promise<Writing | null> {
  const { data, error } = await supabase
    .from('writings')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('Error updating writing:', error);
    return null;
  }

  // If growth_stage changed to bloom, set published_at
  if (updates.growth_stage === 'bloom' && !data.published_at) {
    await supabase
      .from('writings')
      .update({ published_at: new Date().toISOString() })
      .eq('id', id);
  }

  return data;
}

// Delete a writing
export async function deleteWriting(id: string): Promise<boolean> {
  const { error } = await supabase
    .from('writings')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error deleting writing:', error);
    return false;
  }

  return true;
}

// Toggle tend on a writing
export async function toggleTend(writingId: string): Promise<boolean> {
  const currentUserId = (await supabase.auth.getUser()).data.user?.id;
  if (!currentUserId) return false;

  // Check if already tended
  const { data: existing } = await supabase
    .from('tends')
    .select('id')
    .eq('user_id', currentUserId)
    .eq('writing_id', writingId)
    .single();

  if (existing) {
    // Remove tend
    const { error } = await supabase
      .from('tends')
      .delete()
      .eq('id', existing.id);
    
    return !error;
  } else {
    // Add tend
    const { error } = await supabase
      .from('tends')
      .insert({ user_id: currentUserId, writing_id: writingId });
    
    return !error;
  }
}

// Search writings by tags or content
export async function searchWritings(query: string): Promise<Writing[]> {
  const { data, error } = await supabase
    .from('writings')
    .select(`
      *,
      profile:profiles(*)
    `)
    .eq('visibility', 'public')
    .eq('growth_stage', 'bloom')
    .or(`title.ilike.%${query}%,content.ilike.%${query}%,tags.cs.{${query}}`)
    .limit(50);

  if (error) {
    console.error('Error searching writings:', error);
    return [];
  }

  return data || [];
}