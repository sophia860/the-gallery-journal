import { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { SubscriptionProvider } from './contexts/SubscriptionContext';
import { Header } from './components/Header';
import { ProtectedRoute } from './components/ProtectedRoute';
import { LandingPage } from './pages/LandingPage';
import { SignUpPage } from './pages/SignUpPage';
import { SignInPage } from './pages/SignInPage';
import { DashboardPage } from './pages/DashboardPage';
import { RoomPage } from './pages/RoomPage';
import { NewExhibitPage } from './pages/NewExhibitPage';
import { ExhibitPage } from './pages/ExhibitPage';
import { CommonplacePage } from './pages/CommonplacePage';
import { WelcomePage } from './pages/WelcomePage';
import { AboutPage } from './pages/AboutPage';
import { LettersPage } from './pages/LettersPage';
import { GalleryLandingPage } from './pages/GalleryLandingPage';
import { GalleryWallPage } from './pages/GalleryWallPage';
import { AfterhoursPage } from './pages/AfterhoursPage';
import { RoomsPage } from './pages/RoomsPage';
import { PricingPage } from './pages/PricingPage';

// Studio pages
import { StudioHub } from './studio/StudioHub';
import { FreewritePage } from './studio/FreewritePage';
import { PoetryEditorPage } from './studio/PoetryEditorPage';
import { MyWorkPage } from './studio/MyWorkPage';
import { RoomSettingsPage } from './studio/RoomSettingsPage';

// Editor pages
import { EditorDashboard } from './editor/EditorDashboard';
import { EditorDashboardPage } from './pages/EditorDashboardPage';

// Collection page
import { CollectionPage } from './pages/CollectionPage';

// Writer Editor page
import { WriterEditorPage } from './pages/WriterEditorPage';

// Collection Gallery and Community Wall
import { CollectionGalleryPage } from './pages/CollectionGalleryPage';
import { CommunityWallPage } from './pages/CommunityWallPage';

// 404 Page
import { NotFoundPage } from './pages/NotFoundPage';

// Writer Profile Page
import { WriterProfilePage } from './pages/WriterProfilePage';

// Writers' Studio Page
import { WritersStudioPage } from './pages/WritersStudioPage';

// AppContent component that uses auth - MUST be inside AuthProvider
function AppContent() {
  const [route, setRoute] = useState(window.location.pathname);
  const { loading } = useAuth();

  useEffect(() => {
    const handlePopState = () => {
      setRoute(window.location.pathname);
    };

    window.addEventListener('popstate', handlePopState);
    
    // Intercept link clicks for client-side navigation
    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const link = target.closest('a');
      
      if (link && link.href && link.origin === window.location.origin) {
        e.preventDefault();
        const path = new URL(link.href).pathname;
        window.history.pushState({}, '', path);
        setRoute(path);
      }
    };

    document.addEventListener('click', handleClick);

    return () => {
      window.removeEventListener('popstate', handlePopState);
      document.removeEventListener('click', handleClick);
    };
  }, []);

  // Pages that use their own navigation (don't show the default Header)
  const pagesWithOwnNav = ['/', '/gallery-wall', '/afterhours', '/collection', '/rooms', '/signin', '/signup', '/writer-editor', '/collection-gallery', '/community-wall', '/editor-dashboard', '/pricing'];
  const showDefaultHeader = !pagesWithOwnNav.includes(route);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F5F0EB]">
        <div className="font-[family-name:var(--font-ui)] text-[#717171]">
          Loading...
        </div>
      </div>
    );
  }

  // Route matching
  let pageContent;
  
  if (route === '/') {
    pageContent = <GalleryLandingPage />;
  } else if (route === '/rooms' || route === '/gallery') {
    pageContent = <ProtectedRoute><RoomsPage /></ProtectedRoute>;
  } else if (route === '/gallery-wall') {
    pageContent = <ProtectedRoute><GalleryWallPage /></ProtectedRoute>;
  } else if (route === '/afterhours') {
    pageContent = <ProtectedRoute><AfterhoursPage /></ProtectedRoute>;
  } else if (route === '/about') {
    pageContent = <AboutPage />;
  } else if (route === '/signup') {
    pageContent = <SignUpPage />;
  } else if (route === '/signin') {
    pageContent = <SignInPage />;
  } else if (route === '/pricing') {
    pageContent = <PricingPage />;
  } else if (route === '/dashboard') {
    pageContent = <ProtectedRoute><DashboardPage /></ProtectedRoute>;
  } else if (route === '/dashboard/new-exhibit' || route === '/studio/new-exhibit') {
    pageContent = <ProtectedRoute><NewExhibitPage /></ProtectedRoute>;
  } else if (route === '/commonplace') {
    pageContent = <CommonplacePage />;
  } else if (route === '/letters') {
    pageContent = <LettersPage />;
  } else if (route.startsWith('/room/')) {
    const userId = route.split('/room/')[1];
    pageContent = <ProtectedRoute><RoomPage userId={userId} /></ProtectedRoute>;
  } else if (route.startsWith('/exhibit/')) {
    const exhibitId = route.split('/exhibit/')[1];
    pageContent = <ExhibitPage exhibitId={exhibitId} />;
  } else if (route === '/studio') {
    pageContent = <ProtectedRoute><StudioHub /></ProtectedRoute>;
  } else if (route === '/studio/freewrite') {
    pageContent = <ProtectedRoute><FreewritePage /></ProtectedRoute>;
  } else if (route === '/studio/poetry') {
    pageContent = <ProtectedRoute><PoetryEditorPage /></ProtectedRoute>;
  } else if (route === '/studio/work') {
    pageContent = <ProtectedRoute><MyWorkPage /></ProtectedRoute>;
  } else if (route === '/studio/room-settings') {
    pageContent = <ProtectedRoute><RoomSettingsPage /></ProtectedRoute>;
  } else if (route === '/editor') {
    pageContent = <ProtectedRoute><EditorDashboard /></ProtectedRoute>;
  } else if (route === '/editor-dashboard') {
    pageContent = <ProtectedRoute><EditorDashboardPage /></ProtectedRoute>;
  } else if (route === '/collection') {
    pageContent = <CollectionPage />;
  } else if (route === '/writer-editor') {
    pageContent = <ProtectedRoute><WriterEditorPage /></ProtectedRoute>;
  } else if (route === '/collection-gallery') {
    pageContent = <CollectionGalleryPage />;
  } else if (route === '/community-wall') {
    pageContent = <CommunityWallPage />;
  } else if (route.startsWith('/writer/')) {
    const writerId = route.split('/writer/')[1];
    pageContent = <WriterProfilePage writerId={writerId} />;
  } else if (route === '/writers-studio') {
    pageContent = <ProtectedRoute><WritersStudioPage /></ProtectedRoute>;
  } else {
    // 404
    pageContent = <NotFoundPage />;
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      {showDefaultHeader && <Header />}
      {pageContent}
    </div>
  );
}

// Main App component - wraps everything in AuthProvider and SubscriptionProvider
export default function App() {
  return (
    <AuthProvider>
      <SubscriptionProvider>
        <AppContent />
      </SubscriptionProvider>
    </AuthProvider>
  );
}
