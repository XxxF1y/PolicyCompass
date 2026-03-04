import { useState } from 'react';
import {
    CheckCircle2,
    Circle,
    Star,
    ArrowRight,
    FileText,
    TrendingUp,
    Lock,
    Target
} from 'lucide-react';

interface NodeData {
    id: string;
    label: string;
    type: 'milestone' | 'policy' | 'qualification';
    status: 'completed' | 'recommended' | 'locked' | 'future';
    x: number; // pixel position from left
    y: number; // percentage from top (vertical lane)
    description?: string;
    benefit?: string;
    cost?: string;
    tags?: string[];
    conditions?: string[];
}

interface Connection {
    from: string;
    to: string;
}

interface Stage {
    id: string;
    title: string;
    period: string;
    bgColor: string;
    width: number;
}

export default function GrowthNavigator() {
    const [selectedNodeId, setSelectedNodeId] = useState<string>('5'); // Default to Tech SME

    const stages: Stage[] = [
        { id: 's1', title: '阶段一：OPC起步期', period: '2024年', bgColor: 'bg-emerald-50/60', width: 300 },
        { id: 's2', title: '阶段二：企业化转型', period: '2025年', bgColor: 'bg-blue-50/60', width: 380 },
        { id: 's3', title: '阶段三：资质积累期', period: '2026年 (当前)', bgColor: 'bg-blue-50/60', width: 380 },
        { id: 's4', title: '阶段四：成长加速期', period: '2027年', bgColor: 'bg-slate-100/60', width: 320 },
        { id: 's5', title: '阶段五：规模化发展', period: '2028年+', bgColor: 'bg-slate-50', width: 300 },
    ];

    // Coordinates are roughly: 
    // Stage 1: 0-280px
    // Stage 2: 280-560px
    // Stage 3: 560-840px
    // Stage 4: 840-1120px
    // Stage 5: 1120-1400px

    // Y-Lanes:
    // Top: 25%
    // Middle: 50%
    // Bottom: 75%

    const nodes: NodeData[] = [
        // Stage 1
        {
            id: '1', label: '算法备案', type: 'qualification', status: 'completed', x: 80, y: 25,
            benefit: '合规经营基础', description: '互联网信息服务算法备案'
        },
        {
            id: '2', label: 'OPC社区入驻', type: 'policy', status: 'completed', x: 150, y: 50,
            benefit: '场地补贴+启动金', description: '针对OPC认证会员的专项扶持'
        },
        {
            id: '3', label: '算力补贴', type: 'policy', status: 'completed', x: 220, y: 75,
            benefit: '最高50万算力资源', tags: ['已兑付'], description: '降低AI模型训练成本'
        },
        // Stage 2
        {
            id: '4', label: '注册有限责任公司', type: 'milestone', status: 'completed', x: 400, y: 50,
            benefit: '解锁企业法人资格', description: '个体工商户转企，建立现代企业制度', tags: ['关键里程碑']
        },
        {
            id: '5', label: '科技型中小企业入库', type: 'qualification', status: 'recommended', x: 580, y: 50,
            benefit: '研发加计扣除/节税8万', cost: '几乎为零', tags: ['2026复评'],
            description: '企业开展科技创新活动的重要身份标识，是后续申报各类专项资金的"门票"。2026年申报通道已开启。',
            conditions: ['在中国境内注册的居民企业', '职工总数不超过500人', '年销售收入不超过2亿元', '资产总额不超过2亿元', '未发生重大安全/质量事故']
        },
        // Stage 3
        {
            id: '6', label: 'AI创新发展专项资金', type: 'policy', status: 'locked', x: 760, y: 25,
            benefit: '最高100万', description: '苏州市级产业专项扶持', conditions: ['需先完成2026科小入库']
        },
        {
            id: '7', label: '高新技术企业认定', type: 'qualification', status: 'locked', x: 860, y: 50,
            benefit: '奖励30-50万+15%税惠', cost: '审计费约3万', description: '国家级资质，企业核心硬科技实力的证明',
            conditions: ['成立满3年 (2026.03满足)', '拥有核心知识产权', '研发费用占比达标']
        },
        {
            id: '8', label: '江苏省双创人才', type: 'policy', status: 'locked', x: 960, y: 75,
            benefit: '最高100万资助', description: '省级高层次人才引进计划', conditions: ['依托企业载体申报', '团队人数3人以上']
        },
        // Stage 4
        {
            id: '9', label: '省专精特新中小企业', type: 'qualification', status: 'locked', x: 1140, y: 50,
            benefit: '奖励30-50万+融资便利', description: '省级"排头兵"企业认证', conditions: ['需先获得高企认定']
        },
        {
            id: '10', label: '智能制造示范工厂', type: 'policy', status: 'locked', x: 1260, y: 25,
            benefit: '项目资金支持', tags: ['协同申报机会'], description: '联合申报项目'
        },
        // Stage 5
        {
            id: '11', label: '国家级"小巨人"', type: 'qualification', status: 'future', x: 1530, y: 50,
            benefit: '国家级荣誉+专项资金', description: '专精特新领域的最高荣誉', conditions: ['需先获得省级专精特新']
        },
    ];

    const connections: Connection[] = [
        { from: '2', to: '4' },
        { from: '4', to: '5' },
        { from: '5', to: '6' },
        { from: '5', to: '7' },
        { from: '4', to: '8' },
        { from: '7', to: '9' },
        { from: '9', to: '11' },
        { from: '1', to: '4' }, // Link algorithm filing to company reg
        { from: '3', to: '5' }, // Link compute subsidy to tech sme
    ];

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'completed': return 'bg-white border-green-500 text-slate-800 shadow-green-100';
            case 'recommended': return 'bg-white border-brand-tech ring-2 ring-brand-tech/30 text-slate-800 shadow-blue-100';
            case 'locked': return 'bg-slate-50 border-slate-300 text-slate-500';
            case 'future': return 'bg-transparent border-slate-300 border-dashed text-slate-400';
            default: return 'bg-white border-slate-200';
        }
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'completed': return <CheckCircle2 className="w-4 h-4 text-green-500" />;
            case 'recommended': return <Target className="w-4 h-4 text-brand-tech" />;
            case 'locked': return <Lock className="w-3 h-3 text-slate-400" />;
            case 'future': return <Circle className="w-3 h-3 text-slate-300" />;
            default: return null;
        }
    };

    const getNodeIcon = (type: string) => {
        if (type === 'milestone') return <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />;
        return null;
    };

    // Helper to find node coordinates
    const getCoords = (id: string) => nodes.find(n => n.id === id);

    const selectedNode = nodes.find(n => n.id === selectedNodeId);

    // Calculate total width based on stages
    const totalWidth = stages.reduce((acc, curr) => acc + curr.width, 0);

    return (
        <div className="w-full mt-6 space-y-6">
            {/* Header section */}
            <div className="flex items-center justify-between border-b border-adaptive-border pb-4">
                <h2 className="text-xl font-bold text-brand-deep flex items-center gap-2">
                    <Target className="w-5 h-5 text-brand-tech" />
                    成长导航仪
                </h2>
                <span className="text-sm font-medium text-adaptive-text-muted bg-adaptive-panel-hover px-3 py-1 rounded-full">
                    全生命周期规划
                </span>
            </div>
            <div className="flex flex-col gap-6 h-auto animate-fade-in">
                {/* Horizontal Growth Graph Container */}
                <div className="w-full bg-adaptive-panel rounded-xl shadow-sm border border-adaptive-border relative overflow-x-auto overflow-y-hidden custom-scrollbar" style={{ height: '350px' }}>
                    <div className="relative h-full" style={{ width: `${totalWidth}px` }}>
                        {/* Background Stages */}
                        <div className="absolute top-0 left-0 h-full z-0 flex">
                            {stages.map((stage) => (
                                <div
                                    key={stage.id}
                                    className={`h-full border-r border-slate-100 pt-2 px-2 relative ${stage.bgColor} ${stage.id === 's5' ? 'border-r-0' : ''}`}
                                    style={{ width: `${stage.width}px` }}
                                >
                                    <div className="text-xs font-bold text-slate-500 uppercase tracking-wider bg-white/80 px-2 py-1 rounded w-fit mb-2">
                                        {stage.title} <span className="font-normal opacity-70 ml-2">| {stage.period}</span>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* SVG Connections Layer */}
                        <svg className="absolute top-0 left-0 w-full h-full z-10 pointer-events-none">
                            <defs>
                                <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
                                    <polygon points="0 0, 10 3.5, 0 7" fill="#cbd5e1" />
                                </marker>
                                <marker id="arrowhead-active" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
                                    <polygon points="0 0, 10 3.5, 0 7" fill="#3182ce" />
                                </marker>
                            </defs>
                            {connections.map((conn, idx) => {
                                const start = getCoords(conn.from);
                                const end = getCoords(conn.to);
                                if (!start || !end) return null;

                                const isActive = start.status === 'completed' && (end.status === 'recommended' || end.status === 'completed');

                                // Bezier Curve Logic for Horizontal Layout
                                // Start Point: (x + half_width, y)
                                // End Point: (x - half_width, y)
                                // Control points to create smooth curve
                                const startX = start.x + 85; // Approximate edge of card
                                const startY = (start.y / 100) * 350; // Convert % to pixels (container height 350)
                                const endX = end.x - 85;
                                const endY = (end.y / 100) * 350;

                                const midX = (startX + endX) / 2;

                                return (
                                    <path
                                        key={idx}
                                        d={`M ${startX} ${startY} C ${midX} ${startY}, ${midX} ${endY}, ${endX} ${endY}`}
                                        fill="none"
                                        stroke={isActive ? "#3182ce" : "#cbd5e1"}
                                        strokeWidth={isActive ? "2" : "1.5"}
                                        strokeDasharray={end.status === 'future' ? "5,5" : "0"}
                                        markerEnd={isActive ? "url(#arrowhead-active)" : "url(#arrowhead)"}
                                    />
                                );
                            })}
                        </svg>

                        {/* Nodes Layer */}
                        <div className="absolute top-0 left-0 w-full h-full z-20">
                            {nodes.map((node) => (
                                <div
                                    key={node.id}
                                    onClick={() => setSelectedNodeId(node.id)}
                                    className={`absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer transition-all duration-300 group
                      ${node.type === 'milestone' ? 'z-30' : 'z-20'}
                  `}
                                    style={{ left: `${node.x}px`, top: `${node.y}%` }}
                                >
                                    {/* Node Card */}
                                    <div className={`
                      relative flex flex-col items-center p-3 rounded-lg border shadow-sm w-[176px] text-center transition-all bg-white
                      ${getStatusColor(node.status)}
                      ${selectedNodeId === node.id ? 'ring-2 ring-brand-tech ring-offset-2 scale-[1.03] shadow-md z-[60]' : 'hover:-translate-y-1 hover:shadow-md'}
                  `}>
                                        <div className="flex items-center justify-center space-x-1.5 mb-1 px-1">
                                            {getNodeIcon(node.type)}
                                            <span className="font-bold text-[13px] text-brand-deep leading-tight line-clamp-2 w-full">{node.label}</span>
                                        </div>

                                        {node.benefit && (
                                            <div className="text-[11px] opacity-80 leading-tight border-t border-slate-100 pt-1.5 mt-1 w-full flex-1 max-h-[2.5em] overflow-hidden text-ellipsis px-1">
                                                {node.benefit}
                                            </div>
                                        )}

                                        {/* Status Indicator Icon */}
                                        <div className="absolute -top-2 -right-2 bg-white rounded-full">
                                            {getStatusIcon(node.status)}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Info Panel & Details */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                    {/* Summary Card */}
                    <div className="bg-brand-deep p-6 rounded-xl text-white shadow-lg flex flex-col justify-between relative overflow-hidden">
                        <div className="absolute -right-6 -top-6 w-32 h-32 bg-white opacity-5 rounded-full blur-2xl flex-shrink-0"></div>
                        <div>
                            <h3 className="text-lg font-bold mb-4 flex items-center">
                                <TrendingUp className="w-5 h-5 mr-2 text-brand-tech" />
                                成长导航总览
                            </h3>
                            <div className="space-y-4 relative z-10">
                                <div className="flex justify-between items-center border-b border-white/20 pb-2">
                                    <span className="text-blue-100 text-sm">成长路径总预估收益</span>
                                    <span className="font-bold text-xl text-warning">400-600万</span>
                                </div>
                                <div className="flex justify-between items-center border-b border-white/20 pb-2">
                                    <span className="text-blue-100 text-sm">当前所处阶段</span>
                                    <span className="font-medium bg-white/20 px-2 py-0.5 rounded text-xs">阶段三：资质积累期</span>
                                </div>
                            </div>
                        </div>
                        <div className="pt-4 relative z-10">
                            <span className="text-blue-100 text-sm block mb-2">下一步最优建议</span>
                            <button onClick={() => setSelectedNodeId('5')} className="w-full bg-white text-brand-deep py-2 rounded-lg text-sm font-bold hover:bg-blue-50 transition-colors flex items-center justify-center">
                                立即申报：科技型中小企业评价 <ArrowRight className="w-4 h-4 ml-1" />
                            </button>
                        </div>
                    </div>

                    {/* Selected Node Details */}
                    <div className="lg:col-span-2">
                        {selectedNode ? (
                            <div className="bg-adaptive-panel rounded-xl shadow-sm border border-adaptive-border h-full flex flex-col overflow-hidden animate-in fade-in slide-in-from-right-4 duration-300">
                                <div className={`p-5 border-b border-adaptive-border flex justify-between items-center ${selectedNode.status === 'recommended' ? 'bg-blue-50/50' :
                                    selectedNode.status === 'locked' ? 'bg-adaptive-panel-hover' : 'bg-emerald-50/50'
                                    }`}>
                                    <div>
                                        <div className="flex items-center gap-2">
                                            <h3 className="font-bold text-lg text-brand-deep">{selectedNode.label}</h3>
                                            {getNodeIcon(selectedNode.type)}
                                        </div>
                                        <span className={`text-xs font-semibold px-2 py-0.5 rounded-full border mt-2 inline-block ${selectedNode.status === 'recommended' ? 'bg-brand-tech/10 text-brand-tech border-brand-tech/20' :
                                            selectedNode.status === 'locked' ? 'bg-adaptive-border text-adaptive-text-muted border-adaptive-border-light' :
                                                'bg-green-100 text-green-700 border-green-200'
                                            }`}>
                                            {selectedNode.status === 'recommended' ? '当前推荐' :
                                                selectedNode.status === 'locked' ? '未解锁' :
                                                    selectedNode.status === 'future' ? '远期目标' : '已完成'}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-2 shrink-0">
                                        <button
                                            className={`px-4 py-2 rounded-lg font-medium text-sm flex items-center transition-colors ${selectedNode.status === 'locked' || selectedNode.status === 'future'
                                                ? 'bg-adaptive-border text-adaptive-text-muted cursor-not-allowed'
                                                : 'bg-brand-tech text-white hover:bg-brand-tech/90 shadow-sm'
                                                }`}
                                        >
                                            {selectedNode.status === 'completed' ? (
                                                <> <CheckCircle2 className="w-4 h-4 mr-2" /> 查看申报记录 </>
                                            ) : selectedNode.status === 'locked' ? (
                                                <> <Lock className="w-4 h-4 mr-2" /> 条件未满足 </>
                                            ) : (
                                                <> <FileText className="w-4 h-4 mr-2" /> 生成申报材料 </>
                                            )}
                                        </button>
                                    </div>
                                </div>

                                <div className="p-6 flex-1 overflow-y-auto">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                        <div>
                                            <p className="text-sm text-adaptive-text leading-relaxed mb-6">
                                                {selectedNode.description}
                                            </p>
                                            <div className="space-y-4">
                                                {selectedNode.benefit && (
                                                    <div className="bg-adaptive-bg p-4 rounded-lg border border-adaptive-border-light">
                                                        <h4 className="text-xs font-bold text-adaptive-text-muted uppercase mb-1">预估收益</h4>
                                                        <p className="text-brand-tech font-bold text-lg">{selectedNode.benefit}</p>
                                                    </div>
                                                )}
                                                {selectedNode.cost && (
                                                    <div>
                                                        <h4 className="text-xs font-bold text-adaptive-text-muted uppercase mb-1">预估投入</h4>
                                                        <p className="text-adaptive-text text-sm">{selectedNode.cost}</p>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                        <div>
                                            {selectedNode.conditions && (
                                                <div className="bg-adaptive-bg/50 p-5 rounded-lg border border-adaptive-border-light h-full">
                                                    <h4 className="font-bold text-adaptive-text mb-4">申报条件 / 前置要求</h4>
                                                    <ul className="space-y-3">
                                                        {selectedNode.conditions.map((cond, i) => (
                                                            <li key={i} className="text-sm text-adaptive-text-muted flex items-start">
                                                                <div className="w-1.5 h-1.5 rounded-full bg-brand-tech mt-1.5 mr-3 shrink-0"></div>
                                                                {cond}
                                                            </li>
                                                        ))}
                                                    </ul>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="bg-adaptive-panel rounded-xl shadow-sm border border-adaptive-border p-6 flex flex-col items-center justify-center text-center h-full text-adaptive-text-muted min-h-[250px]">
                                <Target className="w-12 h-12 mb-2 opacity-50 text-adaptive-border" />
                                <p>点击上方节点查看详情</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
