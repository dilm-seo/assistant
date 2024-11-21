import React from 'react';
import { TokenUsage as TokenUsageType } from '../types';
import { DollarSign, TrendingUp, BarChart3 } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { getTokenHistory, getTokenStats, calculateCost } from '../services/tokenService';

interface TokenUsageProps {
  usage: TokenUsageType;
  model: string;
}

export default function TokenUsage({ usage, model }: TokenUsageProps) {
  const history = getTokenHistory();
  const stats = getTokenStats();
  const currentCost = calculateCost(usage, model);

  const chartData = history
    .slice(-10)
    .map(entry => ({
      time: new Date(entry.timestamp).toLocaleTimeString(),
      tokens: entry.totalTokens,
      cost: entry.cost,
    }));

  return (
    <div className="space-y-4">
      <div className="card animate-fade-in">
        <h3 className="text-lg font-semibold flex items-center gap-2 mb-4 text-blue-900">
          <div className="p-2 bg-blue-100 rounded-lg">
            <DollarSign className="w-5 h-5 text-blue-600" />
          </div>
          Session actuelle
        </h3>
        <div className="grid grid-cols-2 gap-4">
          <div className="p-3 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-500">Tokens d'entrée</p>
            <p className="text-lg font-semibold text-gray-900">{usage.promptTokens}</p>
          </div>
          <div className="p-3 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-500">Tokens de sortie</p>
            <p className="text-lg font-semibold text-gray-900">{usage.completionTokens}</p>
          </div>
          <div className="p-3 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-500">Total tokens</p>
            <p className="text-lg font-semibold text-gray-900">{usage.totalTokens}</p>
          </div>
          <div className="p-3 bg-blue-50 rounded-lg">
            <p className="text-sm text-blue-600">Coût estimé</p>
            <p className="text-lg font-semibold text-blue-900">${currentCost}</p>
          </div>
        </div>
      </div>

      <div className="card animate-fade-in" style={{ animationDelay: '0.1s' }}>
        <h3 className="text-lg font-semibold flex items-center gap-2 mb-4 text-blue-900">
          <div className="p-2 bg-blue-100 rounded-lg">
            <TrendingUp className="w-5 h-5 text-blue-600" />
          </div>
          Statistiques globales
        </h3>
        <div className="grid grid-cols-2 gap-4">
          <div className="p-3 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-500">Coût total</p>
            <p className="text-lg font-semibold text-gray-900">${stats.totalCost.toFixed(4)}</p>
          </div>
          <div className="p-3 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-500">Total tokens</p>
            <p className="text-lg font-semibold text-gray-900">{stats.totalTokens}</p>
          </div>
          <div className="p-3 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-500">Nombre d'appels</p>
            <p className="text-lg font-semibold text-gray-900">{stats.totalCalls}</p>
          </div>
          <div className="p-3 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-500">Moyenne tokens/appel</p>
            <p className="text-lg font-semibold text-gray-900">{stats.averageTokensPerCall}</p>
          </div>
        </div>
      </div>

      {history.length > 0 && (
        <div className="card animate-fade-in" style={{ animationDelay: '0.2s' }}>
          <h3 className="text-lg font-semibold flex items-center gap-2 mb-4 text-blue-900">
            <div className="p-2 bg-blue-100 rounded-lg">
              <BarChart3 className="w-5 h-5 text-blue-600" />
            </div>
            Historique d'utilisation
          </h3>
          <div className="h-48 mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <XAxis dataKey="time" />
                <YAxis />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'rgba(255, 255, 255, 0.95)',
                    border: 'none',
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="tokens"
                  stroke="#3b82f6"
                  strokeWidth={2}
                  dot={{ fill: '#3b82f6' }}
                  activeDot={{ r: 6, fill: '#2563eb' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
    </div>
  );
}