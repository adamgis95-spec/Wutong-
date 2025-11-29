
import { GoogleGenAI } from "@google/genai";
import { WeeklyStats, DailyLog } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateWeeklyInsight = async (stats: WeeklyStats, logs: DailyLog[]): Promise<{
    achievements: string;
    problems: string;
    plan: string;
}> => {
  
  const prompt = `
    你是一位极度自律、理性但富有同理心的个人成长教练。
    
    这是我过去一周的数据：
    - 财务：支出 ¥${stats.totalSpend}，收入 ¥${stats.totalIncome}
    - 健康：运动 ${stats.exerciseDays} 天，平均睡眠 ${stats.avgSleep} 小时
    - 输入：阅读 ${stats.totalReadingMins} 分钟，兴趣爱好投入 ${stats.totalHobbyMins} 分钟
    - 输出（科研）：写了 ${stats.totalWords} 字，制作图表 ${stats.totalCharts} 张
    - 输出（自媒体）：合计发布/编辑 ${stats.totalSocialMedia} 篇（公众号/小红书）
    - 情绪记录：${stats.moods.join(', ')}

    这是我每天的闪念笔记：
    ${logs.map(l => `- ${l.date}: ${l.memo} (心情: ${l.mood})`).join('\n')}

    请基于以上客观数据，用中文为我起草一份结构化的周复盘。
    风格要简洁、专业、不仅指出问题，更要给出可执行的建议。

    请严格按照以下 JSON 格式返回：
    {
        "achievements": "总结本周的亮点、坚持下来的习惯和主要产出。",
        "problems": "敏锐地指出懈怠、焦虑或效率低下的模式。",
        "plan": "基于本周表现，给出下周 3 个具体的、数字化的改进目标。"
    }
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json"
      }
    });

    const text = response.text;
    if (!text) throw new Error("No response from AI");
    
    return JSON.parse(text);
  } catch (error) {
    console.error("Gemini Error:", error);
    return {
      achievements: "无法连接 AI 生成报告。但你自己记录的数据已经很棒了！",
      problems: "请检查网络连接或 API Key。",
      plan: "保持当前的记录习惯，手动制定计划。"
    };
  }
};
