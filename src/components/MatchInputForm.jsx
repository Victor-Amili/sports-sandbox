import React, { useState } from 'react';
import { Plus, X, Save } from 'lucide-react';

const DEFAULT_MATCH = {
    home: '',
    away: '',
    league: '',
    time: '15:00',
    homeGoalsAvg: 1.5,
    awayConcededAvg: 1.2,
    homeUnbeatenStreak: 3,
    homeCleanSheets: 1,
    motivation: 'equal',
    awayGoalsAvg: 1.2,
    homeConcededAvg: 1.0,
    awayUnbeatenStreak: 2,
    awayCleanSheets: 1,
    awayMotivation: 'equal',
    isDerby: false,
    xGHome: 1.4,
    xGAway: 1.1,
    combinedXG: 2.5,
    cleanSheetDrought: false,
    anchorMissing: false,
    bothSpinesIntact: false,
    transitionStyle: false,
    patientBuildup: false,
    h2hOver25: false,
    h2hUnder25: false,
    rainForecast: false,
    dryPitch: true,
    homeCornerAvg: 5.0,
    awayCornerAvg: 4.0,
    traditionalWingers: true,
    favShotsRank: 5,
    underdogBlocksRank: 5,
    underdogPossession: 45,
    lateMotivation: true,
    narrowPitch: true,
    crossesRank: 10,
    invertedWingers: false,
    possession: 50,
    interceptionsHigh: false,
    keeperCatches: false,
    h2hCornerAvg: 8,
};

