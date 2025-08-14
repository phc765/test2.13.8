import React, { useState, useCallback } from 'react';
import { StudentInfoForm } from './StudentInfoForm';
import { QuizForm } from './QuizForm';
import { ResultDisplay } from './ResultDisplay';
import { QUIZ_QUESTIONS, SAFE_THRESHOLD, MEDIUM_THRESHOLD } from '../constants';
import { RiskLevel, StudentInfo, Submission } from '../types';

interface StudentViewProps {
    onBack: () => void;
}

export const StudentView: React.FC<StudentViewProps> = ({ onBack }) => {
    const [step, setStep] = useState<'info' | 'quiz' | 'result'>('info');
    const [studentInfo, setStudentInfo] = useState<StudentInfo | null>(null);
    const [finalScore, setFinalScore] = useState(0);
    const [riskLevel, setRiskLevel] = useState<RiskLevel>(RiskLevel.NONE);
    const [isGeneratingAdvice, setIsGeneratingAdvice] = useState(false);
    const [generatedAdvice, setGeneratedAdvice] = useState<string | null>(null);

    const handleInfoSubmit = useCallback((info: StudentInfo) => {
        setStudentInfo(info);
        setStep('quiz');
    }, []);

    const generateAdvice = async (level: RiskLevel, score: number, studentScores: Record<string, number>) => {
        if (level === RiskLevel.SAFE) {
            setGeneratedAdvice(null);
            return;
        }
        
        setIsGeneratingAdvice(true);
        setGeneratedAdvice(null);

        try {
            const apiResponse = await fetch('/api/generate-advice', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ level, score, studentScores }),
            });

            if (!apiResponse.ok) {
                const errorData = await apiResponse.json().catch(() => ({ error: 'An unknown server error occurred.' }));
                throw new Error(errorData.error || `Request failed with status ${apiResponse.status}`);
            }

            const data = await apiResponse.json();
            setGeneratedAdvice(data.advice);

        } catch (error) {
            console.error("Lỗi khi tạo lời khuyên:", error);
            const errorMessage = error instanceof Error 
                ? error.message 
                : "Rất tiếc, đã có lỗi xảy ra khi tạo lời khuyên. Vui lòng thử lại sau hoặc liên hệ giáo viên để được tư vấn trực tiếp.";
            setGeneratedAdvice(`Lỗi: ${errorMessage}`);
        } finally {
            setIsGeneratingAdvice(false);
        }
    };
    
    const handleQuizSubmit = useCallback(async (scores: Record<string, number>) => {
        if (!studentInfo) return;

        const totalScore = Object.values(scores).reduce((sum, score) => sum + score, 0);
        let level: RiskLevel;

        if (totalScore <= SAFE_THRESHOLD) {
            level = RiskLevel.SAFE;
        } else if (totalScore <= MEDIUM_THRESHOLD) {
            level = RiskLevel.MEDIUM_RISK;
        } else {
            level = RiskLevel.HIGH_RISK;
        }

        setFinalScore(totalScore);
        setRiskLevel(level);
        setStep('result');

        const newSubmission: Submission = {
            id: `sub_${new Date().getTime()}`,
            ...studentInfo,
            score: totalScore,
            riskLevel: level,
            timestamp: Date.now(),
        };

        try {
            const existingSubmissions: Submission[] = JSON.parse(localStorage.getItem('studentSubmissions') || '[]');
            localStorage.setItem('studentSubmissions', JSON.stringify([...existingSubmissions, newSubmission]));
        } catch (e) {
            console.error("Không thể lưu kết quả:", e);
        }

        await generateAdvice(level, totalScore, scores);

    }, [studentInfo]);

    const handleReset = useCallback(() => {
        setStep('info');
        setStudentInfo(null);
        setFinalScore(0);
        setRiskLevel(RiskLevel.NONE);
        setGeneratedAdvice(null);
        setIsGeneratingAdvice(false);
    }, []);

    const renderContent = () => {
        switch (step) {
            case 'info':
                return <StudentInfoForm onSubmit={handleInfoSubmit} />;
            case 'quiz':
                return (
                  <div className="bg-white/80 p-6 sm:p-10 rounded-2xl shadow-xl backdrop-blur-lg">
                    <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 text-center mb-2">Bài khảo sát An toàn mạng</h2>
                    <p className="text-center text-slate-600 mb-8">Chào mừng <span className="font-bold">{studentInfo?.name}</span>. Hãy trả lời các câu hỏi dưới đây một cách trung thực nhất nhé.</p>
                    <QuizForm questions={QUIZ_QUESTIONS} onSubmit={handleQuizSubmit} />
                  </div>
                );
            case 'result':
                return (
                    <ResultDisplay
                        level={riskLevel}
                        score={finalScore}
                        onReset={handleReset}
                        isGeneratingAdvice={isGeneratingAdvice}
                        generatedAdvice={generatedAdvice}
                    />
                );
            default:
                return null;
        }
    };

    return (
        <div>
            {renderContent()}
        </div>
    );
};