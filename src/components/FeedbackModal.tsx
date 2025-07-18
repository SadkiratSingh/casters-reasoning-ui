import React, { useState } from 'react';
import { X, MessageSquare } from 'lucide-react';
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

interface FeedbackModalProps {
  isOpen: boolean;
  onClose: () => void;
  reasoner: Reasoner | null;
}

const FeedbackModal: React.FC<FeedbackModalProps> = ({ isOpen, onClose, reasoner }) => {
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    console.log('Feedback submitted:', {
      reasonerId: reasoner?.id,
      comment
    });
    
    setIsSubmitting(false);
    handleClose();
  };

  const handleClose = () => {
    setComment('');
    onClose();
  };

  if (!isOpen || !reasoner) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-3xl mx-4 max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-50 rounded-lg">
              <MessageSquare size={20} className="text-blue-600" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Add Feedback</h2>
              <p className="text-sm text-gray-500">Help us improve this reasoner</p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 max-h-[calc(90vh-140px)] overflow-y-auto">
          {/* Reasoner Summary */}
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <h3 className="text-sm font-medium text-gray-900 mb-2">Reasoner Details</h3>
            <div className="space-y-2 text-sm">
              <div>
                <span className="font-medium text-gray-700">Condition:</span>
                <div className="ml-2 mt-1">
                  <span className="text-gray-600">{reasoner.condition}</span>
                </div>
              </div>
              <div>
                <span className="font-medium text-gray-700">Results with Reasoning:</span>
                <div className="ml-2 mt-2 space-y-2">
                  {reasoner.result_with_reasoning && reasoner.result_with_reasoning.length > 0
                    ? reasoner.result_with_reasoning.map((item, i) => (
                      <div key={i} className="mb-6 p-4 border rounded bg-white">
                        {/* Result Section */}
                        <div className="mb-2">
                          <div className="flex items-center gap-1 text-gray-700 font-semibold">
                            <span>Result</span>
                            <LabelWithTooltip
                              type="sourced"
                              source_url={item.result.url}
                              enabled={reasoner.enabled}
                            />
                          </div>
                          <div className="mt-1 text-gray-900 font-semibold text-sm pl-1">
                            {item.result.content}
                          </div>
                        </div>

                        <hr className="my-3 border-gray-300" />

                        {/* Reasoning Section */}
                        <div className="text-gray-700 text-sm">
                          <div className="flex items-center gap-1 font-semibold">
                            <span>Reasoning</span>
                            {item.reasoning.justification_flag === 'identified' ? (
                              <LabelWithTooltip
                                type="sourced"
                                source_url={item.reasoning.url}
                                enabled={reasoner.enabled}
                              />
                            ) : (
                              <>
                                <LabelWithTooltip
                                  type="inferred"
                                  source_url={item.reasoning.url}
                                  enabled={reasoner.enabled}
                                />
                                <LabelWithTooltip
                                  type="review recommended"
                                  source_url={item.reasoning.url}
                                  enabled={reasoner.enabled}
                                />
                              </>
                            )}
                          </div>
                          <div className="mt-1 pl-1">{item.reasoning.content}</div>
                        </div>
                      </div>
                    ))
                    : (
                      <div className="text-gray-600 text-sm">No results available</div>
                    )}
                </div>
              </div>
            </div>
          </div>

          {/* Existing Feedback */}
          {reasoner.feedback && reasoner.feedback.length > 0 && (
            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <h3 className="text-sm font-medium text-gray-900 mb-3">Previous Feedback</h3>
              <div className="space-y-3">
                {reasoner.feedback.map((feedback, index) => (
                  <div key={index} className="bg-white rounded-md p-3 border border-gray-200">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-medium text-gray-600">{feedback.user}</span>
                      <span className="text-xs text-gray-500">{new Date(feedback.created_at).toLocaleDateString()}</span>
                    </div>
                    <p className="text-sm text-gray-700">{feedback.feedback}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Comment */}
            <div>
              <label htmlFor="comment" className="block text-sm font-medium text-gray-700 mb-2">
                Comments
              </label>
              <textarea
                id="comment"
                rows={4}
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Share your thoughts about this reasoner's accuracy, usefulness, or suggestions for improvement..."
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              />
              <p className="mt-1 text-xs text-gray-500">
                Your feedback helps us improve the AI
              </p>
            </div>

            {/* Submit Buttons */}
            <div className="flex items-center justify-end space-x-3 pt-4 border-t border-gray-200">
              <button
                type="button"
                onClick={handleClose}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting || !comment.trim()}
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isSubmitting ? (
                  <div className="flex items-center space-x-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    <span>Submitting...</span>
                  </div>
                ) : (
                  'Submit Feedback'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default FeedbackModal;