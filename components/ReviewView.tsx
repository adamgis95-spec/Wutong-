
import React, { useState, useEffect } from 'react';
import { calculateCurrentWeekStats, getReviews, saveReview } from '../services/storage';
import { generateWeeklyInsight } from '../services/gemini';
import { WeeklyReview } from '../types';
import { Sparkles, Save, History, ChevronRight } from 'lucide-react';

export const ReviewView: React.FC = () => {
  const [view, setView] = useState<'list' | 'create'>('list');
  const [history, setHistory] = useState<WeeklyReview[]>([]);
  const [loading, setLoading] = useState(false);
  
  // Create State
  const [currentWeekData, setCurrentWeekData] = useState(calculateCurrentWeekStats());
  const [reflection, setReflection] = useState({
    achievements: '',
    problems: '',
    nextWeekPlan: ''
  });

  useEffect(() => {
    setHistory(getReviews());
    setCurrentWeekData(calculateCurrentWeekStats());
  }, [view]);

  const handleGenerateAI = async () => {
    setLoading(true);
    const insight = await generateWeeklyInsight(currentWeekData.stats, currentWeekData.logs);
    setReflection({
        achievements: insight.achievements,
        problems: insight.problems,
        nextWeekPlan: insight.plan
    });
    setLoading(false);
  };

  const handleSaveReview = () => {
    if (!reflection.achievements) return;
    
    const newReview: WeeklyReview = {
        id: Date.now().toString(),
        weekRange: currentWeekData.stats.totalSpend >= 0 ? "本周" : "本周", // Simplified
        statsSnapshot: currentWeekData.stats,
        reflection: reflection,
        createdAt: Date.now()
    };
    saveReview(newReview);
    setView('list');
  };

  if (view === 'list') {
    return (
        <div className="max-w-4xl mx-auto space-y-6 pb-12">
            <div className="flex justify-between items-center bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                <div>
                    <h2 className="text-2xl font-bold text-gray-800">周复盘档案</h2>
                    <p className="text-gray-500 text-sm mt-1">记录思考的轨迹</p>
                </div>
                <button 
                    onClick={() => setView('create')}
                    className="bg-gray-900 text-white px-6 py-3 rounded-xl text-sm font-bold hover:bg-gray-800 transition-all transform hover:scale-105 shadow-lg"
                >
                    开始本周复盘
                </button>
            </div>

            {history.length === 0 ? (
                <div className="text-center py-20 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
                    <History className="mx-auto text-gray-300 mb-4" size={48} />
                    <p className="text-gray-500 font-medium">暂无记录，开启你的第一次复盘吧！</p>
                </div>
            ) : (
                <div className="grid gap-6">
                    {history.map(review => (
                        <div key={review.id} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                            <div className="flex justify-between items-start mb-6 pb-4 border-b border-gray-50">
                                <div>
                                    <h3 className="font-bold text-lg text-gray-800">{new Date(review.createdAt).toLocaleDateString('zh-CN')} 周复盘</h3>
                                    <div className="flex gap-3 mt-2 text-xs text-gray-400">
                                        <span>支出 ¥{review.statsSnapshot.totalSpend}</span>
                                        <span>•</span>
                                        <span>运动 {review.statsSnapshot.exerciseDays} 天</span>
                                        <span>•</span>
                                        <span>产出 {review.statsSnapshot.totalWords} 字</span>
                                    </div>
                                </div>
                            </div>
                            <div className="space-y-4 text-sm">
                                <div>
                                    <span className="text-emerald-600 font-bold bg-emerald-50 px-2 py-1 rounded mb-2 inline-block">🏆 本周成就</span>
                                    <p className="text-gray-600 leading-relaxed">{review.reflection.achievements}</p>
                                </div>
                                <div>
                                    <span className="text-amber-600 font-bold bg-amber-50 px-2 py-1 rounded mb-2 inline-block">⚠️ 问题与挑战</span>
                                    <p className="text-gray-600 leading-relaxed">{review.reflection.problems}</p>
                                </div>
                                <div>
                                     <span className="text-indigo-600 font-bold bg-indigo-50 px-2 py-1 rounded mb-2 inline-block">🚀 下周计划</span>
                                     <p className="text-gray-600 leading-relaxed">{review.reflection.nextWeekPlan}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6 pb-12 animate-in fade-in duration-300">
        <button onClick={() => setView('list')} className="text-sm text-gray-500 hover:text-gray-800 flex items-center gap-1 mb-4">
            ← 返回列表
        </button>

        <div className="bg-gradient-to-r from-indigo-600 to-purple-700 p-8 rounded-2xl text-white shadow-xl">
            <h2 className="text-3xl font-bold mb-3">深度复盘</h2>
            <p className="opacity-90 text-indigo-100">暂停脚步，为了更好地出发。系统已为您汇总本周数据。</p>
            
            <div className="mt-8 grid grid-cols-4 gap-4 text-center bg-white/10 p-4 rounded-xl backdrop-blur-sm border border-white/10">
                <div>
                    <span className="opacity-70 block text-xs uppercase mb-1">支出</span>
                    <span className="font-bold text-lg">¥{currentWeekData.stats.totalSpend}</span>
                </div>
                 <div>
                    <span className="opacity-70 block text-xs uppercase mb-1">收入</span>
                    <span className="font-bold text-lg">¥{currentWeekData.stats.totalIncome}</span>
                </div>
                <div>
                    <span className="opacity-70 block text-xs uppercase mb-1">自媒体</span>
                    <span className="font-bold text-lg">{currentWeekData.stats.totalSocialMedia}</span>
                </div>
                <div>
                    <span className="opacity-70 block text-xs uppercase mb-1">阅读</span>
                    <span className="font-bold text-lg">{currentWeekData.stats.totalReadingMins}m</span>
                </div>
            </div>
        </div>

        {/* AI Helper */}
        <div className="flex justify-end">
            <button 
                onClick={handleGenerateAI}
                disabled={loading}
                className="group flex items-center gap-2 bg-white text-gray-800 border border-gray-200 px-5 py-3 rounded-xl font-bold shadow-sm hover:shadow-md hover:border-emerald-200 hover:text-emerald-700 transition-all disabled:opacity-50"
            >
                <Sparkles size={18} className={loading ? "animate-spin" : "text-emerald-500"} />
                {loading ? 'AI 正在思考中...' : 'AI 辅助生成总结'}
            </button>
        </div>

        {/* Form */}
        <div className="space-y-6">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 transition-colors focus-within:border-indigo-300 focus-within:ring-4 focus-within:ring-indigo-50">
                <label className="block text-sm font-bold text-gray-800 mb-3 flex items-center gap-2">
                    🏆 本周成就与高光
                    <span className="text-xs font-normal text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">做到了什么？</span>
                </label>
                <textarea 
                    value={reflection.achievements}
                    onChange={e => setReflection({...reflection, achievements: e.target.value})}
                    className="w-full h-32 p-4 bg-gray-50 rounded-xl border-none focus:ring-0 text-gray-700 leading-relaxed resize-none"
                    placeholder="例如：完成了3篇论文阅读，坚持运动了4天..."
                />
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 transition-colors focus-within:border-amber-300 focus-within:ring-4 focus-within:ring-amber-50">
                <label className="block text-sm font-bold text-gray-800 mb-3 flex items-center gap-2">
                    ⚠️ 问题与反思
                    <span className="text-xs font-normal text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">哪里做的不够好？</span>
                </label>
                <textarea 
                    value={reflection.problems}
                    onChange={e => setReflection({...reflection, problems: e.target.value})}
                    className="w-full h-32 p-4 bg-gray-50 rounded-xl border-none focus:ring-0 text-gray-700 leading-relaxed resize-none"
                    placeholder="例如：周三刷视频熬夜了，导致周四效率极低..."
                />
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 transition-colors focus-within:border-blue-300 focus-within:ring-4 focus-within:ring-blue-50">
                <label className="block text-sm font-bold text-gray-800 mb-3 flex items-center gap-2">
                    🚀 下周行动计划
                    <span className="text-xs font-normal text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">3个具体目标</span>
                </label>
                <textarea 
                    value={reflection.nextWeekPlan}
                    onChange={e => setReflection({...reflection, nextWeekPlan: e.target.value})}
                    className="w-full h-32 p-4 bg-gray-50 rounded-xl border-none focus:ring-0 text-gray-700 leading-relaxed resize-none"
                    placeholder="1. 完成初稿撰写 2. 跑步3次 3. ..."
                />
            </div>
        </div>

        <button 
            onClick={handleSaveReview}
            className="w-full bg-gray-900 text-white font-bold py-4 rounded-xl shadow-lg hover:bg-black transition-colors flex items-center justify-center gap-2"
        >
            <Save size={20} /> 完成复盘并归档
        </button>
    </div>
  );
};
