
import React, { useState, useEffect } from 'react';
import { DailyLog, Mood, FinanceItem, MoodLabels } from '../types';
import { getLogForDate, saveLog } from '../services/storage';
import { Save, Plus, Trash2, CheckCircle2, Circle } from 'lucide-react';

export const DailyView: React.FC = () => {
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [log, setLog] = useState<DailyLog>(getLogForDate(date));
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    setLog(getLogForDate(date));
    setSaved(false);
  }, [date]);

  const handleSave = () => {
    saveLog(log);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const updateHabit = <K extends keyof DailyLog['habits']>(key: K, value: DailyLog['habits'][K]) => {
    setLog(prev => ({
      ...prev,
      habits: { ...prev.habits, [key]: value }
    }));
  };

  const updateSocialMedia = (platform: 'wechatCount' | 'xhsCount', delta: number) => {
      const current = log.habits.socialMedia || { wechatCount: 0, xhsCount: 0 };
      const newVal = Math.max(0, current[platform] + delta);
      setLog(prev => ({
          ...prev,
          habits: {
              ...prev.habits,
              socialMedia: {
                  ...current,
                  [platform]: newVal
              }
          }
      }));
  };

  const addExpense = () => {
    const newItem: FinanceItem = {
      id: Date.now().toString(),
      amount: 0,
      category: '餐饮',
      note: ''
    };
    setLog(prev => ({ ...prev, finance: [...prev.finance, newItem] }));
  };

  const removeExpense = (id: string) => {
    setLog(prev => ({ ...prev, finance: prev.finance.filter(f => f.id !== id) }));
  };

  const updateExpense = (id: string, field: keyof FinanceItem, value: any) => {
    setLog(prev => ({
      ...prev,
      finance: prev.finance.map(f => f.id === id ? { ...f, [field]: value } : f)
    }));
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 pb-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* Date Header */}
      <div className="flex items-center justify-between bg-white p-4 rounded-xl shadow-sm border border-gray-100">
        <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
            📅 <span className="hidden sm:inline">日期选择</span>
        </h2>
        <input 
          type="date" 
          value={date} 
          onChange={(e) => setDate(e.target.value)}
          className="bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Column 1: Health & Personal */}
          <div className="space-y-6">
              <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
                <h3 className="text-sm font-bold text-indigo-500 uppercase tracking-wider mb-4 flex items-center gap-2">
                    🧘 身心健康
                </h3>
                
                <div className="space-y-4">
                  {/* Exercise Toggle */}
                  <div 
                    onClick={() => updateHabit('exercise', !log.habits.exercise)}
                    className={`flex items-center justify-between p-3 rounded-xl cursor-pointer transition-all ${log.habits.exercise ? 'bg-emerald-50 border-emerald-200' : 'bg-gray-50 border-transparent'} border`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-xl">🏃</span>
                      <span className={`font-medium ${log.habits.exercise ? 'text-emerald-700' : 'text-gray-600'}`}>今日运动</span>
                    </div>
                    {log.habits.exercise ? <CheckCircle2 className="text-emerald-600" size={20} /> : <Circle className="text-gray-400" size={20} />}
                  </div>

                  {/* Sleep & Hobby Grid */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-gray-50 p-3 rounded-xl">
                      <label className="text-xs text-gray-500 font-medium block mb-1">睡眠 (小时)</label>
                      <div className="flex items-center gap-2">
                        <span className="text-lg">😴</span>
                        <input 
                          type="number" 
                          step="0.5"
                          value={log.habits.sleepHours || ''}
                          onChange={(e) => updateHabit('sleepHours', parseFloat(e.target.value) || 0)}
                          className="w-full bg-transparent text-lg font-bold text-gray-800 focus:outline-none"
                        />
                      </div>
                    </div>
                    <div className="bg-gray-50 p-3 rounded-xl">
                      <label className="text-xs text-gray-500 font-medium block mb-1">兴趣 (分钟)</label>
                      <div className="flex items-center gap-2">
                        <span className="text-lg">🎨</span>
                        <input 
                          type="number" 
                          value={log.habits.hobbyMins || ''}
                          onChange={(e) => updateHabit('hobbyMins', parseInt(e.target.value) || 0)}
                          className="w-full bg-transparent text-lg font-bold text-gray-800 focus:outline-none"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Reading */}
                   <div className="bg-gray-50 p-3 rounded-xl">
                      <label className="text-xs text-gray-500 font-medium block mb-1">阅读 (分钟)</label>
                      <div className="flex items-center gap-2">
                        <span className="text-lg">📚</span>
                        <input 
                          type="number" 
                          value={log.habits.readingMins || ''}
                          onChange={(e) => updateHabit('readingMins', parseInt(e.target.value) || 0)}
                          className="w-full bg-transparent text-lg font-bold text-gray-800 focus:outline-none"
                          placeholder="0"
                        />
                      </div>
                    </div>
                </div>
              </div>

               {/* Finance Section */}
              <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-sm font-bold text-amber-500 uppercase tracking-wider flex items-center gap-2">
                        💰 财务记录
                    </h3>
                    <button onClick={addExpense} className="text-indigo-600 hover:bg-indigo-50 p-1 rounded transition-colors"><Plus size={18} /></button>
                </div>

                {/* Income */}
                 <div className="bg-amber-50 p-3 rounded-xl mb-4 flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <span className="text-lg">💵</span>
                        <span className="text-sm font-medium text-amber-800">今日收入</span>
                      </div>
                      <input 
                          type="number" 
                          value={log.income || ''}
                          onChange={(e) => setLog(prev => ({...prev, income: parseFloat(e.target.value) || 0}))}
                          className="w-24 bg-transparent text-right text-lg font-bold text-amber-800 focus:outline-none placeholder-amber-300"
                          placeholder="0"
                        />
                  </div>
                
                <div className="space-y-2">
                    {log.finance.map(item => (
                        <div key={item.id} className="flex items-center gap-2 text-sm">
                            <select 
                                value={item.category}
                                onChange={(e) => updateExpense(item.id, 'category', e.target.value)}
                                className="bg-gray-50 border-none rounded py-1 pl-1 pr-6 focus:ring-1 focus:ring-indigo-500 w-20"
                            >
                                <option>餐饮</option>
                                <option>购物</option>
                                <option>交通</option>
                                <option>固定</option>
                                <option>其他</option>
                            </select>
                            <input 
                                type="text" 
                                placeholder="备注"
                                value={item.note}
                                onChange={(e) => updateExpense(item.id, 'note', e.target.value)}
                                className="flex-1 bg-gray-50 border-none rounded py-1 px-2 focus:ring-1 focus:ring-indigo-500"
                            />
                            <input 
                                type="number" 
                                placeholder="0"
                                value={item.amount || ''}
                                onChange={(e) => updateExpense(item.id, 'amount', parseFloat(e.target.value) || 0)}
                                className="w-16 bg-gray-50 border-none rounded py-1 px-1 text-right focus:ring-1 focus:ring-indigo-500"
                            />
                            <button onClick={() => removeExpense(item.id)} className="text-gray-300 hover:text-red-500"><Trash2 size={16} /></button>
                        </div>
                    ))}
                     {log.finance.length === 0 && (
                        <p className="text-xs text-gray-400 italic text-center py-2">无消费记录</p>
                    )}
                </div>
              </div>
          </div>

          {/* Column 2: Work & Output */}
          <div className="space-y-6">
              <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
                <h3 className="text-sm font-bold text-blue-500 uppercase tracking-wider mb-4 flex items-center gap-2">
                    🚀 工作与产出
                </h3>
                
                <div className="space-y-4">
                     {/* Research */}
                    <div className="grid grid-cols-2 gap-3">
                        <div className="bg-blue-50 p-3 rounded-xl">
                            <label className="text-xs text-blue-800/60 font-medium block mb-1">科研产出 (字数)</label>
                            <div className="flex items-center gap-2">
                                <span className="text-lg">📝</span>
                                <input 
                                type="number" 
                                value={log.habits.researchWords || ''}
                                onChange={(e) => updateHabit('researchWords', parseInt(e.target.value) || 0)}
                                className="w-full bg-transparent text-lg font-bold text-blue-900 focus:outline-none"
                                />
                            </div>
                        </div>
                        <div className="bg-blue-50 p-3 rounded-xl">
                           <label className="text-xs text-blue-800/60 font-medium block mb-1">图表制作 (张)</label>
                           <div className="flex items-center justify-between mt-1">
                                <span className="text-lg">📊</span>
                                <div className="flex items-center gap-2 bg-white rounded-lg px-1 shadow-sm">
                                    <button onClick={() => updateHabit('researchCharts', Math.max(0, log.habits.researchCharts - 1))} className="text-blue-500 w-6 h-6 flex items-center justify-center">-</button>
                                    <span className="font-bold text-blue-900">{log.habits.researchCharts}</span>
                                    <button onClick={() => updateHabit('researchCharts', log.habits.researchCharts + 1)} className="text-blue-500 w-6 h-6 flex items-center justify-center">+</button>
                                </div>
                           </div>
                        </div>
                    </div>

                    {/* Social Media */}
                    <div className="bg-gray-50 p-4 rounded-xl">
                        <label className="text-xs text-gray-500 font-medium block mb-3">自媒体运营 (发布/编辑)</label>
                        <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center gap-2 text-sm text-gray-700">
                                <span className="w-6 h-6 flex items-center justify-center bg-green-100 text-green-600 rounded-full text-xs font-bold">公</span>
                                公众号
                            </div>
                             <div className="flex items-center gap-3">
                                 <button onClick={() => updateSocialMedia('wechatCount', -1)} className="w-6 h-6 rounded-full bg-white shadow text-gray-500">-</button>
                                 <span className="font-bold text-gray-800 w-4 text-center">{(log.habits.socialMedia?.wechatCount || 0)}</span>
                                 <button onClick={() => updateSocialMedia('wechatCount', 1)} className="w-6 h-6 rounded-full bg-indigo-600 text-white shadow">+</button>
                              </div>
                        </div>
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2 text-sm text-gray-700">
                                <span className="w-6 h-6 flex items-center justify-center bg-red-100 text-red-600 rounded-full text-xs font-bold">红</span>
                                小红书
                            </div>
                             <div className="flex items-center gap-3">
                                 <button onClick={() => updateSocialMedia('xhsCount', -1)} className="w-6 h-6 rounded-full bg-white shadow text-gray-500">-</button>
                                 <span className="font-bold text-gray-800 w-4 text-center">{(log.habits.socialMedia?.xhsCount || 0)}</span>
                                 <button onClick={() => updateSocialMedia('xhsCount', 1)} className="w-6 h-6 rounded-full bg-indigo-600 text-white shadow">+</button>
                              </div>
                        </div>
                    </div>
                </div>
              </div>

              {/* Reflection */}
               <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
                <h3 className="text-sm font-bold text-purple-500 uppercase tracking-wider mb-4 flex items-center gap-2">
                    💭 复盘闪念
                </h3>
                
                {/* Mood Selector */}
                <div className="flex justify-between mb-4 px-2">
                    {(Object.keys(Mood) as Array<keyof typeof Mood>).map((m) => (
                        <button 
                            key={m}
                            onClick={() => setLog(prev => ({ ...prev, mood: Mood[m] }))}
                            className={`flex flex-col items-center gap-1 transition-all ${log.mood === Mood[m] ? 'scale-110' : 'opacity-50 hover:opacity-100'}`}
                        >
                            <span className="text-2xl">
                                {m === 'Great' ? '🤩' : m === 'Good' ? '🙂' : m === 'Neutral' ? '😐' : m === 'Anxious' ? '😰' : '😴'}
                            </span>
                            <span className={`text-[10px] font-bold ${log.mood === Mood[m] ? 'text-indigo-600' : 'text-gray-400'}`}>
                                {MoodLabels[Mood[m]]}
                            </span>
                        </button>
                    ))}
                </div>

                <textarea 
                    placeholder="今天发生了什么？有什么想吐槽或记录的..."
                    value={log.memo}
                    onChange={(e) => setLog(prev => ({ ...prev, memo: e.target.value }))}
                    className="w-full h-24 bg-gray-50 border-none rounded-xl p-3 text-sm focus:ring-2 focus:ring-indigo-500 resize-none placeholder-gray-400"
                ></textarea>
              </div>
          </div>
      </div>

      {/* Floating Save Button */}
      <div className="fixed bottom-8 right-8 md:right-12 z-20">
        <button 
            onClick={handleSave}
            className={`flex items-center gap-2 px-6 py-4 rounded-full shadow-xl font-bold text-white transition-all transform hover:scale-105 active:scale-95 ${saved ? 'bg-green-500' : 'bg-indigo-600 hover:bg-indigo-700'}`}
        >
            {saved ? <CheckCircle2 size={24} /> : <Save size={24} />}
            <span className="text-lg">{saved ? '已保存' : '保存记录'}</span>
        </button>
      </div>

    </div>
  );
};
