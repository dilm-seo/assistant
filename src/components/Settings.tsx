import React from 'react';
import { Settings as SettingsType } from '../types';
import { Settings as SettingsIcon, Key, Bot, MessageSquare, Thermometer } from 'lucide-react';

interface SettingsProps {
  settings: SettingsType;
  onSettingsChange: (settings: SettingsType) => void;
  isOpen: boolean;
  onClose: () => void;
}

export default function Settings({ settings, onSettingsChange, isOpen, onClose }: SettingsProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl p-6 w-full max-w-md shadow-xl">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold flex items-center gap-2 text-blue-900">
            <SettingsIcon className="w-5 h-5" />
            Paramètres
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            ×
          </button>
        </div>

        <div className="space-y-6">
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
              <Key className="w-4 h-4" />
              Clé API OpenAI
            </label>
            <input
              type="password"
              value={settings.apiKey}
              onChange={(e) =>
                onSettingsChange({ ...settings, apiKey: e.target.value })
              }
              className="w-full p-3 border-2 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
              placeholder="sk-..."
            />
          </div>

          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
              <Bot className="w-4 h-4" />
              Modèle
            </label>
            <select
              value={settings.model}
              onChange={(e) =>
                onSettingsChange({ ...settings, model: e.target.value })
              }
              className="w-full p-3 border-2 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
            >
              <option value="gpt-3.5-turbo">GPT-3.5 Turbo (Économique)</option>
              <option value="gpt-4">GPT-4 (Performance maximale)</option>
            </select>
          </div>

          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
              <MessageSquare className="w-4 h-4" />
              Tokens maximum par réponse
            </label>
            <input
              type="number"
              value={settings.maxTokens}
              onChange={(e) =>
                onSettingsChange({
                  ...settings,
                  maxTokens: parseInt(e.target.value),
                })
              }
              className="w-full p-3 border-2 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
              min="100"
              max="4000"
            />
          </div>

          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
              <Thermometer className="w-4 h-4" />
              Créativité (Temperature)
            </label>
            <input
              type="range"
              min="0"
              max="2"
              step="0.1"
              value={settings.temperature}
              onChange={(e) =>
                onSettingsChange({
                  ...settings,
                  temperature: parseFloat(e.target.value),
                })
              }
              className="w-full"
            />
            <div className="flex justify-between text-xs text-gray-500">
              <span>Précis</span>
              <span>Équilibré</span>
              <span>Créatif</span>
            </div>
          </div>
        </div>

        <button
          onClick={onClose}
          className="mt-6 w-full bg-blue-500 text-white p-3 rounded-xl hover:bg-blue-600 transition-colors font-medium"
        >
          Sauvegarder
        </button>
      </div>
    </div>
  );
}