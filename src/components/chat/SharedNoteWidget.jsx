import React, { useState } from 'react';
import { FileText, Save, Users, Sparkles } from 'lucide-react';

export const SharedNoteWidget = () => {
  const [noteContent, setNoteContent] = useState(
    `# 📝 NovaLink Sprint Objectives\n- [x] Integrate E2EE Signal Double Ratchet protocol\n- [x] Test NovaMesh Bluetooth LE hop latency (<15ms)\n- [ ] Finalize WebRTC 1080p group video calling`
  );
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="my-3 p-4 glass-card border border-cyan-500/30 rounded-2xl max-w-lg">
      <div className="flex items-center justify-between mb-3 border-b border-white/10 pb-2">
        <div className="flex items-center gap-2">
          <FileText className="w-5 h-5 text-cyan-400" />
          <h4 className="font-bold text-sm text-gray-100">Shared Collaborative Canvas Note</h4>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[10px] px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 font-medium flex items-center gap-1">
            <Users className="w-3 h-3" /> 2 Active Editors
          </span>
          <button
            onClick={handleSave}
            className="btn-glass text-xs py-1 px-2.5 flex items-center gap-1 hover:text-cyan-400"
          >
            <Save className="w-3.5 h-3.5" />
            {saved ? 'Saved!' : 'Save'}
          </button>
        </div>
      </div>

      <textarea
        value={noteContent}
        onChange={(e) => setNoteContent(e.target.value)}
        rows={4}
        className="w-full glass-input text-xs font-mono resize-none focus:border-cyan-400"
        placeholder="Type shared note markdown here..."
      />
    </div>
  );
};
