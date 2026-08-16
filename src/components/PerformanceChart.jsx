import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';

export default function PerformanceChart({ data }) {
    if (data.length === 0) {
        return (
            <div className="bg-sp-card border border-gray-800 rounded-xl p-8 text-center">
                <p className="text-sp-gray text-sm">No settled bets yet. Start logging results to see your performance curve.</p>
            </div>
        );
    }

    const maxProfit = Math.max(...data.map(d => Math.abs(d.profit)), 1);
    const cumulative = [];
    let running = 0;
    data.forEach(d => {
        running += d.profit;
        cumulative.push({ ...d, cumulative: Math.round(running * 100) / 100 });
    });

    return (
        <div className="bg-sp-card border border-gray-800 rounded-xl p-5">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-semibold text-white uppercase tracking-wider">Daily P&L Curve</h3>
                <div className="flex items-center gap-2 text-xs text-sp-gray">
                    <span className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-sp-green" /> Profit</span>
                    <span className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-sp-red" /> Loss</span>
                </div>
            </div>

            <div className="flex items-end gap-1 h-40">
                {cumulative.map((day, i) => {
                    const isProfit = day.profit >= 0;
                    const heightPercent = Math.min((Math.abs(day.profit) / maxProfit) * 100, 100);
                    const cumColor = day.cumulative >= 0 ? 'text-sp-green' : 'text-sp-red';

                    return (
                        <div key={i} className="flex-1 flex flex-col items-center gap-1 group relative">
                            <span className={`text-[10px] opacity-0 group-hover:opacity-100 transition-opacity absolute -top-5 ${cumColor}`}>
                                {day.cumulative > 0 ? '+' : ''}{day.cumulative}
                            </span>
                            <div
                                className={`w-full rounded-t-sm transition-all duration-500 ${isProfit ? 'bg-sp-green' : 'bg-sp-red'}`}
                                style={{ height: `${Math.max(heightPercent, 4)}%` }}
                            />
                            <span className="text-[9px] text-sp-gray truncate w-full text-center">
                                {day.date.slice(5)}
                            </span>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}