export default function MatchInputForm({ onSave, onCancel }) {
    const [form, setForm] = useState({ ...DEFAULT_MATCH });
    const [injuryInput, setInjuryInput] = useState('');
    const [awayInjuryInput, setAwayInjuryInput] = useState('');

    const update = (field, val) => setForm(prev => ({ ...prev, [field]: val }));

    const handleSave = () => {
        if (!form.home.trim() || !form.away.trim()) return;
        onSave({
            ...form,
            id: Date.now(),
            injuries: injuryInput.split(',').map(s => s.trim()).filter(Boolean),
            awayInjuries: awayInjuryInput.split(',').map(s => s.trim()).filter(Boolean),
        });
    };

    return (
        <div className="bg-sp-card border border-gray-800 rounded-2xl p-5 space-y-5 animate-in fade-in">
            <div className="flex items-center justify-between">
                <h3 className="text-white font-bold flex items-center gap-2">
                    <Plus className="w-4 h-4 text-sp-green" />
                    Add Real Match Data
                </h3>
                <button onClick={onCancel} className="text-sp-gray hover:text-white p-1">
                    <X className="w-4 h-4" />
                </button>
            </div>

            {/* Identity */}
            <div className="grid grid-cols-4 gap-3">
                <div className="col-span-2">
                    <label className="block text-[10px] text-sp-gray uppercase tracking-wider mb-1">Home Team</label>
                    <input
                        value={form.home}
                        onChange={e => update('home', e.target.value)}
                        className="w-full bg-sp-black border border-gray-700 rounded px-3 py-2 text-white focus:border-sp-green focus:outline-none"
                        placeholder="e.g. Liverpool"
                    />
                </div>
                <div className="col-span-2">
                    <label className="block text-[10px] text-sp-gray uppercase tracking-wider mb-1">Away Team</label>
                    <input
                        value={form.away}
                        onChange={e => update('away', e.target.value)}
                        className="w-full bg-sp-black border border-gray-700 rounded px-3 py-2 text-white focus:border-sp-green focus:outline-none"
                        placeholder="e.g. Burnley"
                    />
                </div>
                <div>
                    <label className="block text-[10px] text-sp-gray uppercase tracking-wider mb-1">League</label>
                    <input
                        value={form.league}
                        onChange={e => update('league', e.target.value)}
                        className="w-full bg-sp-black border border-gray-700 rounded px-3 py-2 text-white focus:border-sp-green focus:outline-none"
                        placeholder="Premier League"
                    />
                </div>
                <div>
                    <label className="block text-[10px] text-sp-gray uppercase tracking-wider mb-1">Kickoff</label>
                    <input
                        type="time"
                        value={form.time}
                        onChange={e => update('time', e.target.value)}
                        className="w-full bg-sp-black border border-gray-700 rounded px-3 py-2 text-white focus:border-sp-green focus:outline-none"
                    />
                </div>
                <div className="col-span-2">
                    <label className="block text-[10px] text-sp-gray uppercase tracking-wider mb-1">Home Injuries (comma separated)</label>
                    <input
                        value={injuryInput}
                        onChange={e => setInjuryInput(e.target.value)}
                        className="w-full bg-sp-black border border-gray-700 rounded px-3 py-2 text-white focus:border-sp-green focus:outline-none"
                        placeholder="e.g. Saliba, Partey"
                    />
                </div>
                <div className="col-span-2">
                    <label className="block text-[10px] text-sp-gray uppercase tracking-wider mb-1">Away Injuries (comma separated)</label>
                    <input
                        value={awayInjuryInput}
                        onChange={e => setAwayInjuryInput(e.target.value)}
                        className="w-full bg-sp-black border border-gray-700 rounded px-3 py-2 text-white focus:border-sp-green focus:outline-none"
                        placeholder="e.g. Beyer, Foster"
                    />
                </div>
            </div>

            {/* Goals & Form */}
            <Section title="Goals & Form">
                <div className="grid grid-cols-4 gap-3">
                    <NumField label="Home Goals Avg" value={form.homeGoalsAvg} onChange={v => update('homeGoalsAvg', v)} />
                    <NumField label="Away Conceded Avg" value={form.awayConcededAvg} onChange={v => update('awayConcededAvg', v)} />
                    <NumField label="Away Goals Avg" value={form.awayGoalsAvg} onChange={v => update('awayGoalsAvg', v)} />
                    <NumField label="Home Conceded Avg" value={form.homeConcededAvg} onChange={v => update('homeConcededAvg', v)} />
                    <NumField label="Home Unbeaten" value={form.homeUnbeatenStreak} onChange={v => update('homeUnbeatenStreak', v)} step={1} />
                    <NumField label="Home Clean Sheets" value={form.homeCleanSheets} onChange={v => update('homeCleanSheets', v)} step={1} />
                    <NumField label="Away Unbeaten" value={form.awayUnbeatenStreak} onChange={v => update('awayUnbeatenStreak', v)} step={1} />
                    <NumField label="Away Clean Sheets" value={form.awayCleanSheets} onChange={v => update('awayCleanSheets', v)} step={1} />
                </div>
            </Section>

            {/* xG & Tactical */}
            <Section title="xG & Tactical Style">
                <div className="grid grid-cols-4 gap-3">
                    <NumField label="xG Home" value={form.xGHome} onChange={v => update('xGHome', v)} />
                    <NumField label="xG Away" value={form.xGAway} onChange={v => update('xGAway', v)} />
                    <NumField label="Combined xG" value={form.combinedXG} onChange={v => update('combinedXG', v)} />
                    <NumField label="Possession %" value={form.possession} onChange={v => update('possession', v)} step={1} />
                </div>
            </Section>

            {/* Corners */}
            <Section title="Corner Data">
                <div className="grid grid-cols-4 gap-3">
                    <NumField label="Home Corner Avg" value={form.homeCornerAvg} onChange={v => update('homeCornerAvg', v)} />
                    <NumField label="Away Corner Avg" value={form.awayCornerAvg} onChange={v => update('awayCornerAvg', v)} />
                    <NumField label="Fav Shots Rank" value={form.favShotsRank} onChange={v => update('favShotsRank', v)} step={1} />
                    <NumField label="Underdog Blocks Rank" value={form.underdogBlocksRank} onChange={v => update('underdogBlocksRank', v)} step={1} />
                    <NumField label="Underdog Possession" value={form.underdogPossession} onChange={v => update('underdogPossession', v)} step={1} />
                    <NumField label="Crosses Rank" value={form.crossesRank} onChange={v => update('crossesRank', v)} step={1} />
                    <NumField label="H2H Corner Avg" value={form.h2hCornerAvg} onChange={v => update('h2hCornerAvg', v)} />
                </div>
            </Section>

            {/* Motivation */}
            <Section title="Motivation">
                <div className="grid grid-cols-2 gap-3">
                    <div>
                        <label className="block text-[10px] text-sp-gray uppercase tracking-wider mb-1">Home Motivation</label>
                        <select
                            value={form.motivation}
                            onChange={e => update('motivation', e.target.value)}
                            className="w-full bg-sp-black border border-gray-700 rounded px-2 py-2 text-sm text-white focus:border-sp-green focus:outline-none"
                        >
                            <option value="high">High (needs result)</option>
                            <option value="equal">Equal</option>
                            <option value="none">None</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-[10px] text-sp-gray uppercase tracking-wider mb-1">Away Motivation</label>
                        <select
                            value={form.awayMotivation}
                            onChange={e => update('awayMotivation', e.target.value)}
                            className="w-full bg-sp-black border border-gray-700 rounded px-2 py-2 text-sm text-white focus:border-sp-green focus:outline-none"
                        >
                            <option value="high">High (needs result)</option>
                            <option value="equal">Equal</option>
                            <option value="none">None</option>
                        </select>
                    </div>
                </div>
            </Section>

            {/* Toggles */}
            <Section title="Switches">
                <div className="grid grid-cols-3 gap-2">
                    <Toggle label="Is Derby" value={form.isDerby} onChange={v => update('isDerby', v)} />
                    <Toggle label="Clean Sheet Drought" value={form.cleanSheetDrought} onChange={v => update('cleanSheetDrought', v)} />
                    <Toggle label="Anchor Missing" value={form.anchorMissing} onChange={v => update('anchorMissing', v)} />
                    <Toggle label="Both Spines Intact" value={form.bothSpinesIntact} onChange={v => update('bothSpinesIntact', v)} />
                    <Toggle label="Transition Style" value={form.transitionStyle} onChange={v => update('transitionStyle', v)} />
                    <Toggle label="Patient Buildup" value={form.patientBuildup} onChange={v => update('patientBuildup', v)} />
                    <Toggle label="H2H Over 2.5" value={form.h2hOver25} onChange={v => update('h2hOver25', v)} />
                    <Toggle label="H2H Under 2.5" value={form.h2hUnder25} onChange={v => update('h2hUnder25', v)} />
                    <Toggle label="Rain Forecast" value={form.rainForecast} onChange={v => update('rainForecast', v)} />
                    <Toggle label="Dry Pitch" value={form.dryPitch} onChange={v => update('dryPitch', v)} />
                    <Toggle label="Traditional Wingers" value={form.traditionalWingers} onChange={v => update('traditionalWingers', v)} />
                    <Toggle label="Inverted Wingers" value={form.invertedWingers} onChange={v => update('invertedWingers', v)} />
                    <Toggle label="Late Motivation" value={form.lateMotivation} onChange={v => update('lateMotivation', v)} />
                    <Toggle label="Narrow Pitch" value={form.narrowPitch} onChange={v => update('narrowPitch', v)} />
                    <Toggle label="Interceptions High" value={form.interceptionsHigh} onChange={v => update('interceptionsHigh', v)} />
                    <Toggle label="Keeper Catches" value={form.keeperCatches} onChange={v => update('keeperCatches', v)} />
                </div>
            </Section>

            {/* Actions */}
            <div className="flex gap-3 pt-2">
                <button
                    onClick={handleSave}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-sp-green text-sp-black font-bold rounded-xl hover:bg-sp-green-dim transition-colors"
                >
                    <Save className="w-4 h-4" />
                    Save & Analyze
                </button>
                <button
                    onClick={onCancel}
                    className="px-4 py-3 border border-gray-700 text-sp-gray rounded-xl hover:border-gray-500 transition-colors"
                >
                    Cancel
                </button>
            </div>
        </div>
    );
}

