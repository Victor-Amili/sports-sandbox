import { useState, useEffect, useCallback } from "react";

const STORAGE_KEY = "sport_predictor_trades_v1";

const generateId = () => Math.random().toString(36).substr(2, 9);

export function useTradingLog() {
  const [trades, setTrades] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(trades));
  }, [trades]);

  const addTrade = useCallback((tradeData) => {
    const newTrade = {
      id: generateId(),
      date: new Date().toISOString().split("T")[0],
      timestamp: Date.now(),
      result: "pending",
      profit: 0,
      ...tradeData,
    };
    setTrades((prev) => [newTrade, ...prev]);
    return newTrade.id;
  }, []);

  const updateResult = useCallback((id, result) => {
    setTrades((prev) =>
      prev.map((trade) => {
        if (trade.id !== id) return trade;

        let profit = 0;
        if (result === "win") {
          profit = (trade.odds - 1) * trade.stake;
        } else if (result === "loss") {
          profit = -trade.stake;
        } else if (result === "void") {
          profit = 0;
        }

        return { ...trade, result, profit: Math.round(profit * 100) / 100 };
      }),
    );
  }, []);

  const deleteTrade = useCallback((id) => {
    setTrades((prev) => prev.filter((t) => t.id !== id));
  }, []);

  // Statistics
  const stats = (() => {
    const settled = trades.filter((t) => t.result !== "pending");
    const wins = settled.filter((t) => t.result === "win").length;
    const losses = settled.filter((t) => t.result === "loss").length;
    const voids = settled.filter((t) => t.result === "void").length;
    const totalProfit = settled.reduce((sum, t) => sum + t.profit, 0);
    const totalStaked = settled.reduce((sum, t) => sum + t.stake, 0);
    const roi = totalStaked > 0 ? (totalProfit / totalStaked) * 100 : 0;
    const winRate = settled.length > 0 ? (wins / settled.length) * 100 : 0;

    return {
      totalBets: trades.length,
      settled: settled.length,
      pending: trades.filter((t) => t.result === "pending").length,
      wins,
      losses,
      voids,
      totalProfit: Math.round(totalProfit * 100) / 100,
      totalStaked: Math.round(totalStaked * 100) / 100,
      roi: Math.round(roi * 100) / 100,
      winRate: Math.round(winRate * 100) / 100,
      avgProfitPerBet:
        settled.length > 0
          ? Math.round((totalProfit / settled.length) * 100) / 100
          : 0,
    };
  })();

  // Daily P&L for chart
  const dailyPnL = (() => {
    const map = {};
    trades
      .filter((t) => t.result !== "pending")
      .forEach((t) => {
        map[t.date] = (map[t.date] || 0) + t.profit;
      });
    return Object.entries(map)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([date, profit]) => ({
        date,
        profit: Math.round(profit * 100) / 100,
      }));
  })();

  return { trades, addTrade, updateResult, deleteTrade, stats, dailyPnL };
}
