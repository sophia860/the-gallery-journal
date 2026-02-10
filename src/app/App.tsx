import { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { Header } from './components/Header';

// Public Pages
import { GalleryLandingPage } from './pages/GalleryLandingPage';
import { AboutPage } from './pages/AboutPage';
import { RoomsPage } from './pages/RoomsPage';
import { PricingPage } from './pages/PricingPage';
import { RoomPage } from './pages/RoomPage';
import { ExhibitPage } from './pages/ExhibitPage';

// Auth Pages
import { SignUpPage } from './pages/SignUpPage';
import { SignInPage } from './pages/SignInPage';

// Studio Pages (Writer Tools)
import { StudioHub } from './studio/StudioHub';
import { FreewritePage } from './studio/FreewritePage';
import { MyGarden } from './studio/MyGarden';
import { MyWorkPage } from './studio/MyWorkPage';
import { RoomSettingsPage } from './studio/RoomSettingsPage';
import { NewExhibitPage } from './pages/NewExhibitPage';

// Editor Pages (Editorial Team)
import { EditorDashboardPage } from './pages/EditorDashboardPage';
import { EditorialSubmissionsPage } from './pages/EditorialSubmissionsPage';

// Community Pages
import { CollectionGalleryPage } from './pages/CollectionGalleryPage';
import { CommunityWallPage } from './pages/CommunityWallPage';

// Admin Pages
import { AdminPage } from './pages/AdminPage';
import { AddPoemsPage } from './pages/AddPoemsPage';
import { ResetGalleryPage } from './pages/ResetGalleryPage';
import { DemoModePage } from './pages/DemoModePage';
import { DesignSystemDemo } from './pages/DesignSystemDemo';

// 404 Page
import { NotFoundPage } from './pages/NotFoundPage';

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
  const pagesWithOwnNav = [
    '/',
    '/about',
    '/rooms',
    '/signin',
    '/signup',
    '/pricing',
    '/collection-gallery',
    '/community-wall',
    '/editor-dashboard',
    '/editorial-submissions'
  ];
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

  // Route matching - cleaned and organized
  let pageContent;
  
  // Public Pages
  if (route === '/') {
    pageContent = <GalleryLandingPage />;
  } else if (route === '/about') {
    pageContent = <AboutPage />;
  } else if (route === '/rooms' || route === '/gallery') {
    pageContent = <RoomsPage />;
  } else if (route === '/pricing') {
    pageContent = <PricingPage />;
  } else if (route.startsWith('/room/')) {
    const userId = route.split('/room/')[1];
    pageContent = <RoomPage userId={userId} />;
  } else if (route.startsWith('/exhibit/')) {
    const exhibitId = route.split('/exhibit/')[1];
    pageContent = <ExhibitPage exhibitId={exhibitId} />;
  }
  
  // Auth Pages
  else if (route === '/signup') {
    pageContent = <SignUpPage />;
  } else if (route === '/signin') {
    pageContent = <SignInPage />;
  }
  
  // Studio Pages (Writer Tools)
  else if (route === '/studio') {
    pageContent = <StudioHub />;
  } else if (route === '/studio/freewrite') {
    pageContent = <FreewritePage />;
  } else if (route === '/studio/my-garden') {
    pageContent = <MyGarden />;
  } else if (route === '/studio/work') {
    pageContent = <MyWorkPage />;
  } else if (route === '/studio/room-settings') {
    pageContent = <RoomSettingsPage />;
  } else if (route === '/studio/new-exhibit') {
    pageContent = <NewExhibitPage />;
  }
  
  // Editor Pages (Editorial Team)
  else if (route === '/editor-dashboard') {
    pageContent = <EditorDashboardPage />;
  } else if (route === '/editorial-submissions') {
    pageContent = <EditorialSubmissionsPage />;
  }
  
  // Community Pages
  else if (route === '/collection-gallery') {
    pageContent = <CollectionGalleryPage />;
  } else if (route === '/community-wall') {
    pageContent = <CommunityWallPage />;
  }
  
  // Admin Pages
  else if (route === '/admin') {
    pageContent = <AdminPage />;
  } else if (route === '/admin/add-poems') {
    pageContent = <AddPoemsPage />;
  } else if (route === '/admin/reset-gallery') {
    pageContent = <ResetGalleryPage />;
  } else if (route === '/admin/demo-mode') {
    pageContent = <DemoModePage />;
  } else if (route === '/admin/design-system-demo') {
    pageContent = <DesignSystemDemo />;
  }
  
  // 404 Page
  else {
    pageContent = <NotFoundPage />;
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      {showDefaultHeader && <Header />}
      {pageContent}
    </div>
  );
}

// Main App component - wraps everything in AuthProvider
export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}