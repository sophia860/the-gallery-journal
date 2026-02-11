import { useState, useEffect } from 'react';
import { AuthProvider } from './contexts/AuthContext';

// Gallery pages
import { GalleryLandingPage } from './pages/GalleryLandingPage';
import { GardenLandingPage } from './pages/GardenLandingPage';
import { ExhibitsPage } from './pages/ExhibitsPage';
import { CollectionGalleryPage } from './pages/CollectionGalleryPage';

// Garden pages - New
import { MyGardenPage } from './pages/MyGardenPage';
import { WritingEditorPage } from './pages/WritingEditorPage';
import { NewGardenSignInPage } from './pages/NewGardenSignInPage';
import { NewGardenSignUpPage } from './pages/NewGardenSignUpPage';
import { ExplorePage } from './pages/ExplorePage';
import { CirclesPage } from './pages/CirclesPage';
import { CircleDetailPage } from './pages/CircleDetailPage';
import { GreenhousePage } from './pages/GreenhousePage';
import { GraftsPage } from './pages/GraftsPage';
import { GraftEditorPage } from './pages/GraftEditorPage';
import { PricingPage } from './pages/PricingPage';
import { SettingsPage } from './pages/SettingsPage';
import { SetupPage } from './pages/SetupPage';
import { ReadingModePage } from './pages/ReadingModePage';
import { VisitGardenPage } from './pages/VisitGardenPage';
import { WriterProfilePage } from './pages/WriterProfilePage';

// Garden pages - Old (keeping for compatibility)
import { DashboardPage } from './garden/pages/DashboardPage';
import { LoginPage } from './garden/pages/LoginPage';
import { SignupPage } from './garden/pages/SignupPage';
import { WritePage } from './garden/pages/WritePage';
import { ExplorePage as OldExplorePage } from './garden/pages/ExplorePage';
import { CirclesPage as OldCirclesPage } from './garden/pages/CirclesPage';
import { HarvestPage } from './garden/pages/HarvestPage';
import { QuietHoursPage } from './garden/pages/QuietHoursPage';
import { ProfilePage } from './garden/pages/ProfilePage';
import { NotificationsPage } from './garden/pages/NotificationsPage';
import { ReaderPage } from './garden/pages/ReaderPage';
import { BookmarksPage } from './garden/pages/BookmarksPage';
import { PromptsPage } from './garden/pages/PromptsPage';

// Editor pages
import { EditorDashboard } from './editor/EditorDashboard';
import { EditorLoginPage } from './editor/EditorLoginPage';

