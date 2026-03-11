import { useState, useEffect } from 'react';
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
import type { GrowthNode, GrowthConnection, GrowthStage, GrowthSummary } from '../../../types/growth';
import { GrowthService } from '../../../services/growthService';

export default function GrowthNavigator() {
    const [selectedNodeId, setSelectedNodeId] = useState<string>('5');
    const [stages, setStages] = useState<GrowthStage[]>([]);
    const [nodes, setNodes] = useState<GrowthNode[]>([]);
    const [connections, setConnections] = useState<GrowthConnection[]>([]);
    const [summary, setSummary] = useState<GrowthSummary | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            try {
                const data = await GrowthService.getGrowthNavigatorData();
                setStages(data.stages);
                setNodes(data.nodes);
                setConnections(data.connections);
                setSummary(data.summary);
            } catch (error) {
                console.error('Failed to fetch growth navigator data', error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchData();
    }, []);

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

            {isLoading ? (
                <div className="space-y-6 animate-pulse">
                    <div className="h-[350px] bg-slate-100 rounded-xl border border-slate-200"></div>
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        <div className="h-48 bg-slate-100 rounded-xl"></div>
                        <div className="lg:col-span-2 h-48 bg-slate-100 rounded-xl"></div>
                    </div>
                </div>
            ) : (
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
                                        <span className="font-bold text-xl text-warning">{summary?.totalEstimatedBenefit}</span>
                                    </div>
                                    <div className="flex justify-between items-center border-b border-white/20 pb-2">
                                        <span className="text-blue-100 text-sm">当前所处阶段</span>
                                        <span className="font-medium bg-white/20 px-2 py-0.5 rounded text-xs">{summary?.currentStage}</span>
                                    </div>
                                </div>
                            </div>
                            <div className="pt-4 relative z-10">
                                <span className="text-blue-100 text-sm block mb-2">下一步最优建议</span>
                                <button onClick={() => setSelectedNodeId(summary?.nextRecommendationNodeId || '5')} className="w-full bg-white text-brand-deep py-2 rounded-lg text-sm font-bold hover:bg-blue-50 transition-colors flex items-center justify-center">
                                    {summary?.nextRecommendation} <ArrowRight className="w-4 h-4 ml-1" />
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
            )}
        </div>
    );
}
