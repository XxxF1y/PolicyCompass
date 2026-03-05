import re

with open("frontend/src/pages/matching/MatchingPage.tsx", "r") as f:
    content = f.read()

start_marker = "                {filteredPolicies.map(policy => ("
# Find the LAST index of the end marker to replace the whole block
end_marker = "                ))}"
start_idx = content.find(start_marker)
end_idx = content.rfind(end_marker) + len(end_marker)

new_block = """                {filteredPolicies.map(policy => (
                    <div key={policy.id} className="relative group bg-white rounded-xl border border-slate-200 shadow-[0_2px_10px_rgba(0,0,0,0.02)] hover:shadow-[0_8px_20px_rgba(0,0,0,0.05)] hover:-translate-y-0.5 transition-all duration-300 flex flex-col overflow-hidden mb-6">
                        
                        {/* Dynamic Left Vertical Status Stripe */}
                        <div className="absolute top-0 left-0 w-[5px] h-full z-10" style={{ backgroundColor: policy.statusColor }}></div>
                        
                        <div className="flex flex-col md:flex-row flex-1">

                            {/* Left: Score Ring */}
                            <div className="flex flex-col items-center justify-center shrink-0 w-48 p-6 md:border-r border-slate-100 bg-gradient-to-b from-slate-50/50 to-white">
                                {renderMatchRing(policy.matchScore, policy.statusColor)}
                                <div className="mt-4 px-3 py-1 rounded border text-[11px] font-bold tracking-widest uppercase shadow-sm" style={{ color: policy.statusColor, borderColor: `${policy.statusColor}30`, backgroundColor: `${policy.statusColor}10` }}>
                                    {policy.matchText}
                                </div>
                            </div>

                            {/* Middle & Right Container */}
                            <div className="flex-1 flex flex-col xl:flex-row">
                                
                                {/* Middle: Content */}
                                <div className="flex-1 p-6 md:p-8 flex flex-col justify-center">
                                    <div className="flex items-center gap-2 mb-3">
                                        <span className="text-[10px] font-bold px-1.5 py-0.5 rounded text-white tracking-widest uppercase" style={{ backgroundColor: policy.statusColor }}>P0 - 优选</span>
                                        {policy.tags.map(tag => (
                                            <span key={tag} className="text-[11px] font-medium px-2 py-0.5 rounded bg-slate-100 text-slate-600 border border-slate-200 uppercase tracking-wide">
                                                {tag}
                                            </span>
                                        ))}
                                    </div>
                                    <h2 className="text-xl md:text-2xl font-bold font-heading text-slate-800 leading-tight mb-4">{policy.title}</h2>
                                    
                                    <div className="flex items-center gap-6 mb-6">
                                        <div className="flex items-center gap-1.5 text-sm text-slate-500">
                                            <Building2 className="w-4 h-4 opacity-70" />
                                            <span>{policy.agency}</span>
                                        </div>
                                        <div className="flex items-center gap-1.5 text-sm text-slate-500">
                                            <Users className="w-4 h-4 opacity-70" />
                                            <span>面向企业主体</span>
                                        </div>
                                    </div>

                                    {/* Blocker Analyzer */}
                                    {policy.blockers && policy.blockers.length > 0 && (
                                        <div className="space-y-2 mt-auto">
                                            {policy.blockers.map((blocker, idx) => (
                                                <div key={idx} className={`p-4 rounded-lg flex items-start gap-3 bg-slate-50 border ${blocker.isLogicLock ? 'border-orange-200/60' : 'border-slate-100'}`}>
                                                    <div className={`mt-0.5 p-1 rounded shrink-0 ${blocker.isLogicLock ? 'bg-orange-100 text-orange-600' : 'bg-blue-50 text-blue-600'}`}>
                                                        {blocker.isLogicLock ? (
                                                            <Lock className="w-4 h-4" />
                                                        ) : blocker.type === 'opc' ? (
                                                            <Building2 className="w-4 h-4" />
                                                        ) : (
                                                            <AlertCircle className="w-4 h-4" />
                                                        )}
                                                    </div>
                                                    <div className="flex-1">
                                                        <h4 className={`text-sm font-bold ${blocker.isLogicLock ? 'text-orange-600' : 'text-slate-700'}`}>
                                                            {blocker.isLogicLock && <span className="mr-1.5 px-1.5 py-0.5 rounded text-[10px] bg-orange-500 text-white uppercase tracking-wider">致命项</span>}
                                                            {blocker.message}
                                                        </h4>
                                                        {blocker.gap && (
                                                            <p className="text-xs text-slate-500 mt-1 leading-relaxed">{blocker.gap}</p>
                                                        )}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>

                                {/* Right: Stats & Actions */}
                                <div className="shrink-0 xl:w-64 p-6 md:p-8 xl:border-l border-slate-100 flex flex-col bg-slate-50/30">
                                    <div className="flex items-center xl:items-start justify-between flex-row xl:flex-col mb-6 xl:mb-8">
                                        <div className="text-[11px] text-slate-500 font-bold uppercase tracking-wider mb-0 xl:mb-1.5">预计扶持额</div>
                                        <div className="text-2xl font-black text-slate-800 tracking-tight">{policy.amount}</div>
                                    </div>
                                    
                                    <div className="mt-auto flex flex-col gap-3">
                                        {policy.matchScore === 100 ? (
                                            <button className="w-full flex items-center justify-center gap-2 bg-[#3182ce] hover:bg-[#2b6cb0] text-white px-4 py-2.5 rounded-md font-bold text-sm shadow-sm transition-all duration-300">
                                                <span>生成申报方案</span>
                                            </button>
                                        ) : (
                                            <button className="w-full flex items-center justify-center gap-2 bg-[#3182ce] hover:bg-[#2b6cb0] text-white px-4 py-2.5 rounded-md font-bold text-sm shadow-sm transition-all duration-300">
                                                查看详情
                                            </button>
                                        )}
                                        <button className="w-full flex items-center justify-center gap-2 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 px-4 py-2.5 rounded-md font-medium text-sm transition-all duration-300">
                                            加入招商计划
                                        </button>
                                        <button className="w-full text-slate-500 hover:text-brand-tech font-medium text-xs mt-2 transition-colors flex items-center justify-center gap-1.5">
                                            <FileText className="w-3.5 h-3.5" /> 发送园区介绍
                                        </button>
                                    </div>
                                </div>

                            </div>
                        </div>
                    </div>
                ))}"""

if start_idx != -1 and end_idx != -1:
    with open("frontend/src/pages/matching/MatchingPage.tsx", "w") as f:
        f.write(content[:start_idx] + new_block + content[end_idx:])
    print("Fixed cards successfully.")
else:
    print("Markers not found.")
