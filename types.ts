
export enum Mood {
  Great = 'Great',
  Good = 'Good',
  Neutral = 'Neutral',
  Anxious = 'Anxious',
  Tired = 'Tired'
}

export const MoodLabels: Record<Mood, string> = {
  [Mood.Great]: '状态极佳',
  [Mood.Good]: '不错',
  [Mood.Neutral]: '平淡',
  [Mood.Anxious]: '焦虑',
  [Mood.Tired]: '疲惫'
};

export interface FinanceItem {
  id: string;
  amount: number;
  category: '餐饮' | '购物' | '交通' | '固定' | '其他';
  note: string;
}

export interface DailyLog {
  date: string; // YYYY-MM-DD
  income: number; // 新增：今日收入
  finance: FinanceItem[];
  habits: {
    exercise: boolean; // 是否运动
    sleepHours: number; // 新增：睡眠时长
    readingMins: number; // 阅读时长
    hobbyMins: number; // 新增：兴趣时长
    researchWords: number; // 科研产出字数
    researchCharts: number; // 科研制图数
    socialMedia: { // 新增：自媒体运营
        wechatCount: number; // 公众号发布/编辑数
        xhsCount: number; // 小红书发布/编辑数
    };
  };
  mood: Mood;
  memo: string; // 闪念笔记
}

export interface WeeklyStats {
  totalSpend: number;
  totalIncome: number; // 新增
  exerciseDays: number;
  avgSleep: number; // 新增
  totalReadingMins: number;
  totalHobbyMins: number; // 新增
  totalWords: number;
  totalCharts: number;
  totalSocialMedia: number; // 新增：自媒体总产出
  moods: string[];
}

export interface WeeklyReview {
  id: string;
  weekRange: string; 
  statsSnapshot: WeeklyStats;
  reflection: {
    achievements: string;
    problems: string;
    nextWeekPlan: string;
  };
  createdAt: number;
}
