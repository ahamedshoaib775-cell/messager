import React from 'react';
import { useApp } from '../../context/AppContext';
import { Plus, Eye, Sparkles } from 'lucide-react';

export const StoriesBar = () => {
  const { stories, setActiveStoryView, currentUser } = useApp();

  return (
    <div className="p-4 glass-panel border-b border-white/10 flex items-center gap-4 overflow-x-auto no-scrollbar">
      {/* Create Story Button */}
      <div className="flex flex-col items-center gap-1 flex-shrink-0 cursor-pointer group">
        <div className="relative w-14 h-14 rounded-2xl p-[2px] bg-gradient-to-tr from-indigo-500 to-cyan-400">
          <img
            src={currentUser.avatar}
            alt="Your Story"
            className="w-full h-full rounded-[14px] object-cover"
          />
          <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-indigo-600 text-white flex items-center justify-center border-2 border-slate-950">
            <Plus className="w-3.5 h-3.5" />
          </div>
        </div>
        <span className="text-[11px] text-gray-300 font-medium truncate w-16 text-center">
          Your Story
        </span>
      </div>

      {/* Friends Stories */}
      {stories.map((story) => (
        <div
          key={story.id}
          onClick={() => setActiveStoryView(story)}
          className="flex flex-col items-center gap-1 flex-shrink-0 cursor-pointer group"
        >
          <div className="w-14 h-14 rounded-2xl p-[2px] bg-gradient-to-tr from-pink-500 via-indigo-500 to-cyan-400 group-hover:scale-105 transition-transform shadow-lg shadow-indigo-500/20">
            <img
              src={story.user.avatar}
              alt={story.user.name}
              className="w-full h-full rounded-[14px] object-cover ring-2 ring-slate-950"
            />
          </div>
          <span className="text-[11px] text-gray-300 font-medium truncate w-16 text-center">
            {story.user.name.split(' ')[0]}
          </span>
        </div>
      ))}
    </div>
  );
};