// === These are defined OUTSIDE the component so React doesn't recreate them ===

function Section({ title, children }) {
    return (
        <div>
            <div className="text-[10px] font-bold text-sp-green uppercase tracking-wider mb-2 border-b border-gray-800 pb-1">
                {title}
            </div>
            {children}
        </div>
    );
}

function NumField({ label, value, onChange, step = 0.1 }) {
    return (
        <div>
            <label className="block text-[10px] text-sp-gray uppercase tracking-wider mb-1">{label}</label>
            <input
                type="number"
                step={step}
                value={value}
                onChange={e => onChange(Number(e.target.value))}
                className="w-full bg-sp-black border border-gray-700 rounded px-2 py-1.5 text-sm text-white focus:border-sp-green focus:outline-none"
            />
        </div>
    );
}

function Toggle({ label, value, onChange }) {
    return (
        <div
            onClick={() => onChange(!value)}
            className="flex items-center justify-between p-2 rounded bg-sp-black/50 border border-gray-800 cursor-pointer hover:border-gray-600 select-none"
        >
            <span className="text-xs text-sp-gray">{label}</span>
            <div className={`w-8 h-4 rounded-full transition-colors relative ${value ? 'bg-sp-green' : 'bg-gray-700'}`}>
                <div className={`absolute top-0.5 w-3 h-3 rounded-full bg-white transition-all ${value ? 'left-[18px]' : 'left-0.5'}`} />
            </div>
        </div>
    );
}