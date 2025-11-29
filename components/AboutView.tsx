
import React from 'react';
import { Target, BarChart2, MessageSquare, Zap } from 'lucide-react';

export const AboutView: React.FC = () => {
  return (
    <div className="max-w-3xl mx-auto space-y-8 pb-12 animate-in fade-in duration-500">
      
      {/* Hero */}
      <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 text-center">
        <div className="w-16 h-16 bg-indigo-600 rounded-2xl flex items-center justify-center text-white font-bold text-3xl mx-auto mb-6 shadow-indigo-200 shadow-xl">
            L
        </div>
        <h2 className="text-3xl font-bold text-gray-900 mb-4">Loop 个人闭环助手</h2>
        <p className="text-gray-600 max-w-xl mx-auto leading-relaxed">
            将“记录”从繁琐的笔记中解放出来，交给程序自动化处理，
            而将你的精力集中在“思考”和“复盘”上。
            <br/>
            这是一个为您量身定制的自律闭环系统。
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-gray-100">
            <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-lg flex items-center justify-center mb-4"><Zap size={20}/></div>
            <h3 className="font-bold text-gray-900 mb-2">1. 极简记录 (Daily)</h3>
            <p className="text-sm text-gray-500 leading-relaxed">
                每天只需 30 秒。无需长篇大论，只需填入关键数据：花了多少钱、写了多少字、心情如何。
                支持记录收入、睡眠、科研产出、自媒体数据等核心指标。
            </p>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-gray-100">
            <div className="w-10 h-10 bg-amber-50 text-amber-600 rounded-lg flex items-center justify-center mb-4"><BarChart2 size={20}/></div>
            <h3 className="font-bold text-gray-900 mb-2">2. 自动统计 (Stats)</h3>
            <p className="text-sm text-gray-500 leading-relaxed">
                系统会自动累加本周的数据。你可以随时查看“本周收支”、“科研进度趋势”以及“睡眠与效率”的相关性分析。
            </p>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-gray-100">
            <div className="w-10 h-10 bg-purple-50 text-purple-600 rounded-lg flex items-center justify-center mb-4"><MessageSquare size={20}/></div>
            <h3 className="font-bold text-gray-900 mb-2">3. AI 复盘 (Review)</h3>
            <p className="text-sm text-gray-500 leading-relaxed">
                这是系统的核心。每周日，AI 会基于你的真实数据，自动生成一份深刻的周报，指出你的懈怠点，并帮你制定下周计划。
            </p>
        </div>
        
        <div className="bg-white p-6 rounded-2xl border border-gray-100">
            <div className="w-10 h-10 bg-emerald-50 text-emerald-600 rounded-lg flex items-center justify-center mb-4"><Target size={20}/></div>
            <h3 className="font-bold text-gray-900 mb-2">新手指南</h3>
            <ul className="text-sm text-gray-500 space-y-2 list-disc list-inside">
                <li>点击顶部的 <strong>“记录”</strong> 开始今天的数据录入。</li>
                <li>记得点击右下角的 <strong>“保存”</strong> 按钮。</li>
                <li>数据保存在本地浏览器中，请勿清除缓存。</li>
                <li>在设置好 API Key 后，复盘页面可使用 AI 功能。</li>
            </ul>
        </div>
      </div>
      
      <div className="text-center text-xs text-gray-400 mt-12">
        v1.2.0 • Designed for Self-Discipline
      </div>

    </div>
  );
};
