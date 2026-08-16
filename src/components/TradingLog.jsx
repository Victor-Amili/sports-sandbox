import React, { useState } from 'react';
import { Plus, Check, X, Minus, Trash2, Filter, BookOpen, DollarSign, Percent, Target, TrendingUp } from 'lucide-react';
import { FRAMEWORKS, TODAY_MATCHES } from '../data/dummyData';
import { analyzeMatch } from '../engine/filterEngine';

export default function TradingLog({ trades, addTrade, updateResult, deleteTrade, stats, dailyPnL }) {
    const [showForm, setShowForm] = useState(false);
    const [filterFramework, setFilterFramework] = useState('all');

    const [form, setForm] = useState({
        matchId: '',
        framework: 'perfect_game',
        odds: '',
        stake: '',
        notes: '',
    });

    const selectedMatch = TODAY_MATCHES.find(m => m.id === Number(form.matchId));
    const autoAnalysis = selectedMatch ? analyzeMatch(selectedMatch, form.framework) : null;

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!selectedMatch || !form.odds || !form.stake) return;

        addTrade({
            matchId: selectedMatch.id,
            home: selectedMatch.home,
            away: selectedMatch.away,
            league: selectedMatch.league,
            framework: form.framework,
            betType: autoAnalysis?.betType || 'Unknown',
            odds: Number(form.odds),
            stake: Number(form.stake),
            notes: form.notes,
        });

        setForm({ matchId: '', framework: 'perfect_game', odds: '', stake: '', notes: '' });
        setShowForm(false);
    };

    const filteredTrades = filterFramework === 'all'
        ? trades
        : trades.filter(t => t.framework === filterFramework);

    return (
        <div className="space-y-6">
            {/* Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <StatBox icon={BookOpen} label="Total Bets" value={stats.totalBets} color="text-blue-400" />
                <StatBox icon={Target} label="Win Rate" value={`${stats.winRate}%`} color="text-sp-green" sub={`${stats.wins}W / ${stats.losses}L / ${stats.voids}V`} />
                <StatBox icon={DollarSign} label="Net Profit" value={`${stats.totalProfit >= 0 ? '+' : ''}$${stats.totalProfit}`} color={stats.totalProfit >= 0 ? 'text-sp-green' : 'text-sp-red'} />
                <StatBox icon={Percent} label="ROI" value={`${stats.roi}%`} color={stats.roi >= 0 ? 'text-sp-green' : 'text-sp-red'} sub={`$${stats.totalStaked} staked`} />
            </div>

            {/* Chart */}
            <PerformanceChartWrapper data={dailyPnL} />

            {/* Controls */}
            <div className="flex items-center justify-between">
                <button
                    onClick={() => setShowForm(!showForm)}
                    className="flex items-center gap-2 px-4 py-2 bg-sp-green text-sp-black font-semibold rounded-lg hover:bg-sp-green-dim transition-colors"
                >
                    <Plus className="w-4 h-4" />
                    Log New Bet
                </button>

                <div className="flex items-center gap-2">
                    <Filter className="w-4 h-4 text-sp-gray" />
                    <select
                        value={filterFramework}
                        onChange={(e) => setFilterFramework(e.target.value)}
                        className="bg-sp-card border border-gray-700 rounded-lg px-3 py-2 text-sm text-white focus:border-sp-green focus:outline-none"
                    >
                        <option value="all">All Frameworks</option>
                        {Object.values(FRAMEWORKS).map(fw => (
                            <option key={fw.id} value={fw.id}>{fw.name}</option>
                        ))}
                    </select>
                </div>
            </div>

            {/* New Bet Form */}
            {showForm && (
                <form onSubmit={handleSubmit} className="bg-sp-card border border-gray-800 rounded-xl p-5 space-y-4">
                    <h3 className="text-white font-semibold flex items-center gap-2">
                        <TrendingUp className="w-4 h-4 text-sp-green" />
                        New Paper Trade
                    </h3>

                    <div className="grid md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs text-sp-gray uppercase tracking-wider mb-1">Match</label>
                            <select
                                value={form.matchId}
                                onChange={(e) => setForm({ ...form, matchId: e.target.value })}
                                className="w-full bg-sp-black border border-gray-700 rounded-lg px-3 py-2 text-white focus:border-sp-green focus:outline-none"
                                required
                            >
                                <option value="">Select match...</option>
                                {TODAY_MATCHES.map(m => (
                                    <option key={m.id} value={m.id}>{m.home} vs {m.away}</option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-xs text-sp-gray uppercase tracking-wider mb-1">Framework</label>
                            <select
                                value={form.framework}
                                onChange={(e) => setForm({ ...form, framework: e.target.value })}
                                className="w-full bg-sp-black border border-gray-700 rounded-lg px-3 py-2 text-white focus:border-sp-green focus:outline-none"
                            >
                                {Object.values(FRAMEWORKS).map(fw => (
                                    <option key={fw.id} value={fw.id}>{fw.name}</option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-xs text-sp-gray uppercase tracking-wider mb-1">Odds</label>
                            <input
                                type="number"
                                step="0.01"
                                min="1.01"
                                value={form.odds}
                                onChange={(e) => setForm({ ...form, odds: e.target.value })}
                                className="w-full bg-sp-black border border-gray-700 rounded-lg px-3 py-2 text-white focus:border-sp-green focus:outline-none"
                                placeholder="1.85"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-xs text-sp-gray uppercase tracking-wider mb-1">Stake ($)</label>
                            <input
                                type="number"
                                min="1"
                                value={form.stake}
                                onChange={(e) => setForm({ ...form, stake: e.target.value })}
                                className="w-full bg-sp-black border border-gray-700 rounded-lg px-3 py-2 text-white focus:border-sp-green focus:outline-none"
                                placeholder="100"
                                required
                            />
                        </div>
                    </div>

                    {autoAnalysis && (
                        <div className={`p-3 rounded-lg border ${autoAnalysis.allPassed ? 'border-sp-green/50 bg-sp-green/5' : 'border-sp-yellow/50 bg-sp-yellow/5'}`}>
                            <div className="text-xs text-sp-gray">Auto-Analysis:</div>
                            <div className={`text-sm font-semibold ${autoAnalysis.allPassed ? 'text-sp-green' : 'text-sp-yellow'}`}>
                                {autoAnalysis.recommendation} — {autoAnalysis.betType} ({autoAnalysis.confidence}% confidence)
                            </div>
                            {!autoAnalysis.allPassed && (
                                <div className="text-xs text-sp-yellow mt-1">Warning: This match failed {6 - autoAnalysis.score} filter(s). Only log if you have additional edge.</div>
                            )}
                        </div>
                    )}

                    <div>
                        <label className="block text-xs text-sp-gray uppercase tracking-wider mb-1">Notes</label>
                        <textarea
                            value={form.notes}
                            onChange={(e) => setForm({ ...form, notes: e.target.value })}
                            className="w-full bg-sp-black border border-gray-700 rounded-lg px-3 py-2 text-white focus:border-sp-green focus:outline-none h-20 resize-none"
                            placeholder="Why you're taking this bet, market alignment, etc."
                        />
                    </div>

                    <div className="flex gap-3">
                        <button type="submit" className="px-4 py-2 bg-sp-green text-sp-black font-semibold rounded-lg hover:bg-sp-green-dim transition-colors">
                            Log Bet
                        </button>
                        <button type="button" onClick={() => setShowForm(false)} className="px-4 py-2 border border-gray-700 text-sp-gray rounded-lg hover:border-gray-500 transition-colors">
                            Cancel
                        </button>
                    </div>
                </form>
            )}

            {/* Trades Table */}
            <div className="bg-sp-card border border-gray-800 rounded-xl overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b border-gray-800 text-sp-gray uppercase text-xs tracking-wider">
                                <th className="text-left px-4 py-3">Date</th>
                                <th className="text-left px-4 py-3">Match</th>
                                <th className="text-left px-4 py-3">Framework</th>
                                <th className="text-left px-4 py-3">Bet</th>
                                <th className="text-right px-4 py-3">Odds</th>
                                <th className="text-right px-4 py-3">Stake</th>
                                <th className="text-center px-4 py-3">Result</th>
                                <th className="text-right px-4 py-3">P&L</th>
                                <th className="px-4 py-3"></th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-800">
                            {filteredTrades.length === 0 ? (
                                <tr>
                                    <td colSpan="9" className="px-4 py-8 text-center text-sp-gray">
                                        No trades logged yet. Start your 30-day test above.
                                    </td>
                                </tr>
                            ) : (
                                filteredTrades.map(trade => (
                                    <tr key={trade.id} className="hover:bg-sp-black/30 transition-colors">
                                        <td className="px-4 py-3 text-sp-gray">{trade.date}</td>
                                        <td className="px-4 py-3">
                                            <div className="text-white font-medium">{trade.home} vs {trade.away}</div>
                                            <div className="text-xs text-sp-gray">{trade.league}</div>
                                        </td>
                                        <td className="px-4 py-3">
                                            <span className="px-2 py-1 rounded text-xs bg-sp-black border border-gray-700 text-sp-gray">
                                                {FRAMEWORKS[trade.framework.toUpperCase()]?.name || trade.framework}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3 text-white">{trade.betType}</td>
                                        <td className="px-4 py-3 text-right text-white font-mono">{trade.odds}</td>
                                        <td className="px-4 py-3 text-right text-white font-mono">${trade.stake}</td>
                                        <td className="px-4 py-3 text-center">
                                            {trade.result === 'pending' ? (
                                                <div className="flex items-center justify-center gap-1">
                                                    <button onClick={() => updateResult(trade.id, 'win')} className="p-1 rounded hover:bg-sp-green/20 text-sp-green" title="Win">
                                                        <Check className="w-4 h-4" />
                                                    </button>
                                                    <button onClick={() => updateResult(trade.id, 'loss')} className="p-1 rounded hover:bg-sp-red/20 text-sp-red" title="Loss">
                                                        <X className="w-4 h-4" />
                                                    </button>
                                                    <button onClick={() => updateResult(trade.id, 'void')} className="p-1 rounded hover:bg-sp-yellow/20 text-sp-yellow" title="Void">
                                                        <Minus className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            ) : (
                                                <span className={`px-2 py-1 rounded text-xs font-semibold uppercase ${trade.result === 'win' ? 'bg-sp-green/20 text-sp-green' :
                                                    trade.result === 'loss' ? 'bg-sp-red/20 text-sp-red' :
                                                        'bg-sp-yellow/20 text-sp-yellow'
                                                    }`}>
                                                    {trade.result}
                                                </span>
                                            )}
                                        </td>
                                        <td className={`px-4 py-3 text-right font-mono font-bold ${trade.profit > 0 ? 'text-sp-green' : trade.profit < 0 ? 'text-sp-red' : 'text-sp-gray'
                                            }`}>
                                            {trade.profit > 0 ? '+' : ''}{trade.profit !== 0 ? `$${trade.profit}` : '-'}
                                        </td>
                                        <td className="px-4 py-3">
                                            <button onClick={() => deleteTrade(trade.id)} className="text-sp-gray hover:text-sp-red transition-colors">
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

function StatBox({ icon: Icon, label, value, color, sub }) {
    return (
        <div className="bg-sp-card border border-gray-800 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-2">
                <Icon className={`w-4 h-4 ${color}`} />
                <span className="text-xs text-sp-gray uppercase tracking-wider">{label}</span>
            </div>
            <div className={`text-2xl font-bold ${color}`}>{value}</div>
            {sub && <div className="text-xs text-sp-gray mt-1">{sub}</div>}
        </div>
    );
}

function PerformanceChartWrapper({ data }) {
    const [show, setShow] = useState(true);
    if (!show) return null;

    // Lazy load to avoid circular dependency issues
    const PerformanceChart = require('./PerformanceChart').default;
    return <PerformanceChart data={data} />;
}