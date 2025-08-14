import React from 'react';
import { RiskLevel } from '../types';

interface ResultDisplayProps {
  level: RiskLevel;
  score: number;
  onReset: () => void;
  isGeneratingAdvice?: boolean;
  generatedAdvice?: string | null;
}

const SafeIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-20 w-20 text-teal-500" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
    </svg>
);

const MediumRiskIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-20 w-20 text-amber-500" viewBox="0 0 24 24" fill="currentColor">
      <path d="M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2V7h2v7z"/>
    </svg>
);

const HighRiskIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-20 w-20 text-red-600" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 5.99L19.53 19H4.47L12 5.99M12 2L1 21h22L12 2zm-1 14h2v2h-2zm0-6h2v4h-2z"/>
    </svg>
);

const LinkIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 inline flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M12.586 4.586a2 2 0 112.828 2.828l-3 3a2 2 0 01-2.828 0 1 1 0 00-1.414 1.414 4 4 0 005.656 0l3-3a4 4 0 00-5.656-5.656l-1.5 1.5a1 1 0 101.414 1.414l1.5-1.5zm-5 5a2 2 0 012.828 0 1 1 0 101.414-1.414 4 4 0 00-5.656 0l-3 3a4 4 0 105.656 5.656l1.5-1.5a1 1 0 10-1.414-1.414l-1.5 1.5a2 2 0 11-2.828-2.828l3-3z" clipRule="evenodd" />
    </svg>
);

const AIAdviceSection: React.FC<{
    level: RiskLevel;
    isGenerating?: boolean;
    advice?: string | null;
}> = ({ level, isGenerating, advice }) => {
    if (level === RiskLevel.SAFE) return null;

    return (
        <div className="mt-8 pt-8 border-t-2 border-dashed border-slate-300">
            <h3 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-500 mb-4 text-left">
                Lời khuyên từ Chuyên gia An toàn Mạng AI
            </h3>
            {isGenerating && (
                <div className="bg-slate-100 p-6 rounded-lg flex items-center justify-center space-x-3">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500"></div>
                    <p className="text-slate-600 font-semibold">Đang phân tích và tạo lời khuyên dành riêng cho bạn...</p>
                </div>
            )}
            {advice && (
                <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-6 rounded-lg text-left text-slate-800 space-y-3 leading-relaxed">
                    <p style={{ whiteSpace: 'pre-wrap' }}>{advice}</p>
                </div>
            )}
        </div>
    );
};


