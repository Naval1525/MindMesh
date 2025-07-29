import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Mail } from 'lucide-react';

interface FeedbackModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit?: () => void;
}

const FeedbackModal: React.FC<FeedbackModalProps> = ({ isOpen, onClose, onSubmit }) => {
  const [selectedReaction, setSelectedReaction] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Debug log
  console.log('FeedbackModal render - isOpen:', isOpen);

  const reactions = [
    { emoji: '😞', label: 'Didn\'t like it', value: 'didnt_like' },
    { emoji: '😊', label: 'Good', value: 'good' },
    { emoji: '😍', label: 'Best', value: 'best' },
    { emoji: '❤️', label: 'Loved it!', value: 'loved_it' },
  ];

  const handleSubmit = async () => {
    if (!selectedReaction) return;

    setIsSubmitting(true);

    try {
      // Direct Google Forms submission
      const formUrl = 'https://docs.google.com/forms/d/e/1FAIpQLSccs2Y2WyefKdgLzA7lmYubTuE6vRyxa5jHXYIOMAffDjwYFA/formResponse';
      
      // Map reaction values to your form's exact labels
      const reactionMapping: Record<string, string> = {
        'didnt_like': 'Didn\'t like it',
        'good': 'good',
        'best': 'Best',
        'loved_it': 'Loved it'
      };
      
      const formReaction = reactionMapping[selectedReaction] || selectedReaction;
      
      // Create form data for direct Google Forms submission
      const formData = new FormData();
      
      // Feedback field - using your actual field ID
      formData.append('entry.2038293830', formReaction);
      
      // Email field - using your actual field ID
      if (email.trim()) {
        formData.append('entry.2041692023', email.trim());
      }
      
      // Submit directly to Google Forms
      await fetch(formUrl, {
        method: 'POST',
        body: formData,
        mode: 'no-cors' // Required for Google Forms
      });

      // Show success message
      setIsSubmitted(true);
      if (onSubmit) {
        onSubmit();
      }
      setTimeout(() => {
        onClose();
        setIsSubmitted(false);
        setSelectedReaction('');
        setEmail('');
      }, 2000);
      
    } catch (error) {
      console.error('Feedback submission error:', error);
      
      // Show success even if there's an error (no-cors doesn't give response details)
      setIsSubmitted(true);
      if (onSubmit) {
        onSubmit();
      }
      setTimeout(() => {
        onClose();
        setIsSubmitted(false);
        setSelectedReaction('');
        setEmail('');
      }, 2000);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full p-6"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
              How did you like MindMesh?
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            >
              <X size={24} />
            </button>
          </div>

          {!isSubmitted ? (
            <>
              {/* Emoji Reactions */}
              <div className="mb-6">
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                  Select your reaction:
                </p>
                <div className="grid grid-cols-4 gap-3">
                  {reactions.map((reaction) => (
                    <motion.button
                      key={reaction.value}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setSelectedReaction(reaction.value)}
                      className={`p-4 rounded-lg border-2 transition-all duration-200 ${
                        selectedReaction === reaction.value
                          ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                          : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500'
                      }`}
                    >
                      <div className="text-3xl mb-2">{reaction.emoji}</div>
                      <div className="text-xs font-medium text-gray-700 dark:text-gray-300">
                        {reaction.label}
                      </div>
                    </motion.button>
                  ))}
                </div>
              </div>

              {/* Email Input */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Email (optional)
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your@email.com"
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  We'll use this to follow up on your feedback
                </p>
              </div>

              {/* Submit Button */}
              <button
                onClick={handleSubmit}
                disabled={!selectedReaction || isSubmitting}
                className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200"
              >
                {isSubmitting ? 'Submitting...' : 'Submit Feedback'}
              </button>
            </>
          ) : (
            <div className="text-center py-8">
              <div className="text-6xl mb-4">🎉</div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Thank you for your feedback!
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Your response helps us improve MindMesh.
              </p>
            </div>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default FeedbackModal;