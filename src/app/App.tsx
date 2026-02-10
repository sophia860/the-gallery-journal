import { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';

// Gallery Pages - ONLY
import { GalleryLandingPage } from './pages/GalleryLandingPage';
import { AboutPage } from './pages/AboutPage';
import { ExhibitPage } from './pages/ExhibitPage';
import { CollectionGalleryPage } from './pages/CollectionGalleryPage';

// Editor Pages
import { EditorLoginPage } from './pages/EditorLoginPage';
import { EditorDashboard } from './editor/EditorDashboard';

// Admin Pages (for demo setup)
import { AdminPage } from './pages/AdminPage';
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
  
  // Admin Pages (for demo setup)
  else if (route === '/admin') {
    pageContent = <AdminPage />;
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