const getResultContent = (level: RiskLevel, score: number) => {
  switch (level) {
    case RiskLevel.SAFE:
      return {
        gradient: 'from-teal-50 to-green-50',
        borderColor: 'border-teal-500',
        icon: <SafeIcon />,
        title: 'Mức độ An toàn: TỐT',
        scoreText: `(0-18 điểm)`,
        message: 'Tuyệt vời! Bạn có nhận thức và hành vi rất tốt về an toàn trên không gian mạng. Hãy tiếp tục duy trì và chia sẻ những kiến thức này cho bạn bè, người thân để cùng nhau xây dựng một môi trường mạng an toàn hơn.',
        recommendations: null,
      };
    case RiskLevel.MEDIUM_RISK:
      return {
        gradient: 'from-amber-50 to-yellow-50',
        borderColor: 'border-amber-500',
        icon: <MediumRiskIcon />,
        title: 'Mức độ Rủi ro: TRUNG BÌNH',
        scoreText: `(19-36 điểm)`,
        message: 'Bạn có một vài hành vi hoặc nhận thức tiềm ẩn rủi ro. Kẻ xấu có thể lợi dụng những sơ hở này. Hãy cẩn trọng hơn và trang bị thêm kiến thức để bảo vệ bản thân tốt hơn.',
        recommendations: (
          <>
            <p className="mt-6 text-left font-bold text-slate-800">Nguồn tham khảo hữu ích:</p>
            <ul className="space-y-3 mt-4 text-left">
              <li><a href="https://tinnhiemmang.vn/" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-700 hover:underline flex items-center"><LinkIcon />Cổng không gian mạng quốc gia (Tín nhiệm mạng)</a></li>
              <li><a href="https://baochinhphu.vn/tim-kiem/an-toan-thong-tin.html" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-700 hover:underline flex items-center"><LinkIcon />Báo Chính Phủ - Chuyên mục An toàn thông tin</a></li>
            </ul>
          </>
        ),
      };
    case RiskLevel.HIGH_RISK:
      return {
        gradient: 'from-red-50 to-rose-50',
        borderColor: 'border-red-500',
        icon: <HighRiskIcon />,
        title: 'CẢNH BÁO NGUY CƠ CAO',
        scoreText: `(> 36 điểm)`,
        message: 'Bạn đang có những hành vi và nhận thức ở mức báo động, rất dễ trở thành mục tiêu của lừa đảo, dụ dỗ, hoặc các hình thức tấn công khác trên mạng.',
        recommendations: (
          <>
            <div className="mt-4 text-left bg-red-100 p-5 rounded-lg border-l-4 border-red-600">
                <p className="text-lg font-extrabold text-red-900">KHUYẾN CÁO KHẨN CẤP:</p>
                <ul className="mt-2 list-disc list-inside space-y-2 text-red-800 font-semibold">
                  <li><span className="font-bold">TUYỆT ĐỐI</span> không thực hiện bất kỳ yêu cầu chuyển tiền hoặc cung cấp thêm thông tin cá nhân nào.</li>
                  <li><span className="font-bold">KHÔNG</span> tin vào các lời đe dọa qua điện thoại, tin nhắn.</li>
                  <li><span className="font-bold">LIÊN HỆ NGAY LẬP TỨC</span> với người thân tin cậy và báo cho cơ quan Công an gần nhất để được hỗ trợ.</li>
                </ul>
            </div>
             <p className="mt-6 text-left font-bold text-slate-800">Xem cảnh báo chính thức và tìm hiểu các chiêu thức lừa đảo tại:</p>
            <ul className="space-y-3 mt-2 text-left">
                <li><a href="https://bocongan.gov.vn/tim-kiem/tag/canh-bao-toi-pham.html" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-700 hover:underline flex items-center"><LinkIcon />Cổng thông tin điện tử Bộ Công An</a></li>
                 <li><a href="https://chongluadao.vn/" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-700 hover:underline flex items-center"><LinkIcon />Dự án Chống Lừa Đảo (Anti-Phishing)</a></li>
            </ul>
          </>
        ),
      };
    default:
      return null;
  }
};

export const ResultDisplay: React.FC<ResultDisplayProps> = ({ level, score, onReset, isGeneratingAdvice, generatedAdvice }) => {
  const content = getResultContent(level, score);

  if (!content) return null;

  return (
    <div className={`text-center p-6 sm:p-10 rounded-2xl border-2 shadow-2xl bg-gradient-to-br ${content.gradient} ${content.borderColor}`}>
      <div className="flex justify-center mb-4">{content.icon}</div>
      <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900">{content.title}</h2>
      <p className="mt-1 font-semibold text-slate-600">Điểm số của bạn: {score} <span className="text-slate-500">{content.scoreText}</span></p>
      <p className="mt-4 text-slate-700 max-w-3xl mx-auto text-lg leading-relaxed">{content.message}</p>
      
      {content.recommendations && <div className="mt-6 max-w-2xl mx-auto">{content.recommendations}</div>}
      
      <AIAdviceSection level={level} isGenerating={isGeneratingAdvice} advice={generatedAdvice} />
      
      <div className="mt-10">
        <button
            onClick={onReset}
            className="px-8 py-3.5 font-bold text-white bg-gradient-to-r from-purple-600 to-pink-500 rounded-lg shadow-lg hover:from-purple-700 hover:to-pink-600 focus:outline-none focus:ring-4 focus:ring-purple-300 transition-all transform hover:scale-105"
        >
            Làm lại bài khảo sát
        </button>
      </div>
    </div>
  );
};