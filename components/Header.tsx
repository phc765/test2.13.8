import React from 'react';

const ShieldIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-9 w-9 text-white" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2L3 5v6c0 5.55 3.84 10.74 9 12c5.16-1.26 9-6.45 9-12V5l-9-3zm0 10.99h7c-.53 4.12-3.28 7.79-7 8.92V13H5V6.3l7-3.11v9.8z"/>
    </svg>
);


export const Header: React.FC<{ onHomeClick: () => void; }> = ({ onHomeClick }) => {
  return (
    <header className="bg-white/10 backdrop-blur-lg sticky top-0 z-40 shadow-sm">
      <nav className="container mx-auto max-w-5xl px-4">
        <div className="flex items-center justify-between h-20">
          <button onClick={onHomeClick} className="flex items-center space-x-3 group">
            <ShieldIcon />
            <span className="text-xl font-bold text-white group-hover:text-slate-200 transition-colors">An Toàn Mạng</span>
          </button>
          
          <button onClick={onHomeClick} className="px-5 py-2.5 font-semibold text-white bg-white/20 rounded-lg hover:bg-white/30 focus:outline-none focus:ring-2 focus:ring-white/50 transition-all shadow-md">
            Trang chủ
          </button>
        </div>
      </nav>
    </header>
  );
};
