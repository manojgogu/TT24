import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import SosModal from './components/SosModal';

// Public Pages
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';

// Authenticated Pages
import StudentDashboard from './pages/StudentDashboard';
import ResponderDashboard from './pages/ResponderDashboard';
import AdminDashboard from './pages/AdminDashboard';
import ReportEmergencyPage from './pages/ReportEmergencyPage';
import MyReportsPage from './pages/MyReportsPage';
import IncidentDetailPage from './pages/IncidentDetailPage';
import AdminIncidentsPage from './pages/AdminIncidentsPage';
import AdminUsersPage from './pages/AdminUsersPage';
import AdminRespondersPage from './pages/AdminRespondersPage';
import AdminMasterDataPage from './pages/AdminMasterDataPage';
import AdminExportPage from './pages/AdminExportPage';
import ProfilePage from './pages/ProfilePage';

function AppContent() {
  const { user, loading, isAdmin, isSecurity, isStudent, isFaculty } = useAuth();

  // Public view state: 'landing' | 'login' | 'register'
  const [publicView, setPublicView] = useState('landing');

  // Authenticated view tab
  const [currentTab, setCurrentTab] = useState('dashboard');
  const [selectedIncidentId, setSelectedIncidentId] = useState(null);

  // Layout UI states
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isSosOpen, setIsSosOpen] = useState(false);

  // If initial auth token verification is loading
  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center text-white">
        <span className="w-10 h-10 border-4 border-red-500 border-t-transparent rounded-full animate-spin mb-4" />
        <p className="font-extrabold text-lg tracking-tight">CampusSafety System</p>
        <p className="text-xs text-slate-400 mt-1">Authenticating secure session...</p>
      </div>
    );
  }

  // PUBLIC UN-AUTHENTICATED SHELL
  if (!user) {
    return (
      <>
        {publicView === 'landing' && (
          <LandingPage
            onNavigateLogin={() => setPublicView('login')}
            onNavigateRegister={() => setPublicView('register')}
            onOpenSos={() => setIsSosOpen(true)}
          />
        )}
        {publicView === 'login' && (
          <LoginPage
            onNavigateRegister={() => setPublicView('register')}
            onNavigateLanding={() => setPublicView('landing')}
          />
        )}
        {publicView === 'register' && (
          <RegisterPage
            onNavigateLogin={() => setPublicView('login')}
            onNavigateLanding={() => setPublicView('landing')}
          />
        )}

        {/* Global SOS Modal on public view */}
        <SosModal
          isOpen={isSosOpen}
          onClose={() => setIsSosOpen(false)}
          onSuccess={() => {
            alert('Emergency SOS recorded! Please sign in to track live responders dispatched.');
            setPublicView('login');
          }}
        />
      </>
    );
  }

  // Switch between tabs
  const handleSelectIncident = (id) => {
    setSelectedIncidentId(id);
    setCurrentTab('incident-detail');
  };

  const renderMainContent = () => {
    if (currentTab === 'incident-detail' && selectedIncidentId) {
      return (
        <IncidentDetailPage
          incidentId={selectedIncidentId}
          onBack={() => {
            if (isAdmin) setCurrentTab('all-emergencies');
            else if (isSecurity) setCurrentTab('assigned-incidents');
            else setCurrentTab('my-reports');
          }}
          onRefreshList={() => {}}
        />
      );
    }

    switch (currentTab) {
      case 'dashboard':
        if (isAdmin) {
          return (
            <AdminDashboard
              onSelectIncident={handleSelectIncident}
              onNavigateTab={(tab) => setCurrentTab(tab)}
            />
          );
        }
        if (isSecurity) {
          return <ResponderDashboard onSelectIncident={handleSelectIncident} />;
        }
        return (
          <StudentDashboard
            onOpenSos={() => setIsSosOpen(true)}
            onNavigateReport={() => setCurrentTab('report')}
            onSelectIncident={handleSelectIncident}
          />
        );

      case 'report':
        return (
          <ReportEmergencyPage
            onSuccess={(id) => handleSelectIncident(id)}
            onCancel={() => setCurrentTab('dashboard')}
          />
        );

      case 'my-reports':
        return (
          <MyReportsPage
            onSelectIncident={handleSelectIncident}
            onNavigateReport={() => setCurrentTab('report')}
          />
        );

      case 'assigned-incidents':
        return <ResponderDashboard onSelectIncident={handleSelectIncident} />;

      case 'all-emergencies':
        return <AdminIncidentsPage onSelectIncident={handleSelectIncident} />;

      case 'analytics':
        return (
          <AdminDashboard
            onSelectIncident={handleSelectIncident}
            onNavigateTab={(tab) => setCurrentTab(tab)}
          />
        );

      case 'user-management':
        return <AdminUsersPage />;

      case 'responders-management':
        return <AdminRespondersPage />;

      case 'master-data':
        return <AdminMasterDataPage />;

      case 'reports-export':
        return <AdminExportPage />;

      case 'profile':
        return <ProfilePage />;

      default:
        return (
          <div className="p-8 text-center text-slate-500">
            Select a module from the sidebar.
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans">
      {/* Top Navbar */}
      <Navbar
        onOpenSos={() => setIsSosOpen(true)}
        onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
        isSidebarOpen={isSidebarOpen}
      />

      <div className="flex-1 flex">
        {/* Left Sidebar */}
        <Sidebar
          currentTab={currentTab}
          onSelectTab={(tab) => {
            setCurrentTab(tab);
            if (tab !== 'incident-detail') {
              setSelectedIncidentId(null);
            }
          }}
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
        />

        {/* Main Content Area */}
        <main className="flex-1 lg:pl-64 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full">
          {renderMainContent()}
        </main>
      </div>

      {/* Global SOS Modal */}
      <SosModal
        isOpen={isSosOpen}
        onClose={() => setIsSosOpen(false)}
        onSuccess={(report) => {
          if (report?.id) {
            handleSelectIncident(report.id);
          } else {
            setCurrentTab('my-reports');
          }
        }}
      />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
