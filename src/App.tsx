import React, { useState, useEffect } from 'react';
import OpenAI from 'openai';
import { MessageSquareText, Settings as SettingsIcon, Sparkles, FileText, Briefcase, GraduationCap } from 'lucide-react';
import Chat from './components/Chat';
import Settings from './components/Settings';
import TokenUsage from './components/TokenUsage';
import AssistantModes from './components/AssistantModes';
import { Message, Settings as SettingsType, TokenUsage as TokenUsageType, AssistantMode } from './types';
import { saveTokenUsage } from './services/tokenService';

const DEFAULT_SETTINGS: SettingsType = {
  apiKey: '',
  model: 'gpt-3.5-turbo',
  maxTokens: 500,
  temperature: 0.7,
};

const ASSISTANT_MODES: AssistantMode[] = [
  {
    id: 'general',
    name: 'Assistant Général',
    icon: Sparkles,
    prompt: 'Je suis un assistant virtuel polyvalent, prêt à vous aider dans divers domaines.',
    description: 'Assistance générale pour toutes vos questions',
  },
  {
    id: 'administrative',
    name: 'Démarches Administratives',
    icon: FileText,
    prompt: 'Je suis spécialisé dans l\'aide aux démarches administratives françaises. Je peux vous guider étape par étape.',
    description: 'Guide pour vos documents et procédures administratives',
  },
  {
    id: 'professional',
    name: 'Conseil Professionnel',
    icon: Briefcase,
    prompt: 'Je suis un conseiller professionnel, spécialisé dans le développement de carrière et la recherche d\'emploi.',
    description: 'Conseils carrière et développement professionnel',
  },
  {
    id: 'educational',
    name: 'Support Éducatif',
    icon: GraduationCap,
    prompt: 'Je suis un tuteur virtuel, prêt à vous aider dans votre apprentissage et vos études.',
    description: 'Aide aux études et à l\'apprentissage',
  },
];

function App() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [settings, setSettings] = useState<SettingsType>(() => {
    const saved = localStorage.getItem('settings');
    return saved ? JSON.parse(saved) : DEFAULT_SETTINGS;
  });
  const [currentMode, setCurrentMode] = useState<AssistantMode>(ASSISTANT_MODES[0]);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [tokenUsage, setTokenUsage] = useState<TokenUsageType>({
    promptTokens: 0,
    completionTokens: 0,
    totalTokens: 0,
  });

  useEffect(() => {
    localStorage.setItem('settings', JSON.stringify(settings));
  }, [settings]);

  useEffect(() => {
    setMessages([
      {
        role: 'system',
        content: currentMode.prompt,
      },
      {
        role: 'assistant',
        content: `Bonjour ! Je suis votre assistant ${currentMode.name}. Comment puis-je vous aider aujourd'hui ?`,
      },
    ]);
  }, [currentMode]);

  const handleSendMessage = async (content: string) => {
    if (!settings.apiKey) {
      setIsSettingsOpen(true);
      return;
    }

    setIsLoading(true);
    const openai = new OpenAI({
      apiKey: settings.apiKey,
      dangerouslyAllowBrowser: true,
    });

    const userMessage: Message = { role: 'user', content };
    setMessages(prev => [...prev, userMessage]);

    try {
      const response = await openai.chat.completions.create({
        model: settings.model,
        messages: [...messages, userMessage],
        max_tokens: settings.maxTokens,
        temperature: settings.temperature,
      });

      const assistantMessage: Message = {
        role: 'assistant',
        content: response.choices[0].message.content || '',
      };

      const usage: TokenUsageType = {
        promptTokens: response.usage?.prompt_tokens || 0,
        completionTokens: response.usage?.completion_tokens || 0,
        totalTokens: response.usage?.total_tokens || 0,
      };

      setMessages(prev => [...prev, assistantMessage]);
      setTokenUsage(usage);
      saveTokenUsage(usage, settings.model);
    } catch (error) {
      console.error('Error:', error);
      setMessages(prev => [
        ...prev,
        {
          role: 'assistant',
          content: 'Désolé, une erreur est survenue. Veuillez vérifier votre clé API et réessayer.',
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
      <div className="max-w-7xl mx-auto p-4">
        <header className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold flex items-center gap-2 text-blue-900">
            <MessageSquareText className="w-8 h-8" />
            Assistant IA Pro
          </h1>
          <button
            onClick={() => setIsSettingsOpen(true)}
            className="p-2 hover:bg-white/50 rounded-lg transition-colors"
            title="Paramètres"
          >
            <SettingsIcon className="w-6 h-6 text-blue-900" />
          </button>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-3">
            <AssistantModes
              modes={ASSISTANT_MODES}
              currentMode={currentMode}
              onModeChange={setCurrentMode}
            />
          </div>

          <div className="lg:col-span-6">
            <div className="bg-white rounded-xl shadow-lg h-[600px] backdrop-blur-lg backdrop-filter">
              <Chat
                messages={messages.filter(m => m.role !== 'system')}
                onSendMessage={handleSendMessage}
                isLoading={isLoading}
                mode={currentMode}
              />
            </div>
          </div>
          
          <div className="lg:col-span-3">
            <TokenUsage usage={tokenUsage} model={settings.model} />
          </div>
        </div>
      </div>

      <Settings
        settings={settings}
        onSettingsChange={setSettings}
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
      />
    </div>
  );
}

export default App;