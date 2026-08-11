import React, { useState, useEffect } from 'react';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { Hero } from './components/public/Hero';
import { RegistrationForm } from './components/public/RegistrationForm';
import { VisitorRegistrationForm } from './components/public/VisitorRegistrationForm';
import { QRDownloadSearch } from './components/public/QRDownloadSearch';
import { QRSuccessModal } from './components/public/QRSuccessModal';
import { AdminLoginModal } from './components/admin/AdminLoginModal';
import { AdminRequestModal } from './components/admin/AdminRequestModal';
import { DashboardOverview } from './components/admin/DashboardOverview';
import { SundayQRScanner } from './components/admin/SundayQRScanner';
import { MemberManagement } from './components/admin/MemberManagement';
import { AttendanceLog } from './components/admin/AttendanceLog';
import { AdminRequestsManager } from './components/admin/AdminRequestsManager';
import { DatabaseManager } from './components/admin/DatabaseManager';
import { VisitorManagement } from './components/admin/VisitorManagement';
import { AdminUser, Member } from './types';
import { apiRequest, getAuthToken, removeAuthToken } from './utils/api';
import { LayoutDashboard, QrCode, Users, CalendarCheck, ShieldAlert, Database, Heart } from 'lucide-react';

export function App() {
  const [activeTab, setActiveTab] = useState<'home' | 'register' | 'visitor' | 'download_qr' | 'scanner' | 'admin_dashboard'>('home');
  const [adminSubTab, setAdminSubTab] = useState<'overview' | 'scanner' | 'members' | 'visitors' | 'attendance' | 'requests' | 'database'>('overview');

  const [adminUser, setAdminUser] = useState<AdminUser | null>(null);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [newRegisteredMember, setNewRegisteredMember] = useState<Member | null>(null);

  // Check auth session on load
  useEffect(() => {
    const checkAuth = async () => {
      const token = getAuthToken();
      if (token) {
        try {
          const res = await apiRequest<{ success: boolean; user?: AdminUser }>('/auth/me');
          if (res.success && res.user) {
            setAdminUser(res.user);
          } else {
            removeAuthToken();
          }
        } catch {
          removeAuthToken();
        }
      }
    };
    checkAuth();

    const handleSessionExpired = () => {
      setAdminUser(null);
      setActiveTab('home');
    };
    window.addEventListener('auth_session_expired', handleSessionExpired);
    return () => window.removeEventListener('auth_session_expired', handleSessionExpired);
  }, []);

  const handleLogout = () => {
    removeAuthToken();
    setAdminUser(null);
    setActiveTab('home');
  };

  const handleAdminDashboardClick = () => {
    if (adminUser) {
      setActiveTab('admin_dashboard');
    } else {
      setShowLoginModal(true);
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-between bg-slate-50 font-sans selection:bg-amber-500 selection:text-white">
      
      {/* Top Navigation Bar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={(tab) => {
          if (tab === 'admin_dashboard' && !adminUser) {
            setShowLoginModal(true);
          } else {
            setActiveTab(tab);
          }
        }}
        adminUser={adminUser}
        onAdminLoginClick={() => setShowLoginModal(true)}
        onLogout={handleLogout}
      />

      {/* Main Content Area */}
      <main className="flex-grow">
        
        {/* PUBLIC: Home Landing Page */}
        {activeTab === 'home' && (
          <Hero
            onRegisterClick={() => setActiveTab('register')}
            onDownloadQrClick={() => setActiveTab('download_qr')}
            onAdminClick={handleAdminDashboardClick}
          />
        )}

        {/* PUBLIC: Member Registration Page */}
        {activeTab === 'register' && (
          <RegistrationForm
            onSuccess={(member) => {
              setNewRegisteredMember(member);
            }}
          />
        )}

        {/* PUBLIC: New Visitor Registration Page */}
        {activeTab === 'visitor' && (
          <VisitorRegistrationForm />
        )}

        {/* PUBLIC: QR Search & Download Page */}
        {activeTab === 'download_qr' && (
          <QRDownloadSearch
            adminUser={adminUser}
            onAdminLoginClick={() => setShowLoginModal(true)}
          />
        )}

        {/* ADMIN DASHBOARD AREA */}
        {activeTab === 'admin_dashboard' && adminUser && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
            
            {/* Admin Sub-Navigation Header */}
            <div className="bg-slate-900 text-white rounded-2xl p-2 border border-slate-800 shadow-lg flex items-center gap-1 overflow-x-auto">
              <button
                onClick={() => setAdminSubTab('overview')}
                className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 shrink-0 ${
                  adminSubTab === 'overview'
                    ? 'bg-amber-500 text-slate-950 shadow-glow-gold'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800'
                }`}
              >
                <LayoutDashboard className="w-4 h-4" />
                <span>Overview</span>
              </button>

              <button
                onClick={() => setAdminSubTab('scanner')}
                className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 shrink-0 ${
                  adminSubTab === 'scanner'
                    ? 'bg-amber-500 text-slate-950 shadow-glow-gold'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800'
                }`}
              >
                <QrCode className="w-4 h-4" />
                <span>Sunday Scanner</span>
              </button>

              <button
                onClick={() => setAdminSubTab('members')}
                className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 shrink-0 ${
                  adminSubTab === 'members'
                    ? 'bg-amber-500 text-slate-950 shadow-glow-gold'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800'
                }`}
              >
                <Users className="w-4 h-4" />
                <span>Member Directory</span>
              </button>

              <button
                onClick={() => setAdminSubTab('visitors')}
                className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 shrink-0 ${
                  adminSubTab === 'visitors'
                    ? 'bg-emerald-500 text-white shadow-lg'
                    : 'text-emerald-300 hover:text-white hover:bg-slate-800'
                }`}
              >
                <Heart className="w-4 h-4" />
                <span>Visitor Directory</span>
              </button>

              <button
                onClick={() => setAdminSubTab('attendance')}
                className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 shrink-0 ${
                  adminSubTab === 'attendance'
                    ? 'bg-amber-500 text-slate-950 shadow-glow-gold'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800'
                }`}
              >
                <CalendarCheck className="w-4 h-4" />
                <span>Sunday Logs</span>
              </button>

              {adminUser.role === 'SUPER_ADMIN' && (
                <>
                  <button
                    onClick={() => setAdminSubTab('requests')}
                    className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 shrink-0 ${
                      adminSubTab === 'requests'
                        ? 'bg-purple-600 text-white shadow-glow-purple'
                        : 'text-purple-300 hover:text-white hover:bg-slate-800'
                    }`}
                  >
                    <ShieldAlert className="w-4 h-4" />
                    <span>Admin Approvals</span>
                  </button>

                  <button
                    onClick={() => setAdminSubTab('database')}
                    className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 shrink-0 ${
                      adminSubTab === 'database'
                        ? 'bg-purple-600 text-white shadow-glow-purple'
                        : 'text-purple-300 hover:text-white hover:bg-slate-800'
                    }`}
                  >
                    <Database className="w-4 h-4" />
                    <span>Database Engine</span>
                  </button>
                </>
              )}
            </div>

            {/* Sub-Tab Contents */}
            {adminSubTab === 'overview' && (
              <DashboardOverview
                onNavigateTab={(tab) => {
                  if (tab === 'visitors') {
                    setAdminSubTab('visitors');
                  } else {
                    setAdminSubTab(tab as any);
                  }
                }}
              />
            )}

            {adminSubTab === 'scanner' && (
              <SundayQRScanner />
            )}

            {adminSubTab === 'members' && (
              <MemberManagement />
            )}

            {adminSubTab === 'visitors' && (
              <VisitorManagement />
            )}

            {adminSubTab === 'attendance' && (
              <AttendanceLog />
            )}

            {adminSubTab === 'requests' && adminUser.role === 'SUPER_ADMIN' && (
              <AdminRequestsManager />
            )}

            {adminSubTab === 'database' && adminUser.role === 'SUPER_ADMIN' && (
              <DatabaseManager />
            )}

          </div>
        )}

      </main>

      {/* Footer */}
      <Footer />

      {/* MODALS */}
      {/* Registration QR Badge Modal */}
      {newRegisteredMember && (
        <QRSuccessModal
          member={newRegisteredMember}
          onClose={() => setNewRegisteredMember(null)}
        />
      )}

      {/* Admin Login Modal */}
      {showLoginModal && (
        <AdminLoginModal
          onClose={() => setShowLoginModal(false)}
          onLoginSuccess={(user) => {
            setAdminUser(user);
            setActiveTab('admin_dashboard');
            setAdminSubTab('overview');
          }}
          onRequestAccessClick={() => setShowRequestModal(true)}
        />
      )}

      {/* Admin Access Request Modal */}
      {showRequestModal && (
        <AdminRequestModal
          onClose={() => setShowRequestModal(false)}
        />
      )}

    </div>
  );
}
