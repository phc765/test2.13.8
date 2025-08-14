import React, { useState, useEffect, useMemo } from 'react';
import { Submission, RiskLevel } from '../types';
import { TEACHER_PASSWORD } from '../constants';
import * as XLSX from 'xlsx';

interface TeacherViewProps {
    onLogout: () => void;
}

const getRiskLevelInfo = (level: RiskLevel) => {
    switch(level) {
        case RiskLevel.SAFE: return { text: 'An Toàn', color: 'bg-teal-500', textColor: 'text-teal-800' };
        case RiskLevel.MEDIUM_RISK: return { text: 'Rủi ro TB', color: 'bg-amber-500', textColor: 'text-amber-800' };
        case RiskLevel.HIGH_RISK: return { text: 'Rủi ro Cao', color: 'bg-red-500', textColor: 'text-red-800' };
        default: return { text: 'Không xác định', color: 'bg-slate-400', textColor: 'text-slate-800' };
    }
};

const DashboardChart: React.FC<{ data: Submission[] }> = ({ data }) => {
    const chartData = useMemo(() => {
        const counts = {
            [RiskLevel.SAFE]: 0,
            [RiskLevel.MEDIUM_RISK]: 0,
            [RiskLevel.HIGH_RISK]: 0,
        };
        data.forEach(sub => {
            if (sub.riskLevel in counts) {
                counts[sub.riskLevel]++;
            }
        });
        const total = data.length || 1;
        return [
            { level: RiskLevel.SAFE, count: counts[RiskLevel.SAFE], percentage: (counts[RiskLevel.SAFE] / total) * 100 },
            { level: RiskLevel.MEDIUM_RISK, count: counts[RiskLevel.MEDIUM_RISK], percentage: (counts[RiskLevel.MEDIUM_RISK] / total) * 100 },
            { level: RiskLevel.HIGH_RISK, count: counts[RiskLevel.HIGH_RISK], percentage: (counts[RiskLevel.HIGH_RISK] / total) * 100 },
        ];
    }, [data]);

    return (
        <div className="bg-white/80 p-6 rounded-2xl shadow-lg backdrop-blur-lg">
            <h3 className="text-xl font-bold text-slate-800 mb-4">Thống kê chung</h3>
            <div className="flex space-x-4 items-end h-48">
                {chartData.map(item => (
                    <div key={item.level} className="flex-1 flex flex-col items-center justify-end">
                        <div className="font-bold text-slate-700 text-lg">{item.count}</div>
                        <div 
                            className={`w-full rounded-t-lg transition-all duration-500 ${getRiskLevelInfo(item.level).color}`}
                            style={{ height: `${item.percentage}%` }}
                            title={`${getRiskLevelInfo(item.level).text}: ${item.count} học sinh (${item.percentage.toFixed(1)}%)`}
                        ></div>
                        <div className={`mt-2 text-sm font-semibold ${getRiskLevelInfo(item.level).textColor}`}>{getRiskLevelInfo(item.level).text}</div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export const TeacherView: React.FC<TeacherViewProps> = ({ onLogout }) => {
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [allSubmissions, setAllSubmissions] = useState<Submission[]>([]);

    useEffect(() => {
        try {
            const data = JSON.parse(localStorage.getItem('studentSubmissions') || '[]');
            setAllSubmissions(data.sort((a, b) => b.timestamp - a.timestamp));
        } catch (e) {
            console.error("Failed to load submissions from localStorage:", e);
            setAllSubmissions([]);
        }
    }, []);

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (password === TEACHER_PASSWORD) {
            setIsAuthenticated(true);
        } else {
            setError('Mật khẩu không chính xác.');
        }
    };
    
    const handleExport = () => {
        const dataToExport = allSubmissions.map(sub => ({
            'Họ và Tên': sub.name,
            'Lớp': sub.className,
            'Trường': sub.school,
            'Tỉnh thành': sub.province,
            'Điểm số': sub.score,
            'Mức độ Rủi ro': getRiskLevelInfo(sub.riskLevel).text,
            'Thời gian nộp': new Date(sub.timestamp).toLocaleString('vi-VN'),
        }));

        const worksheet = XLSX.utils.json_to_sheet(dataToExport);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Kết quả khảo sát");
        XLSX.writeFile(workbook, "KetQuaKhaoSat_AnToanMang.xlsx");
    };

    if (!isAuthenticated) {
        return (
            <div className="bg-white/80 p-8 rounded-2xl shadow-xl backdrop-blur-lg max-w-md mx-auto text-center">
                <h2 className="text-2xl font-bold text-slate-900">Truy cập Dashboard Giáo viên</h2>
                <p className="text-slate-600 mt-2 mb-6">Vui lòng nhập mật khẩu để tiếp tục.</p>
                <form onSubmit={handleLogin} className="space-y-4">
                     <div>
                        <label htmlFor="password"  className="block text-sm font-medium text-slate-700 mb-1 text-left">Mật khẩu</label>
                        <input
                            type="password"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full p-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-center"
                            placeholder="••••••••••"
                            autoFocus
                        />
                    </div>
                    {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
                    <button type="submit" className="w-full mt-4 py-3 font-bold text-white bg-gradient-to-r from-indigo-500 to-sky-500 rounded-lg shadow-lg hover:from-indigo-600 hover:to-sky-600 focus:outline-none focus:ring-4 focus:ring-indigo-300 transition-all">
                        Xác nhận
                    </button>
                </form>
            </div>
        );
    }

    return (
        <div className="space-y-8">
            <div className="bg-white/60 backdrop-blur-xl p-6 rounded-2xl shadow-lg flex flex-col sm:flex-row items-center justify-between gap-4">
                <div>
                    <h2 className="text-3xl font-bold text-slate-900">Dashboard Giáo viên</h2>
                    <p className="text-slate-600 mt-1">Tổng cộng {allSubmissions.length} bài khảo sát đã được thực hiện.</p>
                </div>
                <div className="flex gap-4">
                    <button onClick={handleExport} disabled={allSubmissions.length === 0} className="px-5 py-2.5 font-semibold text-white bg-gradient-to-r from-green-500 to-teal-500 rounded-lg shadow-md hover:from-green-600 hover:to-teal-600 transition-all disabled:from-slate-400 disabled:to-slate-500 disabled:cursor-not-allowed">
                        Xuất Excel
                    </button>
                    <button onClick={onLogout} className="px-5 py-2.5 font-semibold text-slate-800 bg-slate-200/80 rounded-lg hover:bg-slate-300/80 transition-all">
                        Đăng xuất
                    </button>
                </div>
            </div>

            <DashboardChart data={allSubmissions} />
            
            <div className="bg-white/80 p-6 rounded-2xl shadow-lg backdrop-blur-lg">
                <h3 className="text-xl font-bold text-slate-800 mb-4">Chi tiết các bài khảo sát</h3>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="border-b-2 border-slate-300">
                            <tr>
                                <th className="p-3">Họ và Tên</th>
                                <th className="p-3">Lớp</th>
                                <th className="p-3">Trường</th>
                                <th className="p-3">Tỉnh thành</th>
                                <th className="p-3 text-center">Điểm</th>
                                <th className="p-3">Mức độ</th>
                                <th className="p-3">Thời gian</th>
                            </tr>
                        </thead>
                        <tbody>
                            {allSubmissions.map(sub => (
                                <tr key={sub.id} className="border-b border-slate-200 hover:bg-slate-50/50">
                                    <td className="p-3 font-semibold">{sub.name}</td>
                                    <td className="p-3">{sub.className}</td>
                                    <td className="p-3">{sub.school}</td>
                                    <td className="p-3">{sub.province}</td>
                                    <td className="p-3 text-center font-bold">{sub.score}</td>
                                    <td className="p-3">
                                        <span className={`px-3 py-1 text-sm font-bold rounded-full text-white ${getRiskLevelInfo(sub.riskLevel).color}`}>
                                            {getRiskLevelInfo(sub.riskLevel).text}
                                        </span>
                                    </td>
                                    <td className="p-3 text-sm text-slate-600">{new Date(sub.timestamp).toLocaleString('vi-VN')}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {allSubmissions.length === 0 && (
                        <p className="text-center py-8 text-slate-500">Chưa có dữ liệu khảo sát nào.</p>
                    )}
                </div>
            </div>
        </div>
    );
};