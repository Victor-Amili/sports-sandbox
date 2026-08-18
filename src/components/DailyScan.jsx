import React, { useState } from 'react';
import {
    Scan, Shield, Flame, Flag, Minimize2, Lock,
    CheckCircle, XCircle, ChevronDown, ChevronUp, ChevronRight,
    AlertTriangle, Brain, BarChart3, Eye, EyeOff, Clock
} from 'lucide-react';

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
    total_lock: 'border-blue-400 bg-blue-400/5 text-blue-400',
    corner_pressure: 'border-blue-400 bg-blue-400/5 text-blue-400',
    midfield_mire: 'border-sp-gray bg-sp-gray/5 text-sp-gray',
};

export default function DailyScan({ scanResult, onRunScan, isScanning }) {
    const [expandedMatch, setExpandedMatch] = useState(null);
    const [expandedDiscarded, setExpandedDiscarded] = useState(null);
    const [showDiscarded, setShowDiscarded] = useState(false);

    if (isScanning) {
        return <ScanningState />;
    }

    if (!scanResult) {
        return <EmptyState onRunScan={onRunScan} />;
    }

    // Defensive destructuring — if old cache lacks these fields, default to empty
    const {
        totalScanned = 0,
        qualifiedCount = 0,
        discardedCount = 0,
        matches = [],
        discarded = [],
        timestamp,
        threshold = 5,
    } = scanResult;

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            {/* Stats Grid */}
            <div className="grid grid-cols-3 gap-4">
                <StatBox icon={BarChart3} label="Scanned" value={totalScanned} color="text-blue-400" />
                <StatBox icon={CheckCircle} label="Qualified" value={qualifiedCount} color="text-sp-green" />
                <StatBox icon={XCircle} label="Discarded" value={discardedCount} color="text-sp-gray" />
            </div>

            {/* Timestamp + Toggle */}
            <div className="flex items-center justify-between flex-wrap gap-2">
                <div className="flex items-center gap-2 text-xs text-sp-gray">
                    <Clock className="w-3 h-3" />
                    <span>Last scan: {timestamp ? new Date(timestamp).toLocaleTimeString() : 'Unknown'}</span>
                    <span className="text-gray-700">|</span>
                    <span>Threshold: {threshold}/6</span>
                </div>

                <button
                    onClick={() => setShowDiscarded(!showDiscarded)}
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold border transition-all ${showDiscarded
                            ? 'border-sp-yellow bg-sp-yellow/10 text-sp-yellow'
                            : 'border-gray-700 text-sp-gray hover:border-gray-500'
                        }`}
                >
                    {showDiscarded ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                    {showDiscarded ? 'Hide Discarded' : 'Show Discarded'}
                </button>
            </div>

            {/* QUALIFIED MATCHES */}
            {qualifiedCount > 0 && (
                <div className="space-y-4">
                    <h3 className="text-sm font-semibold text-sp-green uppercase tracking-wider flex items-center gap-2">
                        <CheckCircle className="w-4 h-4" />
                        Qualified Edges ({qualifiedCount})
                    </h3>
                    {matches.map(({ match, bestFramework, allQualifiedFrameworks }) => (
                        <MatchCard
                            key={match?.id || Math.random()}
                            match={match}
                            bestFramework={bestFramework}
                            allQualifiedFrameworks={allQualifiedFrameworks || []}
                            isExpanded={expandedMatch === match?.id}
                            onToggle={() => setExpandedMatch(expandedMatch === match?.id ? null : match?.id)}
                            isQualified={true}
                        />
                    ))}
                </div>
            )}

            {/* DISCARDED MATCHES */}
            {showDiscarded && discardedCount > 0 && (
                <div className="space-y-4">
                    <h3 className="text-sm font-semibold text-sp-gray uppercase tracking-wider flex items-center gap-2">
                        <XCircle className="w-4 h-4" />
                        Discarded — Why They Failed ({discardedCount})
                    </h3>
                    {discarded.map(({ match, closestFramework, allAttempts }) => (
                        <MatchCard
                            key={match?.id || Math.random()}
                            match={match}
                            bestFramework={closestFramework}
                            allQualifiedFrameworks={allAttempts || []}
                            isExpanded={expandedDiscarded === match?.id}
                            onToggle={() => setExpandedDiscarded(expandedDiscarded === match?.id ? null : match?.id)}
                            isQualified={false}
                        />
                    ))}
                </div>
            )}

            {/* Empty State */}
            {qualifiedCount === 0 && !showDiscarded && (
                <div className="bg-sp-card border border-gray-800 rounded-2xl p-12 text-center">
                    <AlertTriangle className="w-12 h-12 text-sp-yellow mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-white mb-2">No Structural Edges Today</h3>
                    <p className="text-sm text-sp-gray max-w-md mx-auto mb-4">
                        None of today's matches passed at least {threshold}/6 filters on any framework.
                    </p>
                    <button
                        onClick={() => setShowDiscarded(true)}
                        className="text-xs text-sp-yellow hover:text-white underline"
                    >
                        Show discarded matches to see why
                    </button>
                </div>
            )}
        </div>
    );
}

function MatchCard({ match, bestFramework, allQualifiedFrameworks, isExpanded, onToggle, isQualified }) {
    if (!match || !bestFramework) return null;

    const FwIcon = ICON_MAP[bestFramework.frameworkIcon] || Shield;
    const fwColorClass = isQualified
        ? (FRAMEWORK_COLORS[bestFramework.frameworkId] || FRAMEWORK_COLORS.perfect_game)
        : 'border-sp-red bg-sp-red/5 text-sp-red';

    return (
        <div className={`rounded-xl border overflow-hidden transition-all ${isQualified
                ? 'border-gray-800 bg-sp-card hover:border-gray-600'
                : 'border-sp-red/20 bg-sp-card opacity-70 hover:opacity-100'
            }`}>
            <div className="p-5 cursor-pointer" onClick={onToggle}>
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className={`w-12 h-12 rounded-xl border flex flex-col items-center justify-center font-bold text-lg ${isQualified
                                ? (bestFramework.allPassed ? 'bg-sp-green text-sp-black' : 'bg-blue-400/20 text-blue-400')
                                : 'bg-sp-red/20 text-sp-red'
                            }`}>
                            {isQualified ? <FwIcon className="w-5 h-5" /> : <XCircle className="w-5 h-5" />}
                            <span className="text-[9px] mt-0.5">{bestFramework.score}/6</span>
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
                                {!isQualified && (
                                    <span className="px-1.5 py-0.5 rounded bg-sp-red/20 text-sp-red text-[10px] font-bold">
                                        BEST: {bestFramework.frameworkName}
                                    </span>
                                )}
                                {isQualified && allQualifiedFrameworks?.length > 1 && (
                                    <span className="px-1.5 py-0.5 rounded bg-sp-black border border-gray-700 text-sp-yellow text-[10px]">
                                        +{allQualifiedFrameworks.length - 1} more
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="text-right">
                            <div className={`text-sm font-bold ${isQualified ? 'text-sp-green' : 'text-sp-red'}`}>
                                {isQualified ? bestFramework.betType : 'NO BET'}
                            </div>
                            <div className="text-xs text-sp-gray">
                                {isQualified ? bestFramework.frameworkName : `${bestFramework.score}/6 filters`}
                            </div>
                        </div>

                        <div className={`w-14 h-14 rounded-full border-[3px] flex items-center justify-center ${(bestFramework.confidence || 0) >= 85 ? 'border-sp-green' :
                                (bestFramework.confidence || 0) >= 70 ? 'border-blue-400' :
                                    (bestFramework.confidence || 0) >= 50 ? 'border-sp-yellow' : 'border-sp-red'
                            }`}>
                            <span className="text-xs font-bold">{bestFramework.confidence || 0}%</span>
                        </div>

                        <ChevronRight className={`w-5 h-5 text-sp-gray transition-transform ${isExpanded ? 'rotate-90' : ''}`} />
                    </div>
                </div>
            </div>

            {isExpanded && (
                <div className="border-t border-gray-800 px-5 py-4 bg-sp-black/40">
                    {!isQualified && (
                        <div className="p-3 rounded-lg bg-sp-red/10 border border-sp-red/30 mb-4">
                            <div className="text-sm font-bold text-sp-red mb-1">This match failed all frameworks</div>
                            <div className="text-xs text-sp-gray">
                                Best attempt was <span className="text-white">{bestFramework.frameworkName}</span> with only {bestFramework.score}/6 filters passed.
                            </div>
                        </div>
                    )}

                    {isQualified && (
                        <div className={`p-3 rounded-lg border mb-4 ${fwColorClass}`}>
                            <div className="flex items-center gap-2 mb-1">
                                <FwIcon className="w-4 h-4" />
                                <span className="text-sm font-bold">{bestFramework.frameworkName}</span>
                                <span className="text-xs opacity-70">({bestFramework.betType})</span>
                            </div>
                            <p className="text-xs opacity-80">
                                {bestFramework.score}/6 filters passed. {bestFramework.allPassed ? 'Full structural alignment.' : 'Near-perfect alignment.'}
                            </p>
                        </div>
                    )}

                    <div className="grid gap-2">
                        {(bestFramework.results || []).map((filter, i) => (
                            <div
                                key={filter?.id || i}
                                className={`flex items-center justify-between p-2.5 rounded-lg border ${filter?.passed
                                        ? 'border-sp-green/20 bg-sp-green/5'
                                        : 'border-sp-red/20 bg-sp-red/5'
                                    }`}
                            >
                                <div className="flex items-center gap-3">
                                    <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${filter?.passed ? 'bg-sp-green text-sp-black' : 'bg-sp-red text-white'
                                        }`}>
                                        {i + 1}
                                    </span>
                                    <div>
                                        <div className="text-sm text-white">{filter?.name || 'Unknown'}</div>
                                        <div className="text-xs text-sp-gray">{filter?.detail || ''}</div>
                                    </div>
                                </div>
                                {filter?.passed ? (
                                    <CheckCircle className="w-4 h-4 text-sp-green" />
                                ) : (
                                    <XCircle className="w-4 h-4 text-sp-red" />
                                )}
                            </div>
                        ))}
                    </div>

                    {isQualified && allQualifiedFrameworks?.length > 1 && (
                        <div className="border-t border-gray-800 pt-3 mt-4">
                            <div className="text-xs text-sp-gray uppercase tracking-wider mb-2">Also Qualified</div>
                            <div className="flex gap-2 flex-wrap">
                                {allQualifiedFrameworks.slice(1).map(alt => {
                                    const AltIcon = ICON_MAP[alt?.frameworkIcon] || Shield;
                                    return (
                                        <div key={alt?.frameworkId || Math.random()} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-sp-black border border-gray-700">
                                            <AltIcon className="w-3 h-3 text-sp-gray" />
                                            <span className="text-xs text-sp-gray">{alt?.frameworkName || 'Unknown'}</span>
                                            <span className="text-xs text-sp-green font-bold">{alt?.confidence || 0}%</span>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    )}

                    {!isQualified && (
                        <div className="mt-4 p-3 rounded-lg bg-sp-yellow/10 border border-sp-yellow/30">
                            <div className="text-xs text-sp-yellow">
                                <strong>Why this failed:</strong> This match lacks structural alignment.
                                {(bestFramework.results || []).filter(r => !r?.passed).length} filter(s) broke the edge.
                                {(bestFramework.results || []).some(r => r?.id === 'f3' && !r?.passed) && ' Equal motivation is a common killer.'}
                                {(bestFramework.results || []).some(r => r?.id === 'f6' && !r?.passed) && ' Derby status voided the bet.'}
                            </div>
                        </div>
                    )}
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
            <p className="text-sm text-sp-gray">Running all 6 frameworks against every match...</p>
            <div className="mt-4 flex gap-1">
                {[...Array(6)].map((_, i) => (
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
                Run the daily scan to analyze all today's matches against your 6 frameworks.
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