// Simple client-side router
function Router() {
  const [route, setRoute] = useState(window.location.pathname);
  const [params, setParams] = useState<Record<string, string>>({});

  useEffect(() => {
    const handlePopState = () => {
      setRoute(window.location.pathname);
    };

    const handleHashChange = () => {
      const hash = window.location.hash.slice(1);
      if (hash) {
        setRoute(hash);
      }
    };

    window.addEventListener('popstate', handlePopState);
    window.addEventListener('hashchange', handleHashChange);
    
    if (window.location.hash) {
      const hash = window.location.hash.slice(1);
      setRoute(hash);
    }
    
    return () => {
      window.removeEventListener('popstate', handlePopState);
      window.removeEventListener('hashchange', handleHashChange);
    };
  }, []);

  useEffect(() => {
    const match = route.match(/\/garden\/reader\/([^/]+)/);
    if (match) {
      setParams({ id: match[1] });
    }
    const circleMatch = route.match(/\/circles\/([^/]+)/);
    if (circleMatch) {
      setParams({ circleId: circleMatch[1] });
    }
    const readingMatch = route.match(/\/garden\/reading\/([^/]+)/);
    if (readingMatch) {
      setParams({ writingId: readingMatch[1] });
    }
    const visitGardenMatch = route.match(/\/garden\/visit\/([^/]+)/);
    if (visitGardenMatch) {
      setParams({ username: visitGardenMatch[1] });
    }
    const writerMatch = route.match(/\/writer\/([^/]+)/);
    if (writerMatch) {
      setParams({ writerUsername: writerMatch[1] });
    }
    const graftEditorMatch = route.match(/\/grafts\/edit\/([^/]+)/);
    if (graftEditorMatch) {
      setParams({ graftId: graftEditorMatch[1] });
    }
  }, [route]);

  // Gallery routes
  if (route === '/' || route === '') {
    return <GalleryLandingPage />;
  }

  if (route === '/welcome') {
    return <GardenLandingPage />;
  }

  if (route === '/gallery') {
    return <ExhibitsPage />;
  }
  
  if (route === '/exhibits') {
    return <ExhibitsPage />;
  }

  if (route === '/collection-gallery') {
    return <CollectionGalleryPage />;
  }

  // NEW Garden routes (Main Navigation)
  if (route === '/my-garden') {
    return <MyGardenPage />;
  }

  if (route === '/garden/signin') {
    return <NewGardenSignInPage />;
  }

  if (route === '/garden/signup') {
    return <NewGardenSignUpPage />;
  }

  if (route === '/garden/write' || route === '/write') {
    return <WritingEditorPage />;
  }

  if (route === '/explore') {
    return <ExplorePage />;
  }

  if (route === '/circles') {
    return <CirclesPage />;
  }

  if (route.startsWith('/circles/')) {
    return <CircleDetailPage circleId={params.circleId || ''} />;
  }

  if (route === '/greenhouse') {
    return <GreenhousePage />;
  }

  if (route === '/grafts') {
    return <GraftsPage />;
  }

  if (route.startsWith('/grafts/edit/')) {
    return <GraftEditorPage graftId={params.graftId || '1'} />;
  }

  if (route === '/graft-editor') {
    return <GraftEditorPage graftId="1" />;
  }

  if (route === '/pricing') {
    return <PricingPage />;
  }

  if (route === '/settings') {
    return <SettingsPage />;
  }

  if (route === '/setup') {
    return <SetupPage />;
  }

  if (route === '/reading-mode') {
    return <ReadingModePage writingId="" />; // Default empty
  }

  if (route.startsWith('/garden/reading/')) {
    return <ReadingModePage writingId={params.writingId || ''} />;
  }

  if (route.startsWith('/garden/visit/')) {
    return <VisitGardenPage username={params.username || ''} />;
  }

  if (route === '/visit-garden') {
    return <VisitGardenPage username="maya-chen" />;
  }

  if (route.startsWith('/writer/')) {
    return <WriterProfilePage username={params.writerUsername || 'maya-chen'} />;
  }

  if (route === '/writer-profile') {
    return <WriterProfilePage username="maya-chen" />;
  }

  // OLD Garden routes (keeping for compatibility)
  if (route === '/garden' || route === '/garden/dashboard') {
    return <DashboardPage />;
  }
  
  if (route === '/garden/login') {
    return <LoginPage />;
  }
  
  if (route === '/garden/signup') {
    return <SignupPage />;
  }
  
  if (route === '/garden/write') {
    return <WritePage />;
  }
  
  if (route === '/garden/explore') {
    return <ExplorePage />; // Redirect to new ExplorePage with proper content
  }
  
  if (route === '/garden/circles') {
    return <CirclesPage />; // Redirect to new CirclesPage with proper content
  }
  
  if (route === '/garden/harvest') {
    return <HarvestPage />;
  }
  
  if (route === '/garden/quiet-hours') {
    return <QuietHoursPage />;
  }
  
  if (route === '/garden/profile') {
    return <ProfilePage />;
  }
  
  if (route === '/garden/notifications') {
    return <NotificationsPage />;
  }
  
  if (route.startsWith('/garden/reader/')) {
    return <ReaderPage userId={params.id || ''} />;
  }
  
  if (route === '/garden/bookmarks') {
    return <BookmarksPage />;
  }
  
  if (route === '/garden/prompts') {
    return <PromptsPage />;
  }

  // Editor routes
  if (route === '/editor-login') {
    return <EditorLoginPage />;
  }
  
  if (route === '/editor' || route === '/editor/dashboard') {
    return <EditorDashboard />;
  }

  // Default fallback to gallery landing
  return <GalleryLandingPage />;
}

export default function App() {
  return (
    <AuthProvider>
      <Router />
    </AuthProvider>
  );
}