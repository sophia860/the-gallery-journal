import { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { ErrorBoundary } from './components/ErrorBoundary';

// Gallery Pages - ONLY
import { GalleryLandingPage } from './pages/GalleryLandingPage';
import { AboutPage } from './pages/AboutPage';
import { ExhibitPage } from './pages/ExhibitPage';
import { CollectionGalleryPage } from './pages/CollectionGalleryPage';

// Editor Pages
import { EditorLoginPage } from './pages/EditorLoginPage';
import { EditorDashboard } from './editor/EditorDashboard';

// Writer Platform Pages
import { SignInPage } from './pages/SignInPage';
import { SignUpPage } from './pages/SignUpPage';
import { MyGarden } from './studio/MyGarden';
import { WriterProfilePage } from './pages/WriterProfilePage';

// Garden Platform Pages
import { GardenSignUpPage } from './pages/GardenSignUpPage';
import { GardenSignInPage } from './pages/GardenSignInPage';
import { MyGardenPage } from './pages/MyGardenPage';
import { WritingEditorPage } from './pages/WritingEditorPage';
import { ExplorePage } from './pages/ExplorePage';
import { CirclesPage } from './pages/CirclesPage';
import { CircleDetailPage } from './pages/CircleDetailPage';

// New Garden Platform Pages
import { NewGardenSignUpPage } from './pages/NewGardenSignUpPage';
import { NewGardenSignInPage } from './pages/NewGardenSignInPage';
import { SetupPage } from './pages/SetupPage';
import { GardenHomePage } from './pages/GardenHomePage';
import { EditorPage } from './pages/EditorPage';
import { TablesOverviewPage } from './pages/TablesOverviewPage';
import { TableDetailPage } from './pages/TableDetailPage';
import { DiscoverPage } from './pages/DiscoverPage';
import { ProfilePage } from './pages/ProfilePage';
import { SettingsPage } from './pages/SettingsPage';

// Admin Pages (for demo setup)
import { AdminPage } from './pages/AdminPage';
import { DemoModePage } from './pages/DemoModePage';
import { DesignSystemDemo } from './pages/DesignSystemDemo';
import { DebugPage } from './pages/DebugPage';

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
    '/collection-gallery',
    '/collection'
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

  // Route matching - Gallery focused ONLY
  let pageContent;
  
  // Gallery Pages
  if (route === '/') {
    pageContent = <GalleryLandingPage />;
  } else if (route === '/about') {
    pageContent = <AboutPage />;
  } else if (route.startsWith('/exhibit/')) {
    const exhibitId = route.split('/exhibit/')[1];
    pageContent = <ExhibitPage exhibitId={exhibitId} />;
  } else if (route === '/collection-gallery' || route === '/collection') {
    pageContent = <CollectionGalleryPage />;
  }
  
  // Editor Pages
  else if (route === '/editors') {
    pageContent = <EditorLoginPage />;
  } else if (route === '/editors/dashboard') {
    pageContent = <EditorDashboard />;
  }
  
  // Writer Platform Pages
  else if (route === '/signin') {
    pageContent = <SignInPage />;
  } else if (route === '/signup') {
    pageContent = <SignUpPage />;
  } else if (route === '/garden') {
    pageContent = <MyGarden />;
  } else if (route.startsWith('/profile/')) {
    pageContent = <WriterProfilePage />;
  }
  
  // Garden Platform Pages
  else if (route === '/garden/signup') {
    pageContent = <GardenSignUpPage />;
  } else if (route === '/garden/signin') {
    pageContent = <GardenSignInPage />;
  } else if (route === '/my-garden') {
    pageContent = <MyGardenPage />;
  } else if (route === '/garden/write') {
    pageContent = <WritingEditorPage />;
  } else if (route.startsWith('/garden/write/')) {
    const writingId = route.split('/garden/write/')[1];
    pageContent = <WritingEditorPage writingId={writingId} />;
  } else if (route === '/explore') {
    pageContent = <ExplorePage />;
  } else if (route === '/circles') {
    pageContent = <CirclesPage />;
  } else if (route.startsWith('/circles/')) {
    const circleId = route.split('/circles/')[1];
    pageContent = <CircleDetailPage circleId={circleId} />;
  }
  
  // New Garden Platform Pages
  else if (route === '/garden/new-signup') {
    pageContent = <NewGardenSignUpPage />;
  } else if (route === '/garden/new-signin') {
    pageContent = <NewGardenSignInPage />;
  } else if (route === '/garden/setup') {
    pageContent = <SetupPage />;
  } else if (route === '/garden/home') {
    pageContent = <GardenHomePage />;
  } else if (route === '/garden/editor') {
    pageContent = <EditorPage />;
  } else if (route === '/garden/tables') {
    pageContent = <TablesOverviewPage />;
  } else if (route.startsWith('/garden/tables/')) {
    const tableId = route.split('/garden/tables/')[1];
    pageContent = <TableDetailPage tableId={tableId} />;
  } else if (route === '/garden/discover') {
    pageContent = <DiscoverPage />;
  } else if (route === '/garden/profile') {
    pageContent = <ProfilePage />;
  } else if (route === '/garden/settings') {
    pageContent = <SettingsPage />;
  }
  
  // Admin Pages (for demo setup)
  else if (route === '/admin') {
    pageContent = <AdminPage />;
  } else if (route === '/admin/demo-mode') {
    pageContent = <DemoModePage />;
  } else if (route === '/admin/design-system-demo') {
    pageContent = <DesignSystemDemo />;
  } else if (route === '/admin/debug') {
    pageContent = <DebugPage />;
  }
  
  // 404 Page
  else {
    pageContent = <NotFoundPage />;
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      {pageContent}
    </div>
  );
}

// Main App component - wraps everything in AuthProvider
export default function App() {
  return (
    <AuthProvider>
      <ErrorBoundary>
        <AppContent />
      </ErrorBoundary>
    </AuthProvider>
  );
}