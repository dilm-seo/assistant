export interface Message {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

export interface Settings {
  apiKey: string;
  model: string;
  maxTokens: number;
  temperature: number;
}

export interface TokenUsage {
  promptTokens: number;
  completionTokens: number;
  totalTokens: number;
}

export interface AssistantMode {
  id: string;
  name: string;
  icon: React.ComponentType<{ className?: string }>;
  prompt: string;
  description: string;
}