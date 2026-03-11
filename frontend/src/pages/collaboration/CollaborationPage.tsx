import { useState, useEffect } from 'react';
import {
    Network,
    TrendingUp,
    AlertCircle,
    Building2,
    MessageSquare
} from 'lucide-react';

// ==================== 数据定义 ====================
import { CollaborationService } from '../../services/collaborationService';
import type { CollaborationTab, CollabStatus, CollabOpportunity } from '../../types/collaboration';

// 状态标签颜色映射
const statusColorMap: Record<CollabStatus, { color: string; bg: string }> = {
    pending_response: { color: '#ed8936', bg: '#fffaf0' }, // Orange
    needs_info: { color: '#718096', bg: '#f7fafc' },       // Gray
    connected: { color: '#38a169', bg: '#f0fff4' }         // Green
};

export default function CollaborationPage() {
    const [activeTab, setActiveTab] = useState<CollaborationTab>('opportunities');
    const [opportunitiesData, setOpportunitiesData] = useState<CollabOpportunity[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchOpportunities = async () => {
            try {
                const data = await CollaborationService.getOpportunities();
                setOpportunitiesData(data);
            } catch (error) {
                console.error("Failed to fetch collaboration opportunities", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchOpportunities();
    }, []);

    if (isLoading) {
        return (
            <div className="w-full max-w-[1200px] mx-auto space-y-6 animate-pulse p-8">
                <div className="h-10 w-48 bg-slate-100 rounded-lg mb-8"></div>
                <div className="flex gap-6 mb-8 border-b border-slate-200 pb-2">
                    <div className="h-6 w-24 bg-slate-100 rounded"></div>
                    <div className="h-6 w-24 bg-slate-100 rounded"></div>
                    <div className="h-6 w-24 bg-slate-100 rounded"></div>
                </div>
                <div className="space-y-4">
                    {[1, 2, 3].map(i => (
                        <div key={i} className="h-48 bg-slate-100 rounded-xl w-full"></div>
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="w-full max-w-[1200px] mx-auto space-y-6 animate-fade-in pb-16 px-4 md:px-8">

            {/* Header (隐形，可通过布局提供上下文，按图纸要求重点是Tabs) */}
            <div className="flex items-center gap-3 mb-2">
                <Network className="w-7 h-7 text-blue-600" />
                <h1 className="text-2xl font-bold text-slate-800">产业协同</h1>
            </div>

            {/* Tabs */}
            <div className="flex items-center gap-6 border-b border-slate-200">
                <button
                    onClick={() => setActiveTab('opportunities')}
                    className={`pb-3 text-[15px] font-bold transition-all duration-200 border-b-[3px] flex items-center gap-2 ${activeTab === 'opportunities'
                        ? 'border-blue-600 text-blue-600'
                        : 'border-transparent text-slate-500 hover:text-slate-800'
                        }`}
                >
                    协同申报机会
                    <span className={`text-[11px] px-1.5 py-0.5 rounded-full ${activeTab === 'opportunities' ? 'bg-blue-100 text-blue-600' : 'bg-slate-100 text-slate-500'
                        }`}>
                        3
                    </span>
                </button>
                <button
                    onClick={() => setActiveTab('needs')}
                    className={`pb-3 text-[15px] font-bold transition-all duration-200 border-b-[3px] flex items-center gap-2 ${activeTab === 'needs'
                        ? 'border-blue-600 text-blue-600'
                        : 'border-transparent text-slate-500 hover:text-slate-800'
                        }`}
                >
                    供需对接
                    <span className={`text-[11px] px-1.5 py-0.5 rounded-full ${activeTab === 'needs' ? 'bg-blue-100 text-blue-600' : 'bg-slate-100 text-slate-500'
                        }`}>
                        5
                    </span>
                </button>
                <button
                    onClick={() => setActiveTab('records')}
                    className={`pb-3 text-[15px] font-bold transition-all duration-200 border-b-[3px] flex items-center gap-2 ${activeTab === 'records'
                        ? 'border-blue-600 text-blue-600'
                        : 'border-transparent text-slate-500 hover:text-slate-800'
                        }`}
                >
                    我的对接记录
                    <span className={`text-[11px] px-1.5 py-0.5 rounded-full ${activeTab === 'records' ? 'bg-blue-100 text-blue-600' : 'bg-slate-100 text-slate-500'
                        }`}>
                        1
                    </span>
                </button>
            </div>

            {/* Content Area */}
            {activeTab === 'opportunities' && (
                <div className="space-y-4">
                    {opportunitiesData.map((item) => {
                        const sColor = statusColorMap[item.status];

                        return (
                            <div key={item.id} className="bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow p-6 flex flex-col gap-4">

                                {/* Card Header */}
                                <div className="flex items-start justify-between">
                                    <div className="flex flex-wrap items-center gap-2">
                                        {item.level === 'strong' ? (
                                            <span className="px-2 py-0.5 bg-red-500 text-white text-xs font-bold rounded shadow-sm">
                                                强烈推荐
                                            </span>
                                        ) : (
                                            <span className="px-2 py-0.5 bg-blue-50 text-blue-600 text-xs font-bold rounded shadow-sm">
                                                常规推荐
                                            </span>
                                        )}
                                        <span className="px-2 py-0.5 bg-blue-50 text-blue-600 border border-blue-100 text-xs font-bold rounded">
                                            {item.type}
                                        </span>
                                        <h2 className="text-lg font-bold text-slate-800 ml-1">
                                            {item.policyTitle}
                                        </h2>
                                    </div>
                                    <div
                                        className="px-2.5 py-1 text-xs font-bold rounded-lg whitespace-nowrap"
                                        style={{ backgroundColor: sColor.bg, color: sColor.color }}
                                    >
                                        {item.statusLabel}
                                    </div>
                                </div>

                                {/* Partner Info */}
                                <div className="flex items-center gap-2 text-sm text-slate-600 bg-slate-50 w-fit px-3 py-1.5 rounded-lg border border-slate-100">
                                    <Building2 className="w-4 h-4 text-slate-400" />
                                    <span className="font-semibold text-slate-700">合作方：</span>
                                    <span>{item.partnerName}</span>
                                    <span className="text-slate-400 mx-1">|</span>
                                    <span className="text-slate-500">{item.partnerInfo}</span>
                                </div>

                                {/* Details Matrix */}
                                <div className="space-y-3 mt-1 pl-1">
                                    <div className="grid grid-cols-[80px_1fr] gap-2 items-start">
                                        <span className="text-sm text-slate-500 font-medium pt-0.5">需求描述</span>
                                        <p className="text-sm text-slate-700 leading-relaxed">{item.description}</p>
                                    </div>

                                    {item.matchReason && (
                                        <div className="grid grid-cols-[80px_1fr] gap-2 items-start">
                                            <span className="text-sm text-slate-500 font-medium pt-0.5">匹配理由</span>
                                            <p className="text-sm text-slate-700 leading-relaxed">{item.matchReason}</p>
                                        </div>
                                    )}

                                    {item.blocker && (
                                        <div className="grid grid-cols-[80px_1fr] gap-2 items-start">
                                            <span className="text-sm text-slate-500 font-medium pt-0.5 mt-[2px] flex items-center gap-1">
                                                <AlertCircle className="w-3.5 h-3.5 text-red-500" />
                                                卡点
                                            </span>
                                            <p className="text-sm font-bold text-red-600 leading-relaxed">{item.blocker}</p>
                                        </div>
                                    )}

                                    <div className="grid grid-cols-[80px_1fr] gap-2 items-center">
                                        <span className="text-sm text-slate-500 font-medium flex items-center gap-1">
                                            <TrendingUp className="w-3.5 h-3.5 text-green-500" />
                                            预估收益
                                        </span>
                                        <p className="text-sm font-bold text-blue-600">{item.expectedReturn}</p>
                                    </div>
                                </div>

                                {/* Divider & Actions */}
                                <div className="pt-4 mt-2 border-t border-slate-100 flex items-center justify-end gap-3">
                                    <button className="px-4 py-2 text-sm font-bold text-slate-600 bg-white border border-slate-200 hover:bg-slate-50 rounded-lg transition-colors">
                                        查看详情
                                    </button>

                                    {item.status === 'pending_response' && (
                                        <button className="px-4 py-2 text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm shadow-blue-600/20 transition-all flex items-center gap-1.5">
                                            <MessageSquare className="w-4 h-4" />
                                            有意向，发起对接
                                        </button>
                                    )}

                                    {item.status === 'needs_info' && (
                                        <button className="px-4 py-2 text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm shadow-blue-600/20 transition-all flex items-center gap-1.5">
                                            <MessageSquare className="w-4 h-4" />
                                            通知 {item.partnerName.includes('CTO') ? 'CTO' : '合作方'} 完善信息
                                        </button>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            {activeTab === 'needs' && (
                <div className="bg-white rounded-xl border border-slate-200 p-12 text-center text-slate-500">
                    模块开发中...
                </div>
            )}

            {activeTab === 'records' && (
                <div className="bg-white rounded-xl border border-slate-200 p-12 text-center text-slate-500">
                    模块开发中...
                </div>
            )}

        </div>
    );
}
