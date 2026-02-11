import { getSupabaseClient } from '/src/utils/supabase/client';
import { Circle, CircleMember, CircleInvite } from '/src/types/garden';

const supabase = getSupabaseClient();

// Get user's circles
export async function getUserCircles(userId: string): Promise<Circle[]> {
  try {
    const { data, error } = await supabase
      .from('circle_members')
      .select(`
        circle_id,
        circles (
          *,
          circle_members (count)
        )
      `)
      .eq('user_id', userId);

    if (error) {
      console.log('Circle tables not available, using mock data');
      throw error;
    }

    return data?.map(item => ({
      ...item.circles,
      member_count: item.circles.circle_members?.[0]?.count || 0,
      is_member: true
    })) || [];
  } catch (error) {
    // Silently fail and let the component use mock data
    return [];
  }
}

// Get circle by ID
export async function getCircle(circleId: string): Promise<Circle | null> {
  try {
    const currentUserId = (await supabase.auth.getUser()).data.user?.id;

    const { data, error } = await supabase
      .from('circles')
      .select(`
        *,
        circle_members (count)
      `)
      .eq('id', circleId)
      .single();

    if (error) {
      console.log('Circle tables not available');
      throw error;
    }

    // Check if user is a member
    if (currentUserId) {
      const { data: membership } = await supabase
        .from('circle_members')
        .select('id')
        .eq('circle_id', circleId)
        .eq('user_id', currentUserId)
        .single();

      data.is_member = !!membership;
    }

    return {
      ...data,
      member_count: data.circle_members?.[0]?.count || 0
    };
  } catch (error) {
    return null;
  }
}

// Create a circle
export async function createCircle(circle: { name: string; description?: string; member_limit?: number }): Promise<Circle | null> {
  try {
    const currentUserId = (await supabase.auth.getUser()).data.user?.id;
    if (!currentUserId) return null;

    const { data, error } = await supabase
      .from('circles')
      .insert({
        ...circle,
        creator_id: currentUserId
      })
      .select()
      .single();

    if (error) {
      console.log('Cannot create circle - tables not available');
      throw error;
    }

    // Add creator as member
    await supabase
      .from('circle_members')
      .insert({
        circle_id: data.id,
        user_id: currentUserId,
        role: 'creator'
      });

    return data;
  } catch (error) {
    return null;
  }
}

// Update circle
export async function updateCircle(circleId: string, updates: Partial<Circle>): Promise<Circle | null> {
  const { data, error } = await supabase
    .from('circles')
    .update(updates)
    .eq('id', circleId)
    .select()
    .single();

  if (error) {
    console.error('Error updating circle:', error);
    return null;
  }

  return data;
}

// Get circle members
export async function getCircleMembers(circleId: string): Promise<CircleMember[]> {
  const { data, error } = await supabase
    .from('circle_members')
    .select(`
      *,
      profile:profiles(*)
    `)
    .eq('circle_id', circleId)
    .order('joined_at', { ascending: true });

  if (error) {
    console.error('Error fetching circle members:', error);
    return [];
  }

  return data || [];
}

// Create invite link
export async function createInviteLink(circleId: string, maxUses: number = 10): Promise<CircleInvite | null> {
  const currentUserId = (await supabase.auth.getUser()).data.user?.id;
  if (!currentUserId) return null;

  const inviteCode = generateInviteCode();
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + 7); // 7 days expiry

  const { data, error } = await supabase
    .from('circle_invites')
    .insert({
      circle_id: circleId,
      invited_by: currentUserId,
      invite_code: inviteCode,
      expires_at: expiresAt.toISOString(),
      max_uses: maxUses
    })
    .select()
    .single();

  if (error) {
    console.error('Error creating invite:', error);
    return null;
  }

  return data;
}

// Join circle via invite code
export async function joinCircleViaInvite(inviteCode: string): Promise<boolean> {
  const currentUserId = (await supabase.auth.getUser()).data.user?.id;
  if (!currentUserId) return false;

  // Get invite
  const { data: invite, error: inviteError } = await supabase
    .from('circle_invites')
    .select('*')
    .eq('invite_code', inviteCode)
    .single();

  if (inviteError || !invite) {
    console.error('Invalid invite code');
    return false;
  }

  // Check if expired or maxed out
  if (new Date(invite.expires_at) < new Date() || invite.current_uses >= invite.max_uses) {
    console.error('Invite expired or maxed out');
    return false;
  }

  // Check if already a member
  const { data: existing } = await supabase
    .from('circle_members')
    .select('id')
    .eq('circle_id', invite.circle_id)
    .eq('user_id', currentUserId)
    .single();

  if (existing) {
    return true; // Already a member
  }

  // Check member limit
  const { data: circle } = await supabase
    .from('circles')
    .select('member_limit, circle_members(count)')
    .eq('id', invite.circle_id)
    .single();

  const memberCount = circle?.circle_members?.[0]?.count || 0;
  if (memberCount >= (circle?.member_limit || 50)) {
    console.error('Circle is full');
    return false;
  }

  // Add member
  const { error: memberError } = await supabase
    .from('circle_members')
    .insert({
      circle_id: invite.circle_id,
      user_id: currentUserId,
      role: 'member'
    });

  if (memberError) {
    console.error('Error joining circle:', memberError);
    return false;
  }

  // Increment invite usage
  await supabase
    .from('circle_invites')
    .update({ current_uses: invite.current_uses + 1 })
    .eq('id', invite.id);

  return true;
}

// Get circle writings (from members)
export async function getCircleWritings(circleId: string): Promise<any[]> {
  // Get circle members
  const { data: members } = await supabase
    .from('circle_members')
    .select('user_id')
    .eq('circle_id', circleId);

  if (!members || members.length === 0) return [];

  const memberIds = members.map(m => m.user_id);

  // Get writings shared with circles from these members
  const { data, error } = await supabase
    .from('writings')
    .select(`
      *,
      profile:profiles(*)
    `)
    .in('user_id', memberIds)
    .eq('visibility', 'circles')
    .order('updated_at', { ascending: false });

  if (error) {
    console.error('Error fetching circle writings:', error);
    return [];
  }

  return data || [];
}

// Leave circle
export async function leaveCircle(circleId: string): Promise<boolean> {
  const currentUserId = (await supabase.auth.getUser()).data.user?.id;
  if (!currentUserId) return false;

  const { error } = await supabase
    .from('circle_members')
    .delete()
    .eq('circle_id', circleId)
    .eq('user_id', currentUserId);

  if (error) {
    console.error('Error leaving circle:', error);
    return false;
  }

  return true;
}

// Helper: Generate random invite code
function generateInviteCode(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let code = '';
  for (let i = 0; i < 8; i++) {
    code += chars[Math.floor(Math.random() * chars.length)];
  }
  return code;
}