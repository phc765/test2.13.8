import React, { useState } from 'react';
import { StudentInfo } from '../types';

interface StudentInfoFormProps {
    onSubmit: (info: StudentInfo) => void;
}

export const StudentInfoForm: React.FC<StudentInfoFormProps> = ({ onSubmit }) => {
    const [name, setName] = useState('');
    const [className, setClassName] = useState('');
    const [school, setSchool] = useState('');
    const [province, setProvince] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (name.trim() && className.trim() && school.trim() && province.trim()) {
            onSubmit({ name, className, school, province });
        } else {
            alert('Vui lòng điền đầy đủ thông tin.');
        }
    };
    
    return (
        <div className="bg-white/80 p-6 sm:p-10 rounded-2xl shadow-xl backdrop-blur-lg max-w-xl mx-auto">
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 text-center">Thông tin Học sinh</h2>
            <p className="text-center text-slate-600 mt-2 mb-8">Vui lòng điền thông tin để bắt đầu bài khảo sát. Thông tin này sẽ được sử dụng cho mục đích thống kê và đưa ra lời khuyên phù hợp.</p>
            <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                    <label htmlFor="name" className="block text-sm font-medium text-slate-700 mb-1">Họ và Tên</label>
                    <input
                        type="text"
                        id="name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Ví dụ: Nguyễn Văn A"
                        className="w-full p-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                        required
                    />
                </div>
                <div>
                    <label htmlFor="className" className="block text-sm font-medium text-slate-700 mb-1">Lớp</label>
                    <input
                        type="text"
                        id="className"
                        value={className}
                        onChange={(e) => setClassName(e.target.value)}
                        placeholder="Ví dụ: 10A1"
                        className="w-full p-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                        required
                    />
                </div>
                <div>
                    <label htmlFor="school" className="block text-sm font-medium text-slate-700 mb-1">Trường</label>
                    <input
                        type="text"
                        id="school"
                        value={school}
                        onChange={(e) => setSchool(e.target.value)}
                        placeholder="Ví dụ: THPT Chuyên Khoa học Tự nhiên"
                        className="w-full p-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                        required
                    />
                </div>
                <div>
                    <label htmlFor="province" className="block text-sm font-medium text-slate-700 mb-1">Tỉnh thành</label>
                    <input
                        type="text"
                        id="province"
                        value={province}
                        onChange={(e) => setProvince(e.target.value)}
                        placeholder="Ví dụ: Hà Nội"
                        className="w-full p-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                        required
                    />
                </div>
                <div className="pt-4">
                    <button
                        type="submit"
                        className="w-full py-3.5 font-bold text-white bg-gradient-to-r from-purple-600 to-pink-500 rounded-lg shadow-lg hover:from-purple-700 hover:to-pink-600 focus:outline-none focus:ring-4 focus:ring-purple-300 transition-all transform hover:scale-105"
                    >
                        Bắt đầu Khảo sát
                    </button>
                </div>
            </form>
        </div>
    );
}