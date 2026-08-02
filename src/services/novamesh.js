// NovaMesh P2P & Mesh Networking Engine for Offline Communication

class NovaMeshEngine {
  constructor() {
    this.peerChannel = null;
    this.listeners = new Set();
    this.activeNodes = [
      { id: 'node_ble_01', name: 'Elena Vance (BLE Mesh)', rssi: -58, hops: 1, type: 'Bluetooth LE', status: 'connected' },
      { id: 'node_wfd_02', name: 'Marcus Chen (Wi-Fi Direct)', rssi: -42, hops: 1, type: 'Wi-Fi Direct', status: 'connected' },
      { id: 'node_mesh_03', name: 'Sophia Sterling (Mesh Hop)', rssi: -76, hops: 2, type: 'Multi-hop Mesh', status: 'routing' },
      { id: 'node_ble_04', name: 'Devon Knight (Nearby Node)', rssi: -82, hops: 2, type: 'Bluetooth LE', status: 'in-range' },
    ];
    this.isOfflineMeshMode = false;
    this.initChannel();
  }

  initChannel() {
    if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
      this.peerChannel = new BroadcastChannel('novalink_mesh_bus');
      this.peerChannel.onmessage = (event) => {
        const data = event.data;
        this.notifyListeners(data);
      };
    }
  }

  setOfflineMode(isOffline) {
    this.isOfflineMeshMode = isOffline;
    this.broadcast({
      type: 'MESH_STATUS_CHANGE',
      senderId: 'current_user',
      isOfflineMode: isOffline,
      timestamp: Date.now(),
    });
  }

  subscribe(callback) {
    this.listeners.add(callback);
    return () => this.listeners.delete(callback);
  }

  notifyListeners(data) {
    this.listeners.forEach((cb) => cb(data));
  }

  // Send message over offline mesh channel
  sendMeshMessage(chatId, messageContent, attachment = null) {
    const hopRoute = ['You (Origin)', 'BLE-Bridge-01', `Peer (${chatId})`];
    const meshPayload = {
      type: 'MESH_MESSAGE',
      id: 'mesh_msg_' + Date.now() + '_' + Math.random().toString(36).substr(2, 4),
      chatId,
      text: messageContent,
      sender: 'You',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      transport: 'NovaMesh (P2P)',
      rssi: -55,
      hopRoute,
      attachment,
    };

    if (this.peerChannel) {
      this.peerChannel.postMessage(meshPayload);
    }
    this.notifyListeners(meshPayload);
    return meshPayload;
  }

  // Emergency SOS Broadcast to all nearby nodes within RF range
  triggerEmergencySOS(locationData = { lat: 37.7749, lng: -122.4194 }) {
    const sosPayload = {
      type: 'EMERGENCY_SOS_BROADCAST',
      id: 'sos_' + Date.now(),
      senderName: 'NovaLink Emergency Node',
      location: locationData,
      timestamp: new Date().toLocaleString(),
      alertText: 'CRITICAL SOS: Emergency signal broadcasted over NovaMesh offline network!',
      transport: 'Mesh Flood Broadcast',
    };

    if (this.peerChannel) {
      this.peerChannel.postMessage(sosPayload);
    }
    this.notifyListeners(sosPayload);
    return sosPayload;
  }

  // Scan & Discover nearby RF nodes
  scanNearbyNodes() {
    // Return mock RSSI jitter scan result
    return this.activeNodes.map((node) => ({
      ...node,
      rssi: Math.min(-35, Math.max(-95, node.rssi + Math.floor(Math.random() * 9) - 4)),
    }));
  }
}

export const novaMeshEngine = new NovaMeshEngine();
