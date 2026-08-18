import React, { useState } from 'react';
import {
    Scan, Shield, Flame, Flag, Minimize2, Lock,
    CheckCircle, Clock, Zap,
     AlertTriangle, ChevronRight,
    BarChart3, XCircle, RefreshCw, Brain
} from 'lucide-react';
import { FRAMEWORKS } from '../data/dummyData';

const ICON_MAP = {
    Shield: Shield,
    Flame: Flame,
    Flag: Flag,
    Minimize2: Minimize2,
    Lock: Lock,
};

const FRAMEWORK_COLORS = {
    perfect_game: 'border-sp-green bg-sp-green/5 text-sp-green',
    perfect_game_away: 'border-sp-green bg-sp-green/5 text-sp-green',
    total_chaos: 'border-sp-red bg-sp-red/5 text-sp-red',
    total_lock: 'border-sp-gray bg-sp-gray/5 text-sp-gray',
    corner_pressure: 'border-blue-400 bg-blue-400/5 text-blue-400',
    midfield_mire: 'border-sp-gray bg-sp-gray/5 text-sp-gray',
};

export default function DailyScan({ scanResult, onRunScan, isScanning, lastScanTime }) {
    const [expandedMatch, setExpandedMatch] = useState(null);

    if (isScanning) {
        return <ScanningState />;
    }

    if (!scanResult) {
        return <EmptyState onRunScan={onRunScan} />;
    }

    const { totalScanned, qualifiedCount, discardedCount, matches, timestamp } = scanResult;

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            {/* Scan Meta Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                        <Zap className="w-6 h-6 text-sp-green" />
                        Today's Edge
                    </h2>
                    <p className="text-sm text-sp-gray mt-1">
                        {qualifiedCount} structural {qualifiedCount === 1 ? 'edge' : 'edges'} found from {totalScanned} matches
                    </p>
                </div>
                <button
                    onClick={onRunScan}
                    className="flex items-center gap-2 px-4 py-2 bg-sp-card border border-gray-700 rounded-lg text-sm text-sp-gray hover:border-sp-green hover:text-sp-green transition-all"
                >
                    <RefreshCw className="w-4 h-4" />
                    Re-Scan
                </button>
            </div>

            {/* Stats Bar */}
            <div className="grid grid-cols-3 gap-4">
                <StatBox
                    icon={BarChart3}
                    label="Scanned"
                    value={totalScanned}
                    color="text-blue-400"
                />
                <StatBox
                    icon={CheckCircle}
                    label="Qualified"
                    value={qualifiedCount}
                    color="text-sp-green"
                />
                <StatBox
                    icon={XCircle}
                    label="Discarded"
                    value={discardedCount}
                    color="text-sp-gray"
                />
            </div>

            {/* Timestamp */}
            <div className="flex items-center gap-2 text-xs text-sp-gray">
                <Clock className="w-3 h-3" />
                <span>Last scan: {new Date(timestamp).toLocaleTimeString()}</span>
            </div>

            {/* Qualified Matches List */}
            {qualifiedCount === 0 ? (
                <div className="bg-sp-card border border-gray-800 rounded-2xl p-12 text-center">
                    <AlertTriangle className="w-12 h-12 text-sp-yellow mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-white mb-2">No Structural Edges Today</h3>
                    <p className="text-sm text-sp-gray max-w-md mx-auto">
                        None of today's matches passed at least 5/6 filters on any framework.
                        This is normal. Discipline means waiting for the perfect setup.
                    </p>
                </div>
            ) : (
                <div className="space-y-4">
                    {matches.map(({ match, bestFramework, allQualifiedFrameworks }) => {
                        const isExpanded = expandedMatch === match.id;
                        const FwIcon = ICON_MAP[bestFramework.frameworkIcon] || Shield;
                        const fwColorClass = FRAMEWORK_COLORS[bestFramework.frameworkId] || FRAMEWORK_COLORS.perfect_game;

                        return (
                            <div
                                key={match.id}
                                className="bg-sp-card border border-gray-800 rounded-xl overflow-hidden hover:border-gray-600 transition-all"
                            >
                                {/* Match Header Row */}
                                <div
                                    className="p-5 cursor-pointer"
                                    onClick={() => setExpandedMatch(isExpanded ? null : match.id)}
                                >
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-4">
                                            {/* Framework Badge */}
                                            <div className={`w-12 h-12 rounded-xl border flex flex-col items-center justify-center ${fwColorClass}`}>
                                                <FwIcon className="w-5 h-5" />
                                                <span className="text-[9px] font-bold mt-0.5">{bestFramework.score}/6</span>
                                            </div>

                                            <div>
                                                <div className="flex items-center gap-2 text-white font-semibold text-lg">
                                                    <span>{match.home}</span>
                                                    <span className="text-sp-gray text-sm">vs</span>
                                                    <span>{match.away}</span>
                                                </div>
                                                <div className="flex items-center gap-3 mt-1 text-xs text-sp-gray">
                                                    <span>{match.league}</span>
                                                    <span>•</span>
                                                    <span>{match.time}</span>
                                                    {allQualifiedFrameworks.length > 1 && (
                                                        <span className="px-1.5 py-0.5 rounded bg-sp-black border border-gray-700 text-sp-yellow">
                                                            +{allQualifiedFrameworks.length - 1} more frameworks
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-4">
                                            <div className="text-right">
                                                <div className={`text-sm font-bold ${bestFramework.allPassed ? 'text-sp-green' : 'text-sp-yellow'}`}>
                                                    {bestFramework.betType}
                                                </div>
                                                <div className="text-xs text-sp-gray">
                                                    {bestFramework.frameworkName}
                                                </div>
                                            </div>

                                            {/* Confidence Ring */}
                                            <div className={`w-14 h-14 rounded-full border-[3px] flex items-center justify-center ${bestFramework.confidence >= 85 ? 'border-sp-green' :
                                                    bestFramework.confidence >= 70 ? 'border-blue-400' :
                                                        'border-sp-yellow'
                                                }`}>
                                                <span className="text-xs font-bold">{bestFramework.confidence}%</span>
                                            </div>

                                            <ChevronRight className={`w-5 h-5 text-sp-gray transition-transform ${isExpanded ? 'rotate-90' : ''}`} />
                                        </div>
                                    </div>
                                </div>

                                {/* Expanded Detail */}
                                {isExpanded && (
                                    <div className="border-t border-gray-800 px-5 py-4 bg-sp-black/40">
                                        {/* Best Framework Insight */}
                                        <div className={`p-3 rounded-lg border mb-4 ${fwColorClass}`}>
                                            <div className="flex items-center gap-2 mb-1">
                                                <FwIcon className="w-4 h-4" />
                                                <span className="text-sm font-bold">{bestFramework.frameworkName}</span>
                                                <span className="text-xs opacity-70">({bestFramework.betType})</span>
                                            </div>
                                            <p className="text-xs opacity-80">
                                                {bestFramework.score}/6 filters passed. {bestFramework.allPassed ? 'Full structural alignment detected.' : 'Near-perfect alignment with minor gaps.'}
                                            </p>
                                        </div>

                                        {/* Filter Breakdown */}
                                        <div className="grid gap-2 mb-4">
                                            {bestFramework.results.map((filter, i) => (
                                                <div
                                                    key={filter.id}
                                                    className={`flex items-center justify-between p-2.5 rounded-lg border ${filter.passed
                                                            ? 'border-sp-green/20 bg-sp-green/5'
                                                            : 'border-sp-red/20 bg-sp-red/5'
                                                        }`}
                                                >
                                                    <div className="flex items-center gap-3">
                                                        <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${filter.passed ? 'bg-sp-green text-sp-black' : 'bg-sp-red text-white'
                                                            }`}>
                                                            {i + 1}
                                                        </span>
                                                        <div>
                                                            <div className="text-sm text-white">{filter.name}</div>
                                                            <div className="text-xs text-sp-gray">{filter.detail}</div>
                                                        </div>
                                                    </div>
                                                    {filter.passed ? (
                                                        <CheckCircle className="w-4 h-4 text-sp-green" />
                                                    ) : (
                                                        <XCircle className="w-4 h-4 text-sp-red" />
                                                    )}
                                                </div>
                                            ))}
                                        </div>

                                        {/* Other Qualified Frameworks (if any) */}
                                        {allQualifiedFrameworks.length > 1 && (
                                            <div className="border-t border-gray-800 pt-3">
                                                <div className="text-xs text-sp-gray uppercase tracking-wider mb-2">Also Qualified</div>
                                                <div className="flex gap-2">
                                                    {allQualifiedFrameworks.slice(1).map(alt => {
                                                        const AltIcon = ICON_MAP[alt.frameworkIcon] || Shield;
                                                        return (
                                                            <div key={alt.frameworkId} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-sp-black border border-gray-700">
                                                                <AltIcon className="w-3 h-3 text-sp-gray" />
                                                                <span className="text-xs text-sp-gray">{alt.frameworkName}</span>
                                                                <span className="text-xs text-sp-green font-bold">{alt.confidence}%</span>
                                                            </div>
                                                        );
                                                    })}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}

function ScanningState() {
    return (
        <div className="flex flex-col items-center justify-center py-20">
            <div className="relative mb-6">
                <div className="w-16 h-16 border-2 border-sp-green/20 rounded-full" />
                <div className="absolute inset-0 w-16 h-16 border-2 border-sp-green border-t-transparent rounded-full animate-spin" />
                <Brain className="w-6 h-6 text-sp-green absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Scanning Today's Fixtures</h3>
            <p className="text-sm text-sp-gray">Running all 4 frameworks against every match...</p>
            <div className="mt-4 flex gap-1">
                {[...Array(4)].map((_, i) => (
                    <div key={i} className="w-8 h-1 rounded-full bg-gray-800 overflow-hidden">
                        <div
                            className="h-full bg-sp-green rounded-full animate-pulse"
                            style={{ animationDelay: `${i * 200}ms`, width: '100%' }}
                        />
                    </div>
                ))}
            </div>
        </div>
    );
}

function EmptyState({ onRunScan }) {
    return (
        <div className="flex flex-col items-center justify-center py-20">
            <div className="w-20 h-20 rounded-full bg-sp-card border border-gray-800 flex items-center justify-center mb-6">
                <Scan className="w-8 h-8 text-sp-gray" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">No Scan Yet Today</h3>
            <p className="text-sm text-sp-gray max-w-sm text-center mb-6">
                Run the daily scan to analyze all today's matches against your 4 frameworks.
                Only structural edges will surface.
            </p>
            <button
                onClick={onRunScan}
                className="flex items-center gap-2 px-6 py-3 bg-sp-green text-sp-black font-bold rounded-xl hover:bg-sp-green-dim transition-all shadow-[0_0_30px_rgba(0,255,136,0.2)]"
            >
                <Scan className="w-5 h-5" />
                Run Daily Scan
            </button>
        </div>
    );
}

function StatBox({ icon: Icon, label, value, color }) {
    return (
        <div className="bg-sp-card border border-gray-800 rounded-xl p-4 flex items-center gap-4">
            <div className={`p-3 rounded-lg bg-sp-black ${color}`}>
                <Icon className="w-5 h-5" />
            </div>
            <div>
                <div className="text-2xl font-bold text-white">{value}</div>
                <div className="text-xs text-sp-gray uppercase tracking-wider">{label}</div>
            </div>
        </div>
    );
}