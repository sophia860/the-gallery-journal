// Type definitions for The Garden platform

export interface Profile {
  id: string;
  email: string;
  display_name: string;
  writer_name?: string;
  bio?: string;
  avatar_url?: string;
  garden_theme?: string;
  created_at: string;
  updated_at: string;
}

export interface Writing {
  id: string;
  user_id: string;
  title: string;
  content: string;
  type: 'essay' | 'poem' | 'fragment' | 'marginalia';
  growth_stage: 'seed' | 'sprout' | 'bloom';
  visibility: 'private' | 'circles' | 'public';
  tags?: string[];
  position_x?: number;
  position_y?: number;
  created_at: string;
  updated_at: string;
  published_at?: string;
  author_username?: string;
  is_editor?: boolean;
  
  // Populated via joins
  profile?: Profile;
  tend_count?: number;
  has_tended?: boolean;
  work_type?: string;
  word_count?: number;
  character_count?: number;
}

export interface WritingLink {
  id: string;
  user_id: string;
  from_writing_id: string;
  to_writing_id: string;
  label?: string;
  created_at: string;
}

export interface Circle {
  id: string;
  creator_id: string;
  name: string;
  description?: string;
  member_limit: number;
  created_at: string;
  updated_at: string;
  
  // Populated via joins
  member_count?: number;
  is_member?: boolean;
  is_creator?: boolean;
  last_activity?: string;
  created_by?: string;
}

export interface CircleMember {
  id: string;
  circle_id: string;
  user_id: string;
  role: 'creator' | 'member';
  joined_at: string;
  
  // Populated via joins
  profile?: Profile;
}

export interface CircleInvite {
  id: string;
  circle_id: string;
  invited_by: string;
  invite_code: string;
  expires_at: string;
  max_uses: number;
  current_uses: number;
  created_at: string;
}

export interface Marginalia {
  id: string;
  writing_id: string;
  user_id: string;
  content: string;
  highlighted_text: string;
  position: number;
  created_at: string;
  
  // Populated via joins
  profile?: Profile;
}

export interface Bookmark {
  id: string;
  user_id: string;
  writing_id: string;
  notes?: string;
  created_at: string;
  
  // Populated via joins
  writing?: Writing;
}

export interface Tend {
  id: string;
  user_id: string;
  writing_id: string;
  created_at: string;
}

export interface Submission {
  id: string;
  user_id: string;
  writing_id: string;
  cover_letter?: string;
  status: 'submitted' | 'under_review' | 'accepted' | 'declined';
  reviewer_notes?: string;
  submitted_at: string;
  reviewed_at?: string;
  
  // Populated via joins
  writing?: Writing;
}

export interface ReadingQueueItem {
  id: string;
  user_id: string;
  writing_id: string;
  added_at: string;
  
  // Populated via joins
  writing?: Writing;
}

// Garden stats for profile display
export interface GardenStats {
  total_writings: number;
  seeds: number;
  sprouts: number;
  blooms: number;
  public_blooms: number;
  total_tends_received: number;
}