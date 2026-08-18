import React, { useState } from 'react';
import { Activity, CheckCircle, XCircle, Terminal } from 'lucide-react';

export default function ApiTest() {
    const [logs, setLogs] = useState([]);
    const [loading, setLoading] = useState(false);

    const addLog = (msg, type = 'info') => {
        setLogs(prev => [...prev, { msg, type, time: new Date().toLocaleTimeString() }]);
    };

    const testRapidAPI = async () => {
        setLogs([]);
        setLoading(true);

        const key = process.env.REACT_APP_RAPIDAPI_KEY;
        addLog(`Key loaded: ${key ? key.slice(0, 8) + '...' : 'MISSING'}`, key ? 'success' : 'error');

        if (!key) {
            addLog('Add REACT_APP_RAPIDAPI_KEY to .env and restart server', 'error');
            setLoading(false);
            return;
        }

        try {
            addLog('Fetching /v3/fixtures for today...', 'info');

            const today = new Date().toISOString().split('T')[0];
            addLog(`Date: ${today}`, 'info');

            const url = `https://api-football-v1.p.rapidapi.com/v3/fixtures?date=${today}`;
            addLog(`URL: ${url}`, 'info');

            const res = await fetch(url, {
                method: 'GET',
                headers: {
                    'x-rapidapi-key': key,
                    'x-rapidapi-host': 'api-football-v1.p.rapidapi.com',
                }
            });

            addLog(`Response status: ${res.status}`, res.ok ? 'success' : 'error');

            const data = await res.json();
            addLog(`Response has ${data.response?.length || 0} fixtures`, 'info');
            addLog(`Errors: ${data.errors ? JSON.stringify(data.errors) : 'none'}`, 'info');

            if (data.response?.length > 0) {
                const first = data.response[0];
                addLog(`First match: ${first.teams.home.name} vs ${first.teams.away.name}`, 'success');
            } else {
                addLog('No fixtures returned for this date. Try a different date.', 'error');
            }

        } catch (err) {
            addLog(`Fetch error: ${err.message}`, 'error');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-sp-card border border-gray-800 rounded-xl p-5 space-y-4">
            <div className="flex items-center justify-between">
                <h3 className="text-white font-semibold flex items-center gap-2">
                    <Terminal className="w-4 h-4 text-sp-green" />
                    API Connection Test
                </h3>
                <button
                    onClick={testRapidAPI}
                    disabled={loading}
                    className="px-4 py-2 bg-sp-green text-sp-black text-sm font-bold rounded-lg hover:bg-sp-green-dim disabled:opacity-50"
                >
                    {loading ? 'Testing...' : 'Test Connection'}
                </button>
            </div>

            <div className="bg-sp-black rounded-lg p-3 font-mono text-xs space-y-1 max-h-60 overflow-y-auto">
                {logs.length === 0 && <span className="text-sp-gray">Click "Test Connection" to debug...</span>}
                {logs.map((log, i) => (
                    <div key={i} className={`flex gap-2 ${log.type === 'error' ? 'text-sp-red' :
                            log.type === 'success' ? 'text-sp-green' : 'text-sp-gray'
                        }`}>
                        <span className="text-gray-600">[{log.time}]</span>
                        <span>{log.msg}</span>
                    </div>
                ))}
            </div>
        </div>
    );
}