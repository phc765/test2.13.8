import React, { useState, useCallback } from 'react';
import { Header } from './components/Header';
import { LandingPage } from './components/LandingPage';
import { StudentView } from './components/StudentView';
import { TeacherView } from './components/TeacherView';
import { UserRole } from './types';

function App() {
  const [userRole, setUserRole] = useState<UserRole>(null);
  
  const handleSelectRole = useCallback((role: 'student' | 'teacher') => {
    setUserRole(role);
  }, []);
  
  const handleGoHome = useCallback(() => {
    setUserRole(null);
  }, []);

  const renderContent = () => {
    switch (userRole) {
      case 'student':
        return <StudentView onBack={handleGoHome} />;
      case 'teacher':
        return <TeacherView onLogout={handleGoHome} />;
      default:
        return <LandingPage onSelectRole={handleSelectRole} />;
    }
  };

  return (
    <div className="min-h-screen bg-transparent text-slate-800 antialiased">
      <Header onHomeClick={handleGoHome} />
      <main className="container mx-auto max-w-5xl px-4 py-8 sm:py-12">
        {renderContent()}
      </main>
      <footer className="text-center py-6 text-sm text-white/70 font-medium">
        <p>&copy; {new Date().getFullYear()} An Toàn Mạng. Một dự án cộng đồng vì không gian mạng an toàn hơn.</p>
      </footer>
    </div>
  );
}

export default App;
