import React, { useState } from 'react';
import { ChevronDown, ChevronRight, BarChart3, Brain, Network, ArrowUpDown } from 'lucide-react';

interface SidebarProps {
  selectedSection: string;
  onSectionSelect: (section: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ selectedSection, onSectionSelect }) => {
  const [observeExpanded, setObserveExpanded] = useState(false);
  const [trainingExpanded, setTrainingExpanded] = useState(true);

  return (
    <div className="w-64 bg-white border-r border-gray-200 h-screen flex flex-col">
      <div className="p-6 border-b border-gray-100">
        <h1 className="text-lg font-semibold text-gray-900">Kray Studio</h1>
      </div>
      
      <nav className="flex-1 p-4 space-y-2">
        {/* Observe Section */}
        <div>
          <button
            onClick={() => setObserveExpanded(!observeExpanded)}
            className="w-full flex items-center justify-between px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-md transition-colors"
          >
            <div className="flex items-center space-x-3">
              <BarChart3 size={16} />
              <span>Observe</span>
            </div>
            {observeExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
          </button>
          
          {observeExpanded && (
            <div className="ml-6 mt-1">
              <button
                onClick={() => onSectionSelect('analytics')}
                className={`w-full text-left px-3 py-2 text-sm rounded-md transition-colors ${
                  selectedSection === 'analytics'
                    ? 'bg-blue-50 text-blue-700'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                Analytics
              </button>
            </div>
          )}
        </div>

        {/* Training Interface Section */}
        <div>
          <button
            onClick={() => setTrainingExpanded(!trainingExpanded)}
            className="w-full flex items-center justify-between px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-md transition-colors"
          >
            <div className="flex items-center space-x-3">
              <Brain size={16} />
              <span>Training Interface</span>
            </div>
            {trainingExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
          </button>
          
          {trainingExpanded && (
            <div className="ml-6 mt-1 space-y-1">
              <button
                onClick={() => onSectionSelect('reasoners')}
                className={`w-full text-left px-3 py-2 text-sm rounded-md transition-colors ${
                  selectedSection === 'reasoners'
                    ? 'bg-blue-50 text-blue-700 font-medium'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                Reasoners
              </button>
              <button
                onClick={() => onSectionSelect('knowledge-graph')}
                className={`w-full text-left px-3 py-2 text-sm rounded-md transition-colors ${
                  selectedSection === 'knowledge-graph'
                    ? 'bg-blue-50 text-blue-700'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <Network size={14} />
                  <span>Knowledge Graph</span>
                </div>
              </button>
              <button
                onClick={() => onSectionSelect('re-ranking')}
                className={`w-full text-left px-3 py-2 text-sm rounded-md transition-colors ${
                  selectedSection === 're-ranking'
                    ? 'bg-blue-50 text-blue-700'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <ArrowUpDown size={14} />
                  <span>Re-Ranking</span>
                </div>
              </button>
            </div>
          )}
        </div>
      </nav>
    </div>
  );
};

export default Sidebar;