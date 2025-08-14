import React from 'react';

interface LandingPageProps {
  onSelectRole: (role: 'student' | 'teacher') => void;
}

const StudentIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-40 w-auto mb-4 object-contain transition-transform duration-300 group-hover:scale-110 text-slate-700 group-hover:text-purple-600" viewBox="0 0 24 24" fill="currentColor">
        <path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z"/>
    </svg>
);

const TeacherIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-40 w-auto mb-4 object-contain transition-transform duration-300 group-hover:scale-110 text-slate-700 group-hover:text-indigo-600" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
    </svg>
);

export const LandingPage: React.FC<LandingPageProps> = ({ onSelectRole }) => {
  return (
    <div className="text-center">
        <h1 className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight drop-shadow-lg">Hệ thống Khảo sát & Cảnh báo An toàn Mạng</h1>
        <p className="mt-4 text-white/90 max-w-3xl mx-auto text-xl leading-relaxed drop-shadow-sm">Chọn vai trò của bạn để bắt đầu.</p>
        
        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Student Card */}
            <div className="bg-white/50 backdrop-blur-xl p-8 rounded-2xl shadow-lg border border-white/20 hover:shadow-2xl hover:scale-[1.03] transition-all duration-300">
                <button onClick={() => onSelectRole('student')} className="w-full h-full flex flex-col items-center justify-center text-center group">
                    <StudentIcon />
                    <h2 className="text-3xl font-bold text-slate-800">Dành cho Học sinh</h2>
                    <p className="mt-3 text-slate-600 text-base">Thực hiện bài khảo sát để đánh giá mức độ an toàn của bạn trên không gian mạng.</p>
                    <span className="mt-6 inline-block font-bold text-white bg-gradient-to-r from-purple-500 to-pink-500 px-8 py-3 rounded-lg shadow-md group-hover:scale-105 transition-transform">Bắt đầu ngay</span>
                </button>
            </div>
            {/* Teacher Card */}
            <div className="bg-white/50 backdrop-blur-xl p-8 rounded-2xl shadow-lg border border-white/20 hover:shadow-2xl hover:scale-[1.03] transition-all duration-300">
                <button onClick={() => onSelectRole('teacher')} className="w-full h-full flex flex-col items-center justify-center text-center group">
                    <TeacherIcon />
                    <h2 className="text-3xl font-bold text-slate-800">Dành cho Giáo viên</h2>
                    <p className="mt-3 text-slate-600 text-base">Xem thống kê, phân tích kết quả và quản lý dữ liệu khảo sát của học sinh.</p>
                    <span className="mt-6 inline-block font-bold text-white bg-gradient-to-r from-indigo-500 to-sky-500 px-8 py-3 rounded-lg shadow-md group-hover:scale-105 transition-transform">Truy cập Dashboard</span>
                </button>
            </div>
        </div>
    </div>
  );
};