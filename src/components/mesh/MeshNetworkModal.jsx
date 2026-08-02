import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { novaMeshEngine } from '../../services/novamesh';
import {
  Radio,
  Signal,
  AlertTriangle,
  Send,
  X,
  RefreshCw,
  Share2,
  HardDrive,
  Layers,
  Cpu,
} from 'lucide-react';

export const MeshNetworkModal = () => {
  const { meshTopologyOpen, setMeshTopologyOpen, isOfflineMesh, toggleOfflineMesh } = useApp();
  const [nodes, setNodes] = useState([]);
  const [isScanning, setIsScanning] = useState(false);
  const [sosSent, setSosSent] = useState(false);

  useEffect(() => {
    if (meshTopologyOpen) {
      handleScan();
    }
  }, [meshTopologyOpen]);

  const handleScan = () => {
    setIsScanning(true);
    setTimeout(() => {
      setNodes(novaMeshEngine.scanNearbyNodes());
      setIsScanning(false);
    }, 1200);
  };

  const handleTriggerSOS = () => {
    novaMeshEngine.triggerEmergencySOS();
    setSosSent(true);
    setTimeout(() => setSosSent(false), 4000);
  };

  if (!meshTopologyOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xl animate-float">
      <div className="w-full max-w-4xl glass-panel border border-cyan-500/30 rounded-3xl overflow-hidden flex flex-col shadow-2xl">
        {/* Modal Header */}
        <div className="p-6 border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
              <Radio className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-100 flex items-center gap-2">
                NovaMesh Topology Radar
                <span className="text-xs px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 font-normal">
                  P2P Offline Engine
                </span>
              </h2>
              <p className="text-xs text-gray-400">
                Bluetooth LE • Wi-Fi Direct • Local Mesh Packet Routing
              </p>
            </div>
          </div>
          <button
            onClick={() => setMeshTopologyOpen(false)}
            className="p-2 rounded-xl text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6 overflow-y-auto max-h-[70vh]">
          {/* Radar Scan Visualizer */}
          <div className="glass-card p-6 flex flex-col items-center justify-center relative overflow-hidden min-h-[300px] border-cyan-500/20">
            <div className="w-48 h-48 rounded-full border border-cyan-500/30 relative flex items-center justify-center">
              <div className="w-32 h-32 rounded-full border border-cyan-500/20" />
              <div className="w-16 h-16 rounded-full border border-cyan-500/10" />

              {/* Radar Sweeping Beam */}
              <div
                className={`absolute inset-0 rounded-full bg-gradient-to-tr from-cyan-500/20 to-transparent ${
                  isScanning ? 'radar-sweep' : ''
                }`}
              />

              {/* Central Node */}
              <div className="w-6 h-6 rounded-full bg-indigo-500 text-white flex items-center justify-center font-bold text-[10px] z-10 shadow-lg shadow-indigo-500/50">
                YOU
              </div>

              {/* Nearby Nodes on Radar */}
              {nodes.map((node, i) => (
                <div
                  key={node.id}
                  className="absolute p-2 rounded-xl bg-slate-900/90 border border-cyan-400/40 text-[10px] text-cyan-200 font-semibold shadow-xl flex items-center gap-1.5 animate-pulse"
                  style={{
                    top: `${20 + i * 22}%`,
                    left: `${15 + i * 24}%`,
                  }}
                >
                  <Signal className="w-3 h-3 text-emerald-400" />
                  {node.name.split(' ')[0]} ({node.rssi}dBm)
                </div>
              ))}
            </div>

            <button
              onClick={handleScan}
              disabled={isScanning}
              className="mt-6 btn-glass text-xs py-2 px-4 flex items-center gap-2 hover:text-cyan-300"
            >
              <RefreshCw className={`w-4 h-4 ${isScanning ? 'animate-spin' : ''}`} />
              {isScanning ? 'Scanning Radio Frequencies...' : 'Scan Nearby Mesh Nodes'}
            </button>
          </div>

          {/* Mesh Nodes List & Controls */}
          <div className="flex flex-col gap-4">
            <div className="glass-card p-4">
              <h3 className="text-xs font-bold text-gray-200 uppercase tracking-wider mb-3 flex items-center gap-2">
                <Layers className="w-4 h-4 text-cyan-400" /> Discovered Mesh Peers ({nodes.length})
              </h3>
              <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                {nodes.map((node) => (
                  <div
                    key={node.id}
                    className="p-2.5 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between text-xs"
                  >
                    <div>
                      <div className="font-semibold text-gray-100">{node.name}</div>
                      <div className="text-[10px] text-gray-400">
                        Type: {node.type} • Hop Distance: {node.hops} hop(s)
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="font-mono text-emerald-400 font-bold">{node.rssi} dBm</span>
                      <div className="text-[10px] text-gray-400 capitalize">{node.status}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Emergency SOS Flood Broadcast Box */}
            <div className="glass-card p-4 border-rose-500/30 bg-rose-950/20">
              <div className="flex items-center gap-2 text-rose-400 font-bold text-sm mb-1">
                <AlertTriangle className="w-5 h-5 animate-bounce" /> Emergency SOS Flood Broadcast
              </div>
              <p className="text-[11px] text-gray-300 mb-3">
                Broadcasts high-priority encrypted emergency beacon to all nearby devices within Bluetooth/Wi-Fi RF range even without internet.
              </p>

              <button
                onClick={handleTriggerSOS}
                className={`w-full py-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all ${
                  sosSent
                    ? 'bg-emerald-600 text-white'
                    : 'bg-rose-600 hover:bg-rose-700 text-white shadow-lg shadow-rose-600/30'
                }`}
              >
                <AlertTriangle className="w-4 h-4" />
                {sosSent ? 'Emergency Beacon Transmitted!' : 'Trigger Emergency SOS Broadcast'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
