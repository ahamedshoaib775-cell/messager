import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Header } from './components/layout/Header';
import { SidebarNav } from './components/layout/SidebarNav';
import { ChatSidebar } from './components/layout/ChatSidebar';
import { ChatWindow } from './components/chat/ChatWindow';
import { NewContactModal } from './components/chat/NewContactModal';
import { FuturisticLoginPage } from './components/auth/FuturisticLoginPage';
import { CommunitiesView } from './components/social/CommunitiesView';
import { ChannelsView } from './components/social/ChannelsView';
import { StoriesBar } from './components/social/StoriesBar';
import { StoriesModal } from './components/social/StoriesModal';
import { CallModal } from './components/calls/CallModal';
import { MeshNetworkModal } from './components/mesh/MeshNetworkModal';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { AuthModal } from './components/auth/AuthModal';
import { SettingsModal } from './components/settings/SettingsModal';
import './styles/index.css';

const MainLayout = () => {
  const { activeTab, authModalOpen, setMeshTopologyOpen, setE2eeModalOpen } = useApp();

  // If user opens auth modal, show full Futuristic Login Page
  if (authModalOpen) {
    return <FuturisticLoginPage />;
  }

  return (
    <div className="flex flex-col w-screen h-screen overflow-hidden bg-[#0B1020] text-gray-100 font-sans select-none">
      {/* Top Glassmorphic Navigation Header */}
      <Header />

      {/* Main Content Workspace */}
      <div className="flex flex-1 overflow-hidden relative">
        {/* Left Vertical Icon Bar */}
        <SidebarNav />

        {/* Dynamic Tab Views */}
        {activeTab === 'chats' && (
          <div className="flex flex-1 overflow-hidden">
            <ChatSidebar />
            <div className="flex-1 flex flex-col overflow-hidden">
              <StoriesBar />
              <ChatWindow />
            </div>
          </div>
        )}

        {activeTab === 'communities' && <CommunitiesView />}
        {activeTab === 'channels' && <ChannelsView />}
        {activeTab === 'admin' && <AdminDashboard />}

        {activeTab === 'stories' && (
          <div className="flex-1 flex flex-col p-6">
            <StoriesBar />
            <div className="flex-1 flex items-center justify-center text-gray-400 text-sm glass-panel m-4 rounded-3xl">
              Select a story above to view high-resolution 24h media updates.
            </div>
          </div>
        )}

        {activeTab === 'mesh' && (
          <div className="flex-1 flex items-center justify-center p-8 glass-panel m-6 rounded-3xl">
            <div className="text-center space-y-4 max-w-md">
              <h2 className="text-2xl font-extrabold gradient-text">NovaMesh Offline Radar</h2>
              <p className="text-xs text-gray-300">
                P2P mesh routing active over Bluetooth LE and Wi-Fi Direct.
              </p>
              <button
                onClick={() => setMeshTopologyOpen(true)}
                className="btn-primary py-3 px-6 rounded-xl font-bold"
              >
                Launch Mesh Topology Scanner
              </button>
            </div>
          </div>
        )}

        {activeTab === 'settings' && (
          <div className="flex-1 flex items-center justify-center p-8 glass-panel m-6 rounded-3xl">
            <div className="text-center space-y-4 max-w-md">
              <h2 className="text-2xl font-extrabold text-white">Settings & Security</h2>
              <p className="text-xs text-gray-300">
                Manage Signal Protocol E2EE safety codes, multi-device sessions, and privacy parameters.
              </p>
              <button
                onClick={() => setE2eeModalOpen(true)}
                className="btn-primary py-3 px-6 rounded-xl font-bold"
              >
                Inspect E2EE Identity Keys
              </button>
            </div>
          </div>
        )}

        {activeTab !== 'chats' &&
          activeTab !== 'communities' &&
          activeTab !== 'channels' &&
          activeTab !== 'admin' &&
          activeTab !== 'stories' &&
          activeTab !== 'mesh' &&
          activeTab !== 'settings' && (
            <div className="flex-1 flex flex-col overflow-hidden">
              <ChatWindow />
            </div>
          )}
      </div>

      {/* Overlays & Modals */}
      <CallModal />
      <MeshNetworkModal />
      <StoriesModal />
      <SettingsModal />
      <NewContactModal />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainLayout />
    </AppProvider>
  );
}
