import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { MembersOnlyGate } from './MembersOnlyGate';

interface ProtectedRouteProps {
  children: React.ReactNode;
  fallback?: 'redirect' | 'gate';
}

/**
 * ProtectedRoute - wraps pages that require authentication.
 * 
 * If user is not logged in:
 * - fallback='redirect': navigates to /signin with redirect param
 * - fallback='gate': shows the MembersOnlyGate component (default)
 * 
 * Related: Issue #20 - Gallery Wall and interactive features behind authentication
 */
export function ProtectedRoute({ children, fallback = 'gate' }: ProtectedRouteProps) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F5F0EB]">
        <div className="font-[family-name:var(--font-ui)] text-[#717171]">
          Loading...
        </div>
      </div>
    );
  }

  if (!user) {
    if (fallback === 'redirect') {
      // Redirect to sign in with return URL
      const currentPath = typeof window !== 'undefined' ? window.location.pathname : '/';
      window.history.pushState({}, '', `/signin?redirect=${encodeURIComponent(currentPath)}`);
      window.dispatchEvent(new PopStateEvent('popstate'));
      return null;
    }

    // Show the members-only gate (elegant literary lockout page)
    return <MembersOnlyGate />;
  }

  return <>{children}</>;
}
