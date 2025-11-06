import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { HelpContext } from '../types';
import { getHint } from '../utils/feedback';

interface HelpPanelProps {
  problemType: 'division' | 'multiplication';
  helpContext: HelpContext;
  isOpen: boolean;
  onToggle: () => void;
}

export default function HelpPanel({
  problemType,
  helpContext,
  isOpen,
  onToggle,
}: HelpPanelProps) {
  const [showMore, setShowMore] = useState(false);

  const hint = getHint(helpContext, problemType);

  const panelVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
    exit: { opacity: 0, y: 10, transition: { duration: 0.2 } },
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 px-4 pb-4">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            variants={panelVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="max-w-2xl mx-auto"
          >
            <div className="bg-white rounded-2xl shadow-2xl overflow-hidden border-2 border-amber-300">
              {/* Header */}
              <div className="bg-gradient-to-r from-amber-400 to-orange-400 px-6 py-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">💡</span>
                  <h3 className="text-lg font-bold text-gray-800">Hint & Tips</h3>
                </div>
                <button
                  onClick={onToggle}
                  className="text-gray-600 hover:text-gray-800 text-xl font-bold"
                >
                  ✕
                </button>
              </div>

              {/* Content */}
              <div className="p-6">
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  className="mb-4"
                >
                  <p className="text-gray-700 text-lg leading-relaxed font-medium">
                    {hint}
                  </p>
                </motion.div>

                {/* Additional Tips */}
                {showMore && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mt-4 pt-4 border-t border-gray-200"
                  >
                    {problemType === 'division' && (
                      <div className="space-y-3 text-sm text-gray-600">
                        <p>
                          <strong>Remember:</strong> Division is about asking "how many times does the divisor go into this number?"
                        </p>
                        <p>
                          <strong>Each step:</strong> Divide → Multiply → Subtract → Bring Down
                        </p>
                        <p>
                          <strong>Check:</strong> Make sure the remainder is less than the divisor.
                        </p>
                      </div>
                    )}
                    {problemType === 'multiplication' && (
                      <div className="space-y-3 text-sm text-gray-600">
                        <p>
                          <strong>Remember:</strong> Multiply each digit of the bottom number by each digit of the top.
                        </p>
                        <p>
                          <strong>Position:</strong> Each row represents a digit position. Shift left accordingly.
                        </p>
                        <p>
                          <strong>Final step:</strong> Add all partial products together.
                        </p>
                      </div>
                    )}
                  </motion.div>
                )}

                {/* Toggle More Button */}
                <button
                  onClick={() => setShowMore(!showMore)}
                  className="mt-4 text-indigo-600 hover:text-indigo-700 font-semibold text-sm"
                >
                  {showMore ? '← Less' : 'More tips →'}
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Toggle Button */}
      {!isOpen && (
        <motion.button
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          onClick={onToggle}
          className="fixed bottom-4 right-4 bg-amber-400 hover:bg-amber-500 text-gray-800 font-bold py-3 px-4 rounded-full shadow-lg transition-all text-2xl"
        >
          💡
        </motion.button>
      )}
    </div>
  );
}
