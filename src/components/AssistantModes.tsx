import React from 'react';
import { AssistantMode } from '../types';

interface AssistantModesProps {
  modes: AssistantMode[];
  currentMode: AssistantMode;
  onModeChange: (mode: AssistantMode) => void;
}

export default function AssistantModes({
  modes,
  currentMode,
  onModeChange,
}: AssistantModesProps) {
  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold text-blue-900 px-2">Modes d'assistance</h2>
      <div className="space-y-3">
        {modes.map((mode, index) => {
          const Icon = mode.icon;
          const isActive = mode.id === currentMode.id;

          return (
            <button
              key={mode.id}
              onClick={() => onModeChange(mode)}
              className={`w-full p-4 rounded-xl text-left transition-all animate-fade-in ${
                isActive
                  ? 'bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-lg scale-[1.02]'
                  : 'bg-white text-gray-600 hover:bg-blue-50 shadow hover:shadow-md'
              }`}
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="flex items-center gap-4">
                <div className={`p-2 rounded-lg ${isActive ? 'bg-white/20' : 'bg-blue-50'}`}>
                  <Icon className={`w-5 h-5 ${isActive ? 'text-white' : 'text-blue-500'}`} />
                </div>
                <div>
                  <h3 className="font-medium">{mode.name}</h3>
                  <p className={`text-sm mt-1 ${isActive ? 'text-blue-50' : 'text-gray-500'}`}>
                    {mode.description}
                  </p>
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}