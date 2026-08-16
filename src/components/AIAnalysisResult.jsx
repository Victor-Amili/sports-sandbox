import React, { useState } from 'react';
import {
    Trophy, Zap, TrendingDown, TrendingUp, Activity,
    CheckCircle, XCircle, ChevronDown, ChevronUp,
    Shield, Flame, Flag, Minimize2, AlertTriangle, Brain
} from 'lucide-react';
import { FRAMEWORKS } from '../data/dummyData';

const ICON_MAP = {
    Shield: Shield,
    Flame: Flame,
    Flag: Flag,
    Minimize2: Minimize2,
};

export default function AIAnalysisResult({ result, match }) {
    const [expandedFw, setExpandedFw] = useState(result.bestFramework);

    if (!result) return null;

    const bestFw = result.frameworks.find(f => f.id === result.bestFramework);
    const isQualified = result.overallVerdict === 'QUALIFIED';

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            {/* Hero Verdict Card */}
            <div className={`relative overflow-hidden rounded-2xl border-2 p-6 ${isQualified
                    ? 'border-sp-green bg-sp-green/5 shadow-[0_0_40px_rgba(0,255,136,0.1)]'
                    : 'border-sp-red bg-sp-red/5'
                }`}>
                <div className="absolute top-0 right-0 p-4 opacity-10">
                    <Brain className={`w-32 h-32 ${isQualified ? 'text-sp-green' : 'text-sp-red'}`} />
                </div>

                <div className="relative z-10">
                    <div className="flex items-center gap-2 mb-2">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${isQualified ? 'bg-sp-green text-sp-black' : 'bg-sp-red text-white'
                            }`}>
                            AI Verdict
                        </span>
                        <span className="text-xs text-sp-gray">Analyzed in 0.8s</span>
                    </div>

                    <h2 className="text-3xl font-bold text-white mb-2">
                        {isQualified ? (
                            <span className="flex items-center gap-3">
                                <Trophy className="w-8 h-8 text-sp-green" />
                                {bestFw.name} — {bestFw.betType}
                            </span>
                        ) : (
                            <span className="flex items-center gap-3">
                                <AlertTriangle className="w-8 h-8 text-sp-red" />
                                NO BET
                            </span>
                        )}
                    </h2>

                    <p className="text-lg text-gray-300 max-w-2xl leading-relaxed">
                        {result.aiSummary}
                    </p>

                    <div className="flex items-center gap-6 mt-6">
                        <div className="text-center">
                            <div className={`text-3xl font-bold ${isQualified ? 'text-sp-green' : 'text-sp-red'}`}>
                                {result.overallConfidence}%
                            </div>
                            <div className="text-xs text-sp-gray uppercase tracking-wider">Confidence</div>
                        </div>
                        <div className="w-px h-10 bg-gray-700" />
                        <div className="text-center">
                            <div className="text-3xl font-bold text-white">{bestFw.passedFilters}/6</div>
                            <div className="text-xs text-sp-gray uppercase tracking-wider">Filters Passed</div>
                        </div>
                        <div className="w-px h-10 bg-gray-700" />
                        <div className="text-center">
                            <div className="flex items-center gap-1 text-3xl font-bold text-blue-400">
                                <Activity className="w-6 h-6" />
                                {result.marketAlignment.confidence}%
                            </div>
                            <div className="text-xs text-sp-gray uppercase tracking-wider">Market Alignment</div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Market Alignment Bar */}
            <div className="bg-sp-card border border-gray-800 rounded-xl p-4 flex items-center gap-4">
                <div className={`p-2 rounded-lg ${result.marketAlignment.likelyDirection === 'home_drop' ? 'bg-sp-green/10' : 'bg-gray-800'
                    }`}>
                    {result.marketAlignment.likelyDirection === 'home_drop' ? (
                        <TrendingDown className="w-5 h-5 text-sp-green" />
                    ) : (
                        <TrendingUp className="w-5 h-5 text-sp-gray" />
                    )}
                </div>
                <div className="flex-1">
                    <div className="text-sm font-medium text-white">Market Alignment</div>
                    <div className="text-xs text-sp-gray">{result.marketAlignment.reasoning}</div>
                </div>
                <div className={`text-sm font-bold ${result.marketAlignment.confidence > 60 ? 'text-sp-green' : 'text-sp-gray'
                    }`}>
                    {result.marketAlignment.confidence}% confidence
                </div>
            </div>

            {/* Framework Battle Grid */}
            <div>
                <h3 className="text-sm font-semibold text-sp-gray uppercase tracking-wider mb-4 flex items-center gap-2">
                    <Zap className="w-4 h-4" />
                    Framework Comparison
                </h3>

                <div className="grid gap-4">
                    {result.frameworks.map((fw, index) => {
                        const isWinner = fw.id === result.bestFramework;
                        const isExpanded = expandedFw === fw.id;
                        const Icon = ICON_MAP[FRAMEWORKS[fw.id.toUpperCase()]?.icon] || Activity;
                        const fwColor = isWinner ? 'text-sp-green' : 'text-gray-400';
                        const borderColor = isWinner ? 'border-sp-green/50' : 'border-gray-800';

                        return (
                            <div
                                key={fw.id}
                                className={`rounded-xl border ${borderColor} bg-sp-card overflow-hidden transition-all ${isWinner ? 'shadow-[0_0_20px_rgba(0,255,136,0.05)]' : ''
                                    }`}
                            >
                                {/* Framework Header */}
                                <button
                                    onClick={() => setExpandedFw(isExpanded ? null : fw.id)}
                                    className="w-full p-4 flex items-center justify-between text-left hover:bg-sp-black/20 transition-colors"
                                >
                                    <div className="flex items-center gap-4">
                                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${isWinner ? 'bg-sp-green/20' : 'bg-gray-800'
                                            }`}>
                                            <Icon className={`w-5 h-5 ${fwColor}`} />
                                        </div>
                                        <div>
                                            <div className="flex items-center gap-2">
                                                <span className={`font-semibold ${isWinner ? 'text-sp-green' : 'text-white'}`}>
                                                    {fw.name}
                                                </span>
                                                {isWinner && (
                                                    <span className="px-1.5 py-0.5 rounded bg-sp-green text-sp-black text-[10px] font-bold uppercase">
                                                        Best Fit
                                                    </span>
                                                )}
                                            </div>
                                            <div className="text-xs text-sp-gray">{fw.betType}</div>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-6">
                                        {/* Mini filter dots */}
                                        <div className="flex gap-1">
                                            {[...Array(6)].map((_, i) => (
                                                <div
                                                    key={i}
                                                    className={`w-2 h-2 rounded-full ${i < fw.passedFilters
                                                            ? isWinner ? 'bg-sp-green' : 'bg-blue-400'
                                                            : 'bg-gray-700'
                                                        }`}
                                                />
                                            ))}
                                        </div>

                                        <div className="text-right w-16">
                                            <div className={`text-lg font-bold ${fwColor}`}>{fw.fitScore}%</div>
                                        </div>

                                        {isExpanded ? <ChevronUp className="w-5 h-5 text-sp-gray" /> : <ChevronDown className="w-5 h-5 text-sp-gray" />}
                                    </div>
                                </button>

                                {/* Expanded Filter Breakdown */}
                                {isExpanded && (
                                    <div className="border-t border-gray-800 px-4 py-4 bg-sp-black/30">
                                        <p className="text-sm text-gray-300 mb-4 italic border-l-2 border-sp-green pl-3">
                                            {fw.frameworkInsight}
                                        </p>

                                        <div className="grid gap-2">
                                            {fw.filterBreakdown.map((filter, i) => (
                                                <div
                                                    key={filter.id}
                                                    className={`flex items-center justify-between p-3 rounded-lg border ${filter.passed
                                                            ? 'border-sp-green/20 bg-sp-green/5'
                                                            : 'border-sp-red/20 bg-sp-red/5'
                                                        }`}
                                                >
                                                    <div className="flex items-center gap-3">
                                                        <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${filter.passed ? 'bg-sp-green text-sp-black' : 'bg-sp-red text-white'
                                                            }`}>
                                                            {i + 1}
                                                        </span>
                                                        <div>
                                                            <div className="text-sm text-white">{filter.name}</div>
                                                            <div className="text-xs text-sp-gray">{filter.reason}</div>
                                                        </div>
                                                    </div>
                                                    {filter.passed ? (
                                                        <CheckCircle className="w-5 h-5 text-sp-green" />
                                                    ) : (
                                                        <XCircle className="w-5 h-5 text-sp-red" />
                                                    )}
                                                </div>
                                            ))}
                                        </div>

                                        <div className="mt-4 flex items-center justify-between">
                                            <span className={`text-sm font-bold ${fw.recommendation === 'QUALIFIED' ? 'text-sp-green' : 'text-sp-red'
                                                }`}>
                                                {fw.recommendation === 'QUALIFIED' ? '✓ STRUCTURAL EDGE DETECTED' : '✗ NO EDGE — SKIP'}
                                            </span>
                                            <span className="text-xs text-sp-gray">
                                                {fw.passedFilters}/6 filters passed
                                            </span>
                                        </div>
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}