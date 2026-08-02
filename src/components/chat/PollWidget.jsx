import React, { useState } from 'react';
import { Vote, CheckCircle2 } from 'lucide-react';

export const PollWidget = ({ poll }) => {
  const [currentPoll, setCurrentPoll] = useState(poll);
  const [selectedOpt, setSelectedOpt] = useState(poll.userVoted || null);

  const handleVote = (index) => {
    if (selectedOpt !== null) return; // Prevent double vote

    const updatedOptions = currentPoll.options.map((opt, i) => {
      if (i === index) {
        return { ...opt, votes: opt.votes + 1 };
      }
      return opt;
    });

    const totalVotes = currentPoll.totalVotes + 1;
    const finalOptions = updatedOptions.map((opt) => ({
      ...opt,
      percent: Math.round((opt.votes / totalVotes) * 100),
    }));

    setSelectedOpt(index);
    setCurrentPoll({
      ...currentPoll,
      options: finalOptions,
      totalVotes,
      userVoted: index,
    });
  };

  return (
    <div className="my-2 p-4 glass-card border border-indigo-500/30 rounded-2xl max-w-md">
      <div className="flex items-center gap-2 mb-3">
        <Vote className="w-5 h-5 text-indigo-400" />
        <h4 className="font-bold text-sm text-gray-100">{currentPoll.question}</h4>
      </div>

      <div className="space-y-2 mb-3">
        {currentPoll.options.map((opt, idx) => {
          const isSelected = selectedOpt === idx;

          return (
            <button
              key={idx}
              onClick={() => handleVote(idx)}
              className={`w-full p-2.5 rounded-xl border text-left transition-all relative overflow-hidden ${
                isSelected
                  ? 'border-indigo-500 bg-indigo-500/20'
                  : 'border-white/10 hover:border-white/20 bg-white/5'
              }`}
            >
              {/* Animated Progress Fill */}
              <div
                className="absolute left-0 top-0 bottom-0 bg-indigo-500/20 transition-all duration-500"
                style={{ width: `${opt.percent || 0}%` }}
              />

              <div className="relative z-10 flex items-center justify-between text-xs">
                <span className="font-medium text-gray-200 flex items-center gap-2">
                  {isSelected && <CheckCircle2 className="w-4 h-4 text-indigo-400" />}
                  {opt.text}
                </span>
                <span className="font-mono text-gray-400 font-semibold">
                  {opt.percent || 0}%
                </span>
              </div>
            </button>
          );
        })}
      </div>

      <div className="text-[11px] text-gray-400 flex items-center justify-between border-t border-white/10 pt-2">
        <span>{currentPoll.totalVotes} votes</span>
        <span>Anonymous E2EE Poll</span>
      </div>
    </div>
  );
};
