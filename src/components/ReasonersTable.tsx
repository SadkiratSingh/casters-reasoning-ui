import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Filter, Plus, Info, Tag, Trash2, Power, PowerOff, ExternalLink, MoreVertical, MessageSquare, CheckCircle, AlertCircle } from 'lucide-react';
import FeedbackModal from './FeedbackModal';
import LabelWithTooltip from './LabelWithTooltip';

interface ResultWithReasoning {
  result: {
    content: string;
    url: string;
  };
  reasoning: {
    content: string;
    justification_flag: string;
    url: string;
  };
}

interface Vector {
  id: string;
  content: string;
  title: string;
  information_instance: string;
  results: string;
}

interface Feedback {
  user: string;
  feedback: string;
  created_at: string;
}

interface Reasoner {
  id: string;
  condition: string;
  editor: string;
  enabled: boolean;
  updated_time: string;
  result_with_reasoning: ResultWithReasoning[];
  vector: Vector;
  feedback: Feedback[];
  tag: string;
  tagColor: string;
  lastUpdated: string;
}

const ReasonersTable: React.FC = () => {
  const navigate = useNavigate();
  const [selectedReasoners, setSelectedReasoners] = useState<Set<string>>(new Set());
  const [itemsPerPage, setItemsPerPage] = useState('10');
  const [searchTerm, setSearchTerm] = useState('');
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [selectedReasonerForFeedback, setSelectedReasonerForFeedback] = useState<Reasoner | null>(null);
  
  const [mockReasoners, setMockReasoners] = useState<Reasoner[]>([
    {
      id: '1',
      editor: 'AI',
      condition: 'application is portable work benches',
      results: '30 Series Casters, 51 series casters',
      reason: '',
      lastUpdated: '23 Jun, 2025',
      tag: 'portable workbench rule',
      tagColor: 'bg-green-100 text-green-700 border-green-200',
      enabled: false,
      resultItems: [
        { 
          text: '30 Series Casters', 
          sourceUrl: 'https://www.casterconcepts.com/caster-series/30-series-casters-900-lbs-max-capacity-4-x-4-5-top-plate-kingpin/#:~:text=portable%20work%20benches',
          reason: '30 Series Casters are chosen for lighter benches that are moved often on smooth surfaces. They\'re more compact, cost-effective, and easy to roll in clean environments.',
          confidence: 'low'
        },
        { 
          text: '51 series casters', 
          sourceUrl: 'https://www.casterconcepts.com/caster-series/51-series-casters-1500-lbs-max-capacity-4-x-5-top-plate-kingpinless/#:~:text=portable%20work%20benches',
          reason: '51 Series Casters are used for heavy workbenches that need to carry more weight and handle rougher floors. They offer better durability and stability for industrial use',
          confidence: 'low'
        }
      ]
    },
    {
      id: '2',
      editor: 'AI',
      condition: 'application is Aircraft maintenance stands',
      results: 'Semi-Pneumatic Wheels',
      reason: 'These wheels are explicitly recommended for aircraft maintenance stands due to their shock absorption and ability to handle uneven surfaces',
      lastUpdated: '20 Jan, 2025',
      tag: 'AMS rule',
      tagColor: 'bg-blue-100 text-blue-700 border-blue-200',
      enabled: true,
      resultItems: [
        { 
          text: 'Semi-Pneumatic Wheels', 
          sourceUrl: 'https://www.casterconcepts.com/caster-by/ground-support-outdoor-casters-wheels/#:~:text=aircraft%20maintenance%20stands',
          reason: 'Semi-Pneumatic tires mitigate shock by cushioning the load, while also rolling over obstructions, uneven floor surfaces, and rough indoor or outdoor terrain with ease.',
          confidence: 'high'
        }
      ]
    }
  ]);

  const handleSelectReasoner = (id: string) => {
    const newSelected = new Set(selectedReasoners);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedReasoners(newSelected);
  };

  const handleSelectAll = () => {
    if (selectedReasoners.size === mockReasoners.length) {
      setSelectedReasoners(new Set());
    } else {
      setSelectedReasoners(new Set(mockReasoners.map(r => r.id)));
    }
  };

  const handleDelete = () => {
    setMockReasoners(prev => prev.filter(r => !selectedReasoners.has(r.id)));
    setSelectedReasoners(new Set());
  };

  const handleEnable = () => {
    setMockReasoners(prev => 
      prev.map(r => 
        selectedReasoners.has(r.id) ? { ...r, enabled: true } : r
      )
    );
    setSelectedReasoners(new Set());
  };

  const handleDisable = () => {
    setMockReasoners(prev => 
      prev.map(r => 
        selectedReasoners.has(r.id) ? { ...r, enabled: false } : r
      )
    );
    setSelectedReasoners(new Set());
  };

  // Get status of selected reasoners
  const getSelectedReasonersStatus = () => {
    const selectedReasonersList = mockReasoners.filter(r => selectedReasoners.has(r.id));
    const enabledCount = selectedReasonersList.filter(r => r.enabled).length;
    const disabledCount = selectedReasonersList.filter(r => !r.enabled).length;
    
    if (enabledCount === selectedReasonersList.length) {
      return 'all-enabled';
    } else if (disabledCount === selectedReasonersList.length) {
      return 'all-disabled';
    } else {
      return 'mixed';
    }
  };

  const selectedStatus = getSelectedReasonersStatus();

  const handleMenuToggle = (id: string) => {
    setOpenMenuId(openMenuId === id ? null : id);
  };

  const handleAddFeedback = (reasonerId: string) => {
    const reasoner = mockReasoners.find(r => r.id === reasonerId);
    if (reasoner) {
      setSelectedReasonerForFeedback(reasoner);
      setShowFeedbackModal(true);
    }
    setOpenMenuId(null);
  };

  // Close menu when clicking outside
  React.useEffect(() => {
    const handleClickOutside = () => {
      setOpenMenuId(null);
    };
    
    if (openMenuId) {
      document.addEventListener('click', handleClickOutside);
      return () => document.removeEventListener('click', handleClickOutside);
    }
  }, [openMenuId]);

  return (
    <div className="flex-1 bg-gray-50 p-8 relative">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-semibold text-gray-900">Reasoners</h1>
            <button 
              onClick={() => navigate('/new-reasoner')}
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus size={16} className="mr-2" />
              New reasoner
            </button>
          </div>
          
          {/* Info Message */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <div className="flex items-start space-x-3">
              <Info size={16} className="text-blue-600 mt-0.5 flex-shrink-0" />
              <p className="text-sm text-blue-800">
                These reasoners were generated by AI to help accelerate your workflow. They're currently disabled by default — feel free to review and enable any that meet your needs.
              </p>
            </div>
          </div>
        </div>

        {/* Filter Bar */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
          <div className="p-4">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-4">
                <select
                  value={itemsPerPage}
                  onChange={(e) => setItemsPerPage(e.target.value)}
                  className="text-sm border border-gray-300 rounded-md px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="10">10 items per page</option>
                  <option value="25">25 items per page</option>
                  <option value="50">50 items per page</option>
                </select>
                
                <button className="inline-flex items-center px-3 py-2 text-sm text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors">
                  <Filter size={16} className="mr-2" />
                  Filters
                </button>
              </div>
              
              <div className="text-sm text-gray-500">
                {mockReasoners.length} reasoners
              </div>
            </div>
            
            {/* Full Width Search Bar */}
            <div className="relative">
              <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search by editor, condition, consequences"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="w-12 px-6 py-3 text-left">
                  <input
                    type="checkbox"
                    checked={selectedReasoners.size === mockReasoners.length}
                    onChange={handleSelectAll}
                    className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                  />
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Editor
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Condition
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Results with Reasoning
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Last Update
                </th>
                <th className="w-12 px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {mockReasoners.map((reasoner) => (
                <tr
                  key={reasoner.id}
                  className={`transition-colors ${
                    selectedReasoners.has(reasoner.id)
                      ? 'bg-blue-50 border-blue-200'
                      : reasoner.enabled
                      ? 'bg-white hover:bg-gray-50'
                      : 'bg-gray-50/50 hover:bg-gray-100/50'
                  }`}
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <input
                      type="checkbox"
                      checked={selectedReasoners.has(reasoner.id)}
                      onChange={() => handleSelectReasoner(reasoner.id)}
                      className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                    />
                  </td>
                  <td className={`px-6 py-4 whitespace-nowrap text-sm ${
                    reasoner.enabled ? 'text-gray-900' : 'text-gray-500'
                  }`}>
                    {reasoner.editor}
                  </td>
                  <td className={`px-6 py-4 text-sm max-w-xs ${
                    reasoner.enabled ? 'text-gray-900' : 'text-gray-500'
                  }`}>
                    <div className="space-y-2">
                      <div>
                        <span>{reasoner.condition}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Tag size={12} className={reasoner.enabled ? 'text-gray-400' : 'text-gray-400'} />
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium border ${reasoner.tagColor} ${
                          !reasoner.enabled ? 'opacity-75' : ''
                        }`}>
                          {reasoner.tag}
                        </span>
                      </div>
                    </div>
                  </td>
                  <td className={`px-6 py-4 text-sm max-w-lg ${
                    reasoner.enabled ? 'text-gray-900' : 'text-gray-500'
                  }`}>
                    <div className="space-y-4">
                      {reasoner.resultItems ? (
                        reasoner.resultItems.map((item, index) => (
                          <div key={index} className="border border-gray-200 rounded-lg p-3 bg-gray-50/50">
                            {/* Result Header */}
                            <div className="mb-2">
                              <div className="flex items-center space-x-2 mb-1">
                                <div className="text-xs font-medium text-gray-500">RESULT</div>
                                {item.sourceUrl && (
                                  <div className="flex items-center space-x-1">
                                    <span className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium bg-blue-50 text-blue-700 border border-blue-200 cursor-help relative group">
                                      sourced
                                      <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 text-xs text-white bg-gray-900 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap z-10">
                                        This result is extracted from attached source
                                      </div>
                                    </span>
                                    <button
                                      onClick={() => window.open(item.sourceUrl, '_blank')}
                                      className="flex-shrink-0 p-0.5 rounded hover:bg-gray-200 transition-colors"
                                      title="View source page"
                                    >
                                      <ExternalLink size={12} className={reasoner.enabled ? 'text-blue-600 hover:text-blue-700' : 'text-blue-400'} />
                                    </button>
                                  </div>
                                )}
                              </div>
                              <div className="text-sm font-semibold text-gray-900">{item.text}</div>
                            </div>
                            
                            {/* Reasoning */}
                            <div className="mt-2 pt-2 border-t border-gray-200">
                              <div className="flex items-center space-x-2 mb-1">
                                <div className="text-xs font-medium text-gray-500">REASONING</div>
                                {item.confidence === 'high' ? (
                                  <div className="flex items-center space-x-1">
                                    <span className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium bg-blue-50 text-blue-700 border border-blue-200 cursor-help relative group">
                                      sourced
                                      <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 text-xs text-white bg-gray-900 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap z-10">
                                        This reason is extracted from attached source
                                      </div>
                                    </span>
                                    <button
                                      onClick={() => window.open(item.sourceUrl || '#', '_blank')}
                                      className="flex-shrink-0 p-0.5 rounded hover:bg-gray-200 transition-colors"
                                      title="View source page"
                                    >
                                      <ExternalLink size={12} className="text-blue-600 hover:text-blue-700" />
                                    </button>
                                  </div>
                                ) : (
                                  <div className="flex items-center space-x-1">
                                    <span 
                                      className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium bg-orange-50 text-orange-700 border border-orange-200 cursor-help relative group"
                                      title="The reason was generated by AI based on the context of attached source"
                                    >
                                      inferred
                                      <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 text-xs text-white bg-gray-900 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap z-10">
                                        The reason was generated by AI based on the context of attached source
                                      </div>
                                    </span>
                                    <button
                                      onClick={() => window.open(item.sourceUrl || '#', '_blank')}
                                      className="flex-shrink-0 p-0.5 rounded hover:bg-gray-200 transition-colors"
                                      title="View source page"
                                    >
                                      <ExternalLink size={12} className="text-blue-600 hover:text-blue-700" />
                                    </button>
                                    <span 
                                      className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium bg-yellow-50 text-yellow-700 border border-yellow-200 cursor-help relative group"
                                      title="We suggest expert validation before use"
                                    >
                                      review recommended
                                      <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 text-xs text-white bg-gray-900 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap z-10">
                                        We suggest expert validation before use
                                      </div>
                                    </span>
                                  </div>
                                )}
                              </div>
                              <div className="space-y-2">
                                <div className="text-sm text-gray-600 leading-relaxed">{item.reason}</div>
                              </div>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="border border-gray-200 rounded-lg p-3 bg-gray-50/50">
                          <div className="mb-2">
                            <div className="text-xs font-medium text-gray-500 mb-1">RESULT</div>
                            <div className="text-sm font-semibold text-gray-900">{reasoner.results}</div>
                          </div>
                          <div className="pt-2 border-t border-gray-200">
                            <div className="flex items-center space-x-2 mb-1">
                              <div className="text-xs font-medium text-gray-500">REASONING</div>
                              <div className="flex items-center space-x-1">
                                <span 
                                  className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium bg-orange-50 text-orange-700 border border-orange-200 cursor-help relative group"
                                  title="The reason was generated by AI based on the context of attached source"
                                >
                                  inferred
                                  <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 text-xs text-white bg-gray-900 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap z-10">
                                    The reason was generated by AI based on the context of attached source
                                  </div>
                                </span>
                                <ExternalLink size={12} className="text-blue-600" />
                                <span 
                                  className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium bg-yellow-50 text-yellow-700 border border-yellow-200 cursor-help relative group"
                                  title="We suggest expert validation before use"
                                >
                                  review recommended
                                  <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 text-xs text-white bg-gray-900 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap z-10">
                                    We suggest expert validation before use
                                  </div>
                                </span>
                              </div>
                            </div>
                            <div className="space-y-2">
                              <div className="text-sm text-gray-600 leading-relaxed">{reasoner.reason}</div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </td>
                  <td className={`px-6 py-4 whitespace-nowrap text-sm ${
                    reasoner.enabled ? 'text-gray-500' : 'text-gray-400'
                  }`}>
                    {reasoner.lastUpdated}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="relative">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleMenuToggle(reasoner.id);
                        }}
                        className={`p-1 rounded-full hover:bg-gray-100 transition-colors ${
                          reasoner.enabled ? 'text-gray-400 hover:text-gray-600' : 'text-gray-300 hover:text-gray-400'
                        }`}
                      >
                        <MoreVertical size={16} />
                      </button>
                      
                      {/* Dropdown Menu */}
                      {openMenuId === reasoner.id && (
                        <div className="absolute right-0 top-8 w-48 bg-white rounded-md shadow-lg border border-gray-200 py-1 z-10">
                          <button
                            onClick={() => handleAddFeedback(reasoner.id)}
                            className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center space-x-2"
                          >
                            <MessageSquare size={14} />
                            <span>Add feedback</span>
                          </button>
                        </div>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Action Buttons - Show when reasoners are selected */}
      {selectedReasoners.size > 0 && (
        <div className="fixed bottom-8 right-8 flex items-center space-x-3 bg-white rounded-lg shadow-lg border border-gray-200 p-3">
          <button
            onClick={handleDelete}
            className="inline-flex items-center px-4 py-2 text-sm font-medium text-red-700 bg-red-50 border border-red-200 rounded-md hover:bg-red-100 transition-colors"
          >
            <Trash2 size={16} className="mr-2" />
            Delete
          </button>
          
          {/* Dynamic Enable/Disable buttons based on selection status */}
          {selectedStatus === 'all-enabled' && (
            <button
              onClick={handleDisable}
              className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-gray-50 border border-gray-200 rounded-md hover:bg-gray-100 transition-colors"
            >
              <PowerOff size={16} className="mr-2" />
              Disable
            </button>
          )}
          
          {selectedStatus === 'all-disabled' && (
            <button
              onClick={handleEnable}
              className="inline-flex items-center px-4 py-2 text-sm font-medium text-green-700 bg-green-50 border border-green-200 rounded-md hover:bg-green-100 transition-colors"
            >
              <Power size={16} className="mr-2" />
              Enable
            </button>
          )}
          
          {selectedStatus === 'mixed' && (
            <>
              <button
                onClick={handleEnable}
                className="inline-flex items-center px-4 py-2 text-sm font-medium text-green-700 bg-green-50 border border-green-200 rounded-md hover:bg-green-100 transition-colors"
              >
                <Power size={16} className="mr-2" />
                Enable All
              </button>
              <button
                onClick={handleDisable}
                className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-gray-50 border border-gray-200 rounded-md hover:bg-gray-100 transition-colors"
              >
                <PowerOff size={16} className="mr-2" />
                Disable All
              </button>
            </>
          )}
        </div>
      )}

      {/* Feedback Modal */}
      <FeedbackModal
        isOpen={showFeedbackModal}
        onClose={() => {
          setShowFeedbackModal(false);
          setSelectedReasonerForFeedback(null);
        }}
        reasoner={selectedReasonerForFeedback}
      />
    </div>
  );
};

export default ReasonersTable;