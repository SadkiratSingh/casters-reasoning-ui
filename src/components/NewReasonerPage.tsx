import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Zap, Settings, TestTube, Plus, Sparkles, ChevronRight, ChevronLeft, Factory, Thermometer, Users, CheckCircle } from 'lucide-react';

const NewReasonerPage: React.FC = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [condition, setCondition] = useState('');
  const [testQuery, setTestQuery] = useState('');
  const [showSimulatedOutput, setShowSimulatedOutput] = useState(false);
  const [results, setResults] = useState([
    {
      id: 1,
      result: '',
      reasoning: ''
    }
  ]);

  const addNewResult = () => {
    const newId = Math.max(...results.map(r => r.id)) + 1;
    setResults([...results, {
      id: newId,
      result: '',
      reasoning: ''
    }]);
  };

  const updateResult = (id: number, field: 'result' | 'reasoning', value: string) => {
    setResults(results.map(r => 
      r.id === id ? { ...r, [field]: value } : r
    ));
  };

  const removeResult = (id: number) => {
    if (results.length > 1) {
      setResults(results.filter(r => r.id !== id));
    }
  };

  const nextStep = () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const generateTestQueries = () => {
    const sampleQueries = [
      'Which casters work well in greasy floors?',
      'Suggest ergonomic casters for worker comfort',
      'I need wheels that support 1000 lbs and are at least 10 inch high'
    ];
    const randomQuery = sampleQueries[Math.floor(Math.random() * sampleQueries.length)];
    setTestQuery(randomQuery);
    setShowSimulatedOutput(true);
  };

  const handleTestQuerySubmit = () => {
    if (testQuery.trim()) {
      setShowSimulatedOutput(true);
    }
  };

  const getStepIcon = (step: number) => {
    switch (step) {
      case 1: return <Zap size={20} />;
      case 2: return <Settings size={20} />;
      case 3: return <TestTube size={20} />;
      default: return <Zap size={20} />;
    }
  };

  const getStepTitle = (step: number) => {
    switch (step) {
      case 1: return 'Set Condition';
      case 2: return 'Configure Results & Reasoning';
      case 3: return 'Test with Queries';
      default: return 'Set Condition';
    }
  };

  const getStepDescription = (step: number) => {
    switch (step) {
      case 1: return 'Define when the reasoner should activate';
      case 2: return 'Define what product(s) should be shown when the condition is met';
      case 3: return 'Test this reasoner by generating or entering example queries';
      default: return '';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-gray-200/60 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-8 py-6">
          <div className="flex items-center space-x-4 mb-6">
            <button
              onClick={() => navigate(-1)}
              className="p-2.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100/80 rounded-xl transition-all duration-200 hover:scale-105"
            >
              <ArrowLeft size={20} />
            </button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">New Reasoner Setup</h1>
              <p className="text-gray-600 mt-1">Create caster recommendations</p>
            </div>
          </div>
          
          {/* Progress Indicator */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-8">
              {[1, 2, 3].map((step) => (
                <div key={step} className="flex items-center space-x-3">
                  <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 transition-all duration-300 ${
                    step === currentStep
                      ? 'bg-blue-600 border-blue-600 text-white shadow-lg'
                      : step < currentStep
                      ? 'bg-green-500 border-green-500 text-white'
                      : 'bg-white border-gray-300 text-gray-400'
                  }`}>
                    {step < currentStep ? (
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    ) : (
                      <span className="text-sm font-semibold">{step}</span>
                    )}
                  </div>
                  <div className={`${step === currentStep ? 'text-blue-600' : step < currentStep ? 'text-green-600' : 'text-gray-400'}`}>
                    <div className="text-sm font-medium">{getStepTitle(step)}</div>
                  </div>
                  {step < 3 && (
                    <ChevronRight size={16} className="text-gray-300 ml-4" />
                  )}
                </div>
              ))}
            </div>
            <div className="text-sm text-gray-500 bg-gray-100 px-3 py-1.5 rounded-full">
              Step {currentStep} of 3
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="w-full px-8 py-8">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
          {/* Step Header */}
          <div className="bg-blue-50 px-8 py-6 border-b border-gray-200">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-white rounded-xl shadow-sm">
                {getStepIcon(currentStep)}
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">{getStepTitle(currentStep)}</h2>
                <p className="text-gray-600 mt-1">{getStepDescription(currentStep)}</p>
              </div>
            </div>
          </div>

          {/* Step Content */}
          <div className="p-8">
            {currentStep === 1 && (
              <div className="space-y-6">
                <div>
                  <label htmlFor="condition" className="block text-sm font-semibold text-gray-900 mb-3">
                    Trigger Condition
                  </label>
                  <textarea
                    id="condition"
                    rows={4}
                    value={condition}
                    onChange={(e) => setCondition(e.target.value)}
                    placeholder="Enter the condition that should trigger this reasoner..."
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none text-sm"
                  />
                </div>

                <div>
                  <h3 className="text-sm font-semibold text-gray-900 mb-4">Example Condition Types</h3>
                  <div className="grid grid-cols-1 gap-4">
                    {[
                      {
                        type: 'Application-based',
                        example: 'Factory floor with oil exposure',
                        icon: <Factory size={20} className="text-blue-600" />
                      },
                      {
                        type: 'Environmental',
                        example: 'High temperature environment (>150°C)',
                        icon: <Thermometer size={20} className="text-orange-600" />
                      },
                      {
                        type: 'Workforce problem',
                        example: 'Complaints about operator fatigue',
                        icon: <Users size={20} className="text-green-600" />
                      }
                    ].map((item, index) => (
                      <div
                        key={index}
                        onClick={() => setCondition(item.example)}
                        className="p-4 border border-gray-200 rounded-xl hover:border-blue-300 hover:bg-blue-50/50 transition-all duration-200 cursor-pointer group"
                      >
                        <div className="flex items-start space-x-3">
                          <div className="p-2 bg-gray-100 rounded-lg">
                            {item.icon}
                          </div>
                          <div>
                            <div className="font-medium text-gray-900 group-hover:text-blue-700">
                              {item.type}
                            </div>
                            <div className="text-sm text-gray-600 mt-1">
                              "{item.example}"
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {currentStep === 2 && (
              <div className="space-y-6">
                <div className="space-y-4">
                  {results.map((result, index) => (
                    <div key={result.id} className="bg-gray-50 rounded-xl p-6 border border-gray-200">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold text-gray-900">
                          Result & Reasoning #{index + 1}
                        </h3>
                        {results.length > 1 && (
                          <button
                            onClick={() => removeResult(result.id)}
                            className="text-red-500 hover:text-red-700 text-sm font-medium"
                          >
                            Remove
                          </button>
                        )}
                      </div>
                      
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Result
                          </label>
                          <input
                            type="text"
                            value={result.result}
                            onChange={(e) => updateResult(result.id, 'result', e.target.value)}
                            placeholder="e.g., Ergonomic Casters – Polyurethane, 6 inch wheels"
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                          />
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Reasoning
                          </label>
                          <textarea
                            rows={3}
                            value={result.reasoning}
                            onChange={(e) => updateResult(result.id, 'reasoning', e.target.value)}
                            placeholder="e.g., Reduces operator strain and is ideal for smooth factory floors with oil resistance"
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none text-sm"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <button
                  onClick={addNewResult}
                  className="w-full flex items-center justify-center space-x-2 px-6 py-4 border-2 border-dashed border-gray-300 rounded-xl text-gray-600 hover:border-blue-400 hover:text-blue-600 hover:bg-blue-50/50 transition-all duration-200"
                >
                  <Plus size={20} />
                  <span className="font-medium">Add another result + reasoning</span>
                </button>
              </div>
            )}

            {currentStep === 3 && (
              <div className="space-y-8">
                {/* Full Width Container - No additional wrapper needed */}
                <div className="w-full">
                  <div className="flex flex-col lg:flex-row gap-8">
                    {/* Left Panel: Test Query Input (40%) */}
                    <div className="lg:w-1/5 bg-gray-50 rounded-xl p-6">
                      <div>
                        <h3 className="text-xl font-medium text-gray-900 mb-2">Test Query Input</h3>
                        <p className="text-sm text-gray-500 mb-4">
                          Simulate real-world queries to see how your reasoner responds
                        </p>
                        
                        <div className="space-y-4">
                          <div>
                            <label htmlFor="testQuery" className="block text-sm font-medium text-gray-700 mb-4">
                              Enter test query
                            </label>
                            <textarea
                              id="testQuery"
                              value={testQuery}
                              onChange={(e) => setTestQuery(e.target.value)}
                              placeholder="Type a query or click generate…"
                              className="w-full h-14 px-4 py-4 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none text-base bg-white"
                              style={{ minHeight: '56px' }}
                            />
                          </div>
                          
                          <div className="flex flex-col space-y-3">
                            <button
                              onClick={handleTestQuerySubmit}
                              disabled={!testQuery.trim()}
                              className="w-full px-6 py-3 bg-blue-600 text-white font-medium rounded-xl hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 text-base"
                            >
                              Test Query
                            </button>
                            <button
                              onClick={generateTestQueries}
                              className="w-full flex items-center justify-center space-x-2 px-6 py-3 bg-white border border-gray-300 text-gray-700 font-medium rounded-xl hover:bg-gray-50 transition-all duration-200 text-base"
                            >
                              <Sparkles size={16} />
                              <span>Generate with AI</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Right Panel: Reasoner Output (80%) */}
                    <div className="lg:w-4/5 space-y-6 bg-white rounded-xl border border-gray-200 p-6">
                      <div>
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">Reasoner Output (Simulated)</h3>
                        <p className="text-gray-600 mb-6">
                          Preview how your reasoner will respond
                        </p>
                        
                        {showSimulatedOutput ? (
                          <div className="space-y-6">
                            {/* Simulated Output Badge */}
                            <div className="flex justify-end">
                              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700 border border-blue-200">
                                Simulated Output — Preview only
                              </span>
                            </div>
                            
                            {/* Detected Condition */}
                            <div>
                              <h4 className="text-sm font-medium text-gray-700 mb-3">Detected Condition</h4>
                              <div className="inline-flex items-center space-x-2 px-4 py-2 bg-green-50 text-green-700 rounded-lg border border-green-200">
                                <CheckCircle size={16} />
                                <span className="font-medium">
                                  {condition || 'Greasy floor environment'}
                                </span>
                              </div>
                            </div>
                            
                            {/* Reasoning Text */}
                            <div>
                              <h4 className="text-sm font-medium text-gray-700 mb-3">Reasoning</h4>
                              <div className="bg-purple-50 border border-purple-200 rounded-xl p-4">
                                <p className="text-gray-700 leading-relaxed">
                                  {results[0]?.reasoning || 'Polyurethane is chosen for its oil resistance and smooth roll on slippery floors. These casters provide excellent traction and durability in challenging industrial environments.'}
                                </p>
                              </div>
                            </div>
                            
                            {/* Product Cards */}
                            <div>
                              <h4 className="text-sm font-medium text-gray-700 mb-3">Recommended Products</h4>
                              <div className="overflow-x-auto pb-2">
                                <div className="flex space-x-4" style={{ minWidth: '1200px' }}>
                                  {/* Product Card 1 */}
                                  <div className="flex-shrink-0 w-80 bg-white border border-gray-200 rounded-xl p-4 shadow-sm hover:shadow-md transition-all duration-200 hover:-translate-y-1">
                                    <div className="mb-3">
                                      <h5 className="font-semibold text-gray-900 text-sm mb-1">
                                        {results[0]?.result || '6 inch Polyurethane Swivel Caster'}
                                      </h5>
                                      <p className="text-xs text-gray-500">Heavy-Duty Series</p>
                                    </div>
                                    <div className="space-y-2 mb-4">
                                      <div className="flex justify-between text-xs">
                                        <span className="text-gray-500">Load Capacity:</span>
                                        <span className="font-medium text-gray-900">1000 lbs</span>
                                      </div>
                                      <div className="flex justify-between text-xs">
                                        <span className="text-gray-500">Height:</span>
                                        <span className="font-medium text-gray-900">8.5 inches</span>
                                      </div>
                                      <div className="flex justify-between text-xs">
                                        <span className="text-gray-500">Wheel Type:</span>
                                        <span className="font-medium text-gray-900">Polyurethane</span>
                                      </div>
                                    </div>
                                    <button className="w-full px-3 py-2 text-xs font-medium text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors">
                                      View Details
                                    </button>
                                  </div>
                                  
                                  {/* Product Card 2 */}
                                  <div className="flex-shrink-0 w-80 bg-white border border-gray-200 rounded-xl p-4 shadow-sm hover:shadow-md transition-all duration-200 hover:-translate-y-1">
                                    <div className="mb-3">
                                      <h5 className="font-semibold text-gray-900 text-sm mb-1">
                                        4 inch Polyurethane Rigid Caster
                                      </h5>
                                      <p className="text-xs text-gray-500">Medium-Duty Series</p>
                                    </div>
                                    <div className="space-y-2 mb-4">
                                      <div className="flex justify-between text-xs">
                                        <span className="text-gray-500">Load Capacity:</span>
                                        <span className="font-medium text-gray-900">500 lbs</span>
                                      </div>
                                      <div className="flex justify-between text-xs">
                                        <span className="text-gray-500">Height:</span>
                                        <span className="font-medium text-gray-900">5.5 inches</span>
                                      </div>
                                      <div className="flex justify-between text-xs">
                                        <span className="text-gray-500">Wheel Type:</span>
                                        <span className="font-medium text-gray-900">Polyurethane</span>
                                      </div>
                                    </div>
                                    <button className="w-full px-3 py-2 text-xs font-medium text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors">
                                      View Details
                                    </button>
                                  </div>
                                  
                                  {/* Product Card 3 */}
                                  <div className="flex-shrink-0 w-80 bg-white border border-gray-200 rounded-xl p-4 shadow-sm hover:shadow-md transition-all duration-200 hover:-translate-y-1">
                                    <div className="mb-3">
                                      <h5 className="font-semibold text-gray-900 text-sm mb-1">
                                        8 inch Polyurethane Brake Caster
                                      </h5>
                                      <p className="text-xs text-gray-500">Industrial Series</p>
                                    </div>
                                    <div className="space-y-2 mb-4">
                                      <div className="flex justify-between text-xs">
                                        <span className="text-gray-500">Load Capacity:</span>
                                        <span className="font-medium text-gray-900">1500 lbs</span>
                                      </div>
                                      <div className="flex justify-between text-xs">
                                        <span className="text-gray-500">Height:</span>
                                        <span className="font-medium text-gray-900">10.5 inches</span>
                                      </div>
                                      <div className="flex justify-between text-xs">
                                        <span className="text-gray-500">Wheel Type:</span>
                                        <span className="font-medium text-gray-900">Polyurethane</span>
                                      </div>
                                    </div>
                                    <button className="w-full px-3 py-2 text-xs font-medium text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors">
                                      View Details
                                    </button>
                                  </div>
                                  
                                  {/* Product Card 4 */}
                                  <div className="flex-shrink-0 w-80 bg-white border border-gray-200 rounded-xl p-4 shadow-sm hover:shadow-md transition-all duration-200 hover:-translate-y-1">
                                    <div className="mb-3">
                                      <h5 className="font-semibold text-gray-900 text-sm mb-1">
                                        5 inch Polyurethane Swivel Caster
                                      </h5>
                                      <p className="text-xs text-gray-500">Standard Series</p>
                                    </div>
                                    <div className="space-y-2 mb-4">
                                      <div className="flex justify-between text-xs">
                                        <span className="text-gray-500">Load Capacity:</span>
                                        <span className="font-medium text-gray-900">750 lbs</span>
                                      </div>
                                      <div className="flex justify-between text-xs">
                                        <span className="text-gray-500">Height:</span>
                                        <span className="font-medium text-gray-900">6.5 inches</span>
                                      </div>
                                      <div className="flex justify-between text-xs">
                                        <span className="text-gray-500">Wheel Type:</span>
                                        <span className="font-medium text-gray-900">Polyurethane</span>
                                      </div>
                                    </div>
                                    <button className="w-full px-3 py-2 text-xs font-medium text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors">
                                      View Details
                                    </button>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        ) : (
                          <div className="bg-gray-50 border border-gray-200 rounded-xl p-12 text-center">
                            <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                              <TestTube size={24} className="text-gray-400" />
                            </div>
                            <h4 className="font-medium text-gray-900 mb-2">No Test Results Yet</h4>
                            <p className="text-sm text-gray-500">
                              Enter a test query to see how your reasoner will respond
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Navigation */}
          <div className="bg-gray-50 px-8 py-6 border-t border-gray-200 flex items-center justify-between">
            <button
              onClick={prevStep}
              disabled={currentStep === 1}
              className="flex items-center space-x-2 px-6 py-3 text-gray-600 bg-white border border-gray-300 rounded-xl hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
            >
              <ChevronLeft size={16} />
              <span>Previous</span>
            </button>

            <div className="flex items-center space-x-3">
              {currentStep < 3 ? (
                <button
                  onClick={nextStep}
                  className="flex items-center space-x-2 px-8 py-3 bg-blue-600 text-white font-medium rounded-xl hover:bg-blue-700 transition-all duration-200 transform hover:scale-105 shadow-lg"
                >
                  <span>Next Step</span>
                  <ChevronRight size={16} />
                </button>
              ) : (
                <button
                  onClick={() => navigate('/')}
                  className="px-8 py-3 bg-green-600 text-white font-medium rounded-xl hover:bg-green-700 transition-all duration-200 transform hover:scale-105 shadow-lg"
                >
                  Publish Reasoner
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewReasonerPage;