import React, { useEffect, useState } from 'react';
import { useApp } from '../../context/AppContext';
import { X, Send, Eye, Heart } from 'lucide-react';

export const StoriesModal = () => {
  const { activeStoryView, setActiveStoryView, sendMessage } = useApp();
  const [progress, setProgress] = useState(0);
  const [replyText, setReplyText] = useState('');

  useEffect(() => {
    if (!activeStoryView) return;
    setProgress(0);
    const interval = setInterval(() => {
      setProgress((p) => {
        if (p >= 100) {
          clearInterval(interval);
          setActiveStoryView(null);
          return 100;
        }
        return p + 2;
      });
    }, 100);

    return () => clearInterval(interval);
  }, [activeStoryView]);

  if (!activeStoryView) return null;

  const handleReply = () => {
    if (replyText.trim()) {
      sendMessage('chat_elena', `Replying to story: ${replyText}`);
      setReplyText('');
      setActiveStoryView(null);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-xl animate-float">
      <div className="relative w-full max-w-md h-[80vh] glass-panel border border-white/20 rounded-3xl overflow-hidden flex flex-col justify-between shadow-2xl">
        {/* Progress Bar Header */}
        <div className="absolute top-0 left-0 right-0 p-4 z-20 bg-gradient-to-b from-black/80 to-transparent">
          <div className="w-full bg-white/20 h-1 rounded-full overflow-hidden mb-3">
            <div
              className="bg-indigo-400 h-full transition-all duration-100 ease-linear"
              style={{ width: `${progress}%` }}
            />
          </div>

          <div className="flex items-center justify-between text-white">
            <div className="flex items-center gap-3">
              <img
                src={activeStoryView.user.avatar}
                alt={activeStoryView.user.name}
                className="w-10 h-10 rounded-xl object-cover ring-2 ring-indigo-500"
              />
              <div>
                <h4 className="font-bold text-xs">{activeStoryView.user.name}</h4>
                <p className="text-[10px] text-gray-300">{activeStoryView.timestamp}</p>
              </div>
            </div>
            <button
              onClick={() => setActiveStoryView(null)}
              className="p-1 rounded-full hover:bg-white/20"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Story Media */}
        <div className="w-full h-full relative flex items-center justify-center bg-black">
          <img
            src={activeStoryView.mediaUrl}
            alt="Story content"
            className="w-full h-full object-cover"
          />
          {activeStoryView.caption && (
            <div className="absolute bottom-20 left-4 right-4 p-3 glass-panel border border-white/20 rounded-2xl text-xs text-white font-medium text-center shadow-xl">
              {activeStoryView.caption}
            </div>
          )}
        </div>

        {/* Reply Bar */}
        <div className="p-4 z-20 bg-gradient-to-t from-black/90 to-transparent flex items-center gap-2">
          <input
            type="text"
            placeholder="Reply to story..."
            value={replyText}
            onChange={(e) => setReplyText(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleReply()}
            className="flex-1 glass-input text-xs py-2.5"
          />
          <button
            onClick={handleReply}
            className="btn-primary p-2.5 rounded-xl shadow-lg shadow-indigo-500/30"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
