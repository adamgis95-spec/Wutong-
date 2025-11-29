
import { DailyLog, WeeklyReview, WeeklyStats, Mood, FinanceItem } from '../types';

const LOG_KEY = 'loop_daily_logs';
const REVIEW_KEY = 'loop_weekly_reviews';

// --- Helpers ---

const getTodayString = (): string => {
  return new Date().toISOString().split('T')[0];
};

const getWeekRange = (): { start: string; end: string; label: string } => {
  const curr = new Date();
  const day = curr.getDay(); 
  // 调整为周一开始 (周日为0，转为7，计算diff)
  const diff = curr.getDate() - day + (day === 0 ? -6 : 1); 
  const first = new Date(curr.setDate(diff));
  const last = new Date(curr.setDate(diff + 6));

  const formatDate = (d: Date) => d.toISOString().split('T')[0];
  const formatLabel = (d: Date) => `${d.getMonth() + 1}/${d.getDate()}`;

  return {
    start: formatDate(first),
    end: formatDate(last),
    label: `${formatLabel(first)} - ${formatLabel(last)}`
  };
};

// --- Data Access ---

export const getLogs = (): Record<string, DailyLog> => {
  const raw = localStorage.getItem(LOG_KEY);
  return raw ? JSON.parse(raw) : {};
};

export const getLogForDate = (date: string): DailyLog => {
  const logs = getLogs();
  if (logs[date]) {
      // 兼容旧数据结构，合并默认值
      const defaultLog = createDefaultLog(date);
      return {
          ...defaultLog,
          ...logs[date],
          // 确保 socialMedia 对象存在
          habits: {
            ...defaultLog.habits,
            ...logs[date].habits,
            socialMedia: logs[date].habits.socialMedia || { wechatCount: 0, xhsCount: 0 }
          }
      };
  }
  return createDefaultLog(date);
};

const createDefaultLog = (date: string): DailyLog => ({
    date,
    income: 0,
    finance: [],
    habits: {
      exercise: false,
      sleepHours: 7,
      readingMins: 0,
      hobbyMins: 0,
      researchWords: 0,
      researchCharts: 0,
      socialMedia: { wechatCount: 0, xhsCount: 0 }
    },
    mood: Mood.Neutral,
    memo: ''
});

export const saveLog = (log: DailyLog) => {
  const logs = getLogs();
  logs[log.date] = log;
  localStorage.setItem(LOG_KEY, JSON.stringify(logs));
};

export const getReviews = (): WeeklyReview[] => {
  const raw = localStorage.getItem(REVIEW_KEY);
  return raw ? JSON.parse(raw) : [];
};

export const saveReview = (review: WeeklyReview) => {
  const reviews = getReviews();
  const index = reviews.findIndex(r => r.id === review.id);
  if (index >= 0) {
    reviews[index] = review;
  } else {
    reviews.unshift(review); 
  }
  localStorage.setItem(REVIEW_KEY, JSON.stringify(reviews));
};

export const calculateCurrentWeekStats = (): { stats: WeeklyStats, logs: DailyLog[] } => {
  const { start, end } = getWeekRange();
  const logs = getLogs();
  const weekLogs: DailyLog[] = [];
  
  const startDate = new Date(start);
  const endDate = new Date(end);

  Object.values(logs).forEach(log => {
    const logDate = new Date(log.date);
    if (logDate >= startDate && logDate <= endDate) {
      weekLogs.push(log);
    }
  });

  const stats: WeeklyStats = {
    totalSpend: 0,
    totalIncome: 0,
    exerciseDays: 0,
    avgSleep: 0,
    totalReadingMins: 0,
    totalHobbyMins: 0,
    totalWords: 0,
    totalCharts: 0,
    totalSocialMedia: 0,
    moods: []
  };

  let sleepCount = 0;

  weekLogs.forEach(log => {
    stats.totalSpend += log.finance.reduce((acc, item) => acc + item.amount, 0);
    stats.totalIncome += (log.income || 0);
    
    if (log.habits.exercise) stats.exerciseDays += 1;
    
    if (log.habits.sleepHours > 0) {
        stats.avgSleep += log.habits.sleepHours;
        sleepCount++;
    }

    stats.totalReadingMins += log.habits.readingMins;
    stats.totalHobbyMins += (log.habits.hobbyMins || 0);
    stats.totalWords += log.habits.researchWords;
    stats.totalCharts += log.habits.researchCharts;
    
    const sm = log.habits.socialMedia || { wechatCount: 0, xhsCount: 0 };
    stats.totalSocialMedia += (sm.wechatCount + sm.xhsCount);

    if (log.mood) stats.moods.push(log.mood);
  });

  if (sleepCount > 0) stats.avgSleep = parseFloat((stats.avgSleep / sleepCount).toFixed(1));

  return { stats, logs: weekLogs };
};

export const seedDataIfEmpty = () => {
  if (localStorage.getItem(LOG_KEY)) return;

  const logs: Record<string, DailyLog> = {};
  const today = new Date();
  
  for (let i = 0; i < 7; i++) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    const dateStr = d.toISOString().split('T')[0];
    
    logs[dateStr] = {
      date: dateStr,
      income: i === 2 ? 500 : 0,
      finance: i % 2 === 0 ? [{ id: Math.random().toString(), amount: 150 + i * 10, category: '餐饮', note: '午餐' }] : [],
      habits: {
        exercise: i % 3 !== 0,
        sleepHours: 7 + (i % 2) * 0.5,
        readingMins: 30,
        hobbyMins: i === 6 ? 120 : 0,
        researchWords: i * 150,
        researchCharts: i === 2 ? 1 : 0,
        socialMedia: { wechatCount: i === 1 ? 1 : 0, xhsCount: i === 3 ? 1 : 0 }
      },
      mood: i % 2 === 0 ? Mood.Good : Mood.Tired,
      memo: i === 0 ? "开始使用 Loop 助手。" : "今天是平稳的一天。"
    };
  }
  localStorage.setItem(LOG_KEY, JSON.stringify(logs));
};
