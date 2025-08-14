import { GoogleGenAI } from '@google/genai';
// Vercel's build system will bundle these local dependencies for the serverless function.
import { QUIZ_QUESTIONS } from '../constants';
import { RiskLevel } from '../types';

// The Edge runtime is faster and more cost-effective for this type of task.
export const config = {
  runtime: 'edge',
};

export default async function handler(request: Request) {
    if (request.method !== 'POST') {
        return new Response(JSON.stringify({ message: 'Method Not Allowed' }), {
            status: 405,
            headers: { 'Content-Type': 'application/json' },
        });
    }

    try {
        const { level, score, studentScores } = await request.json();

        const apiKey = process.env.GEMINI_API_KEY;
        if (!apiKey) {
            console.error('GEMINI_API_KEY environment variable is not set.');
            return new Response(JSON.stringify({ error: 'Server configuration error: API key is missing. Please contact the administrator.' }), {
                status: 500,
                headers: { 'Content-Type': 'application/json' },
            });
        }
        
        const ai = new GoogleGenAI({ apiKey });

        const riskyAnswersDetail = QUIZ_QUESTIONS
            .filter(q => (studentScores[q.id] || 0) > 0)
            .map(q => {
                const questionScore = studentScores[q.id];
                const chosenOption = q.options.find(opt => opt.score === questionScore);
                const answerText = chosenOption ? chosenOption.text : "Không rõ";
                return `- Câu hỏi: "${q.text}"\n  - Trả lời: "${answerText}" (Điểm rủi ro: ${questionScore})`;
            }).join('\n\n');

        const prompt = `
Một học sinh vừa hoàn thành bài khảo sát về an toàn mạng và có kết quả sau:
- Mức độ rủi ro: ${level === RiskLevel.MEDIUM_RISK ? 'TRUNG BÌNH' : 'CAO'}.
- Tổng điểm: ${score} (càng cao càng rủi ro).
- Chi tiết các câu trả lời tiềm ẩn rủi ro:
${riskyAnswersDetail}

Dựa vào thông tin trên, hãy đóng vai một chuyên gia an toàn mạng và đưa ra lời khuyên cụ thể, cá nhân hóa, và mang tính xây dựng cho học sinh này bằng tiếng Việt.
Lời khuyên cần:
1. Giải thích ngắn gọn tại sao các câu trả lời của họ lại tiềm ẩn rủi ro.
2. Đưa ra các bước hành động cụ thể, dễ hiểu mà học sinh có thể áp dụng ngay để cải thiện.
3. Sử dụng ngôn ngữ thân thiện, động viên, không phán xét.
4. Cấu trúc rõ ràng, chuyên nghiệp, dùng gạch đầu dòng hoặc đánh số.
5. Đi thẳng vào vấn đề, không cần lời chào hỏi. Bắt đầu bằng một câu tóm tắt về tình hình của học sinh.`;

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
        });
        
        const advice = response.text;

        return new Response(JSON.stringify({ advice }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
        });

    } catch (error) {
        console.error("Error in /api/generate-advice:", error);
        return new Response(JSON.stringify({ error: 'An unexpected error occurred while generating advice.' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
        });
    }
}
