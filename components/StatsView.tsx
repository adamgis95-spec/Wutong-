
import React from 'react';
import { calculateCurrentWeekStats, getLogs } from '../services/storage';
import { BarChart, Bar, XAxis, Tooltip, ResponsiveContainer, LineChart, Line, CartesianGrid, AreaChart, Area } from 'recharts';

export const StatsView: React.FC = () => {
  const { stats } = calculateCurrentWeekStats();
  const allLogs = getLogs();
  
  // Transform logs for charts (Last 7 days)
  const chartData = Object.values(allLogs)
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .slice(-7)
    .map(log => {
        const sm = log.habits.socialMedia || { wechatCount: 0, xhsCount: 0 };
        return {
            date: new Date(log.date).toLocaleDateString('zh-CN', { month: 'numeric', day: 'numeric' }),
            spending: log.finance.reduce((acc, item) => acc + item.amount, 0),
            income: log.income || 0,
            words: log.habits.researchWords,
            reading: log.habits.readingMins,
            social: sm.wechatCount + sm.xhsCount,
            sleep: log.habits.sleepHours
        };
    });

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-12 animate-in fade-in duration-500">
      <div className="flex justify-between items-end mb-4">
        <h2 className="text-2xl font-bold text-gray-800">本周数据看板</h2>
        <span className="text-sm text-gray-500">实时更新</span>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-4 gap-4">
        {/* Finance */}
        <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex flex-col justify-between h-32 relative overflow-hidden group">
            <div className="absolute right-0 top-0 opacity-5 group-hover:opacity-10 transition-opacity p-2">
                <span className="text-6xl">💰</span>
            </div>
            <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">财务 (收/支)</p>
            <div>
                <p className="text-sm text-gray-500">支出 ¥{stats.totalSpend}</p>
                <p className="text-2xl font-bold text-emerald-600 mt-1">收入 ¥{stats.totalIncome}</p>
            </div>
        </div>

        {/* Output */}
        <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex flex-col justify-between h-32 relative overflow-hidden group">
            <div className="absolute right-0 top-0 opacity-5 group-hover:opacity-10 transition-opacity p-2">
                <span className="text-6xl">🚀</span>
            </div>
            <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">核心产出</p>
             <div>
                <p className="text-lg font-bold text-blue-600">{stats.totalWords} <span className="text-xs text-gray-400 font-normal">字</span></p>
                <p className="text-sm text-gray-600">{stats.totalSocialMedia} <span className="text-xs text-gray-400">篇自媒体</span></p>
            </div>
        </div>

        {/* Health */}
        <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex flex-col justify-between h-32 relative overflow-hidden group">
             <div className="absolute right-0 top-0 opacity-5 group-hover:opacity-10 transition-opacity p-2">
                <span className="text-6xl">🧘</span>
            </div>
            <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">身体状态</p>
            <div>
                <p className="text-lg font-bold text-indigo-600">{stats.exerciseDays} <span className="text-xs text-gray-400 font-normal">天运动</span></p>
                <p className="text-sm text-gray-600">均睡 {stats.avgSleep}h</p>
            </div>
        </div>

        {/* Input */}
        <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex flex-col justify-between h-32 relative overflow-hidden group">
             <div className="absolute right-0 top-0 opacity-5 group-hover:opacity-10 transition-opacity p-2">
                <span className="text-6xl">📚</span>
            </div>
            <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">输入与兴趣</p>
            <div>
                 <p className="text-lg font-bold text-amber-600">{stats.totalReadingMins} <span className="text-xs text-gray-400 font-normal">分阅读</span></p>
                 <p className="text-sm text-gray-600">{stats.totalHobbyMins} <span className="text-xs text-gray-400">分兴趣</span></p>
            </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Output Chart */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <h3 className="text-lg font-bold text-gray-700 mb-6 flex items-center gap-2">📈 产出趋势 (字数 & 自媒体)</h3>
            <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={chartData}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                        <XAxis dataKey="date" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                        <Tooltip contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}} />
                        <Line type="monotone" dataKey="words" name="科研字数" stroke="#2563eb" strokeWidth={3} dot={{r: 4}} activeDot={{r: 6}} />
                        <Line type="step" dataKey="social" name="自媒体篇数" stroke="#ec4899" strokeWidth={2} dot={{r: 4}} />
                    </LineChart>
                </ResponsiveContainer>
            </div>
        </div>

        {/* Finance Chart */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
             <h3 className="text-lg font-bold text-gray-700 mb-6 flex items-center gap-2">💵 收支概览</h3>
            <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={chartData}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                        <XAxis dataKey="date" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                        <Tooltip contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}} />
                        <Bar dataKey="spending" name="支出" fill="#94a3b8" radius={[4, 4, 0, 0]} barSize={20} />
                        <Bar dataKey="income" name="收入" fill="#10b981" radius={[4, 4, 0, 0]} barSize={20} />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>

        {/* Sleep & Reading Area */}
         <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 col-span-1 lg:col-span-2">
             <h3 className="text-lg font-bold text-gray-700 mb-6 flex items-center gap-2">💤 睡眠与阅读相关性</h3>
            <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={chartData}>
                         <defs>
                            <linearGradient id="colorSleep" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#8884d8" stopOpacity={0.1}/>
                            <stop offset="95%" stopColor="#8884d8" stopOpacity={0}/>
                            </linearGradient>
                            <linearGradient id="colorRead" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#82ca9d" stopOpacity={0.1}/>
                            <stop offset="95%" stopColor="#82ca9d" stopOpacity={0}/>
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                        <XAxis dataKey="date" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                        <Tooltip contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}} />
                        <Area type="monotone" dataKey="sleep" name="睡眠(h)" stroke="#8884d8" fillOpacity={1} fill="url(#colorSleep)" />
                        <Area type="monotone" dataKey="reading" name="阅读(min)" stroke="#82ca9d" fillOpacity={1} fill="url(#colorRead)" />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </div>
      </div>
    </div>
  );
};
