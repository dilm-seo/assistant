import { TokenUsage } from '../types';

const STORAGE_KEY = 'token_history';

export interface TokenHistory extends TokenUsage {
  timestamp: number;
  model: string;
  cost: number;
}

export const calculateCost = (usage: TokenUsage, model: string): number => {
  const rates = {
    'gpt-3.5-turbo': {
      input: 0.0005,
      output: 0.0015,
    },
    'gpt-4': {
      input: 0.03,
      output: 0.06,
    },
  };

  const rate = rates[model as keyof typeof rates] || rates['gpt-3.5-turbo'];
  const inputCost = (usage.promptTokens / 1000) * rate.input;
  const outputCost = (usage.completionTokens / 1000) * rate.output;
  
  return Number((inputCost + outputCost).toFixed(4));
};

export const saveTokenUsage = (usage: TokenUsage, model: string): void => {
  const history = getTokenHistory();
  const entry: TokenHistory = {
    ...usage,
    timestamp: Date.now(),
    model,
    cost: calculateCost(usage, model),
  };
  
  history.push(entry);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
};

export const getTokenHistory = (): TokenHistory[] => {
  const stored = localStorage.getItem(STORAGE_KEY);
  return stored ? JSON.parse(stored) : [];
};

export const getTotalCost = (): number => {
  const history = getTokenHistory();
  return history.reduce((total, entry) => total + entry.cost, 0);
};

export const getTokenStats = () => {
  const history = getTokenHistory();
  return {
    totalCost: getTotalCost(),
    totalTokens: history.reduce((total, entry) => total + entry.totalTokens, 0),
    totalCalls: history.length,
    averageTokensPerCall: history.length
      ? Math.round(
          history.reduce((total, entry) => total + entry.totalTokens, 0) /
            history.length
        )
      : 0,
  };
};