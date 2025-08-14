import React, { useState, useEffect, useMemo } from 'react';
import type { Question } from '../types';

interface QuizFormProps {
  questions: Question[];
  onSubmit: (scores: Record<string, number>) => void;
}

const RadioIcon = ({ checked }: { checked: boolean }) => (
    <div className="h-6 w-6 mr-4 flex-shrink-0 flex items-center justify-center">
        <div className={`w-5 h-5 rounded-full border-2 transition-all duration-200 ${checked ? 'border-purple-600 bg-purple-600' : 'border-slate-300 bg-white'}`}>
            {checked && <div className="w-full h-full rounded-full border-2 border-white transform scale-75 transition-transform"></div>}
        </div>
    </div>
);

export const QuizForm: React.FC<QuizFormProps> = ({ questions, onSubmit }) => {
  const [answers, setAnswers] = useState<Record<string, number | null>>({});

  const groupedQuestions = useMemo(() => {
    return questions.reduce((acc, q) => {
      const section = q.section;
      if (!acc[section]) {
        acc[section] = [];
      }
      acc[section].push(q);
      return acc;
    }, {} as Record<string, Question[]>);
  }, [questions]);

  useEffect(() => {
    const initialAnswers = questions.reduce((acc, q) => {
      acc[q.id] = null;
      return acc;
    }, {} as Record<string, null>);
    setAnswers(initialAnswers);
  }, [questions]);
  
  const allQuestionsAnswered = Object.values(answers).every(answer => answer !== null) && Object.keys(answers).length === questions.length;

  const handleAnswerChange = (questionId: string, optionIndex: number) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: optionIndex,
    }));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!allQuestionsAnswered) {
        alert("Vui lòng trả lời tất cả các câu hỏi để nhận được kết quả chính xác nhất.");
        return;
    }

    const scores: Record<string, number> = {};
    for (const q of questions) {
        const selectedOptionIndex = answers[q.id];
        if (selectedOptionIndex !== null) {
            scores[q.id] = q.options[selectedOptionIndex].score;
        }
    }
    onSubmit(scores);
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="space-y-12">
        {Object.entries(groupedQuestions).map(([section, sectionQuestions], index) => (
          <div key={section}>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mb-6 pb-3 border-b-2 border-purple-500">
              {section}
            </h2>
            <div className="space-y-8">
              {sectionQuestions.map((q) => (
                <fieldset key={q.id}>
                  <legend className="text-lg font-bold text-slate-800 mb-4">
                      <span className="text-purple-700">Câu hỏi {questions.findIndex(item => item.id === q.id) + 1}:</span> {q.text}
                  </legend>
                  <div className="space-y-4">
                    {q.options.map((opt, optIndex) => {
                      const isSelected = answers[q.id] === optIndex;
                      return (
                        <label
                          key={optIndex}
                          className={`flex items-start p-4 border rounded-xl cursor-pointer transition-all duration-200 shadow-sm ${
                            isSelected
                              ? 'bg-purple-50 border-purple-500 shadow-lg scale-[1.03]'
                              : 'bg-white border-slate-200 hover:border-purple-400 hover:bg-purple-50/50'
                          }`}
                        >
                          <input
                            type="radio"
                            name={q.id}
                            checked={isSelected}
                            onChange={() => handleAnswerChange(q.id, optIndex)}
                            className="hidden"
                          />
                          <RadioIcon checked={isSelected} />
                          <span className={`flex-grow text-base ${isSelected ? 'text-purple-900 font-semibold' : 'text-slate-700'}`}>
                            {opt.text}
                          </span>
                        </label>
                      );
                    })}
                  </div>
                </fieldset>
              ))}
            </div>
          </div>
        ))}
      </div>
      <div className="mt-12 flex justify-center">
         <button
            type="submit"
            disabled={!allQuestionsAnswered}
            className="w-full sm:w-auto inline-flex items-center justify-center px-12 py-4 font-bold text-white bg-gradient-to-r from-purple-600 to-pink-500 rounded-lg shadow-lg hover:from-purple-700 hover:to-pink-600 focus:outline-none focus:ring-4 focus:ring-purple-300 transition-all transform hover:scale-105 disabled:from-slate-400 disabled:to-slate-500 disabled:cursor-not-allowed disabled:scale-100 disabled:shadow-none"
        >
            Xem Kết Quả Đánh Giá
        </button>
      </div>
    </form>
  );
};