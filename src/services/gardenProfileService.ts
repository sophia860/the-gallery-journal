import { createClient } from '@supabase/supabase-js';
import { projectId, publicAnonKey } from '/utils/supabase/info';
import { Profile, GardenStats } from '/src/types/garden';

const supabase = createClient(
  `https://${projectId}.supabase.co`,
  publicAnonKey,
  {
    auth: {
      storageKey: 'sb-page-gallery-profile',
      storage: typeof window !== 'undefined' ? window.localStorage : undefined,
    },
  }
);

// Get profile by user ID
export async function getProfile(userId: string): Promise<Profile | null> {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();

  if (error) {
    console.error('Error fetching profile:', error);
    return null;
  }

  return data;
}

// Get profile by writer name (for garden URLs)
export async function getProfileByWriterName(writerName: string): Promise<Profile | null> {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('writer_name', writerName)
    .single();

  if (error) {
    console.error('Error fetching profile by writer name:', error);
    return null;
  }

  return data;
}

// Create or update profile
export async function upsertProfile(profile: Partial<Profile>): Promise<Profile | null> {
  const { data, error } = await supabase
    .from('profiles')
    .upsert(profile)
    .select()
    .single();

  if (error) {
    console.error('Error upserting profile:', error);
    return null;
  }

  return data;
}

// Get garden stats for a user
export async function getGardenStats(userId: string): Promise<GardenStats> {
  // Get total writings and breakdown by stage
  const { data: writings } = await supabase
    .from('writings')
    .select('growth_stage, visibility')
    .eq('user_id', userId);

  // Get total tends received
  const { data: tends } = await supabase
    .from('tends')
    .select('id', { count: 'exact' })
    .in('writing_id', writings?.map(w => w.id) || []);

  const total_writings = writings?.length || 0;
  const seeds = writings?.filter(w => w.growth_stage === 'seed').length || 0;
  const sprouts = writings?.filter(w => w.growth_stage === 'sprout').length || 0;
  const blooms = writings?.filter(w => w.growth_stage === 'bloom').length || 0;
  const public_blooms = writings?.filter(w => w.growth_stage === 'bloom' && w.visibility === 'public').length || 0;

  return {
    total_writings,
    seeds,
    sprouts,
    blooms,
    public_blooms,
    total_tends_received: tends?.length || 0
  };
}

// Search profiles
export async function searchProfiles(query: string): Promise<Profile[]> {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .or(`display_name.ilike.%${query}%,writer_name.ilike.%${query}%`)
    .limit(20);

  if (error) {
    console.error('Error searching profiles:', error);
    return [];
  }

  return data || [];
}