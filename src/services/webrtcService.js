// Native WebRTC PeerConnection Service for HD Voice & Video Calling

class WebRTCService {
  constructor() {
    this.peerConnection = null;
    this.localStream = null;
    this.remoteStream = null;
    this.iceCandidates = [];
  }

  // Initialize WebRTC RTCPeerConnection with Google STUN servers
  async initPeerConnection(onRemoteTrackCallback) {
    const configuration = {
      iceServers: [
        { urls: 'stun:stun.l.google.com:19302' },
        { urls: 'stun:stun1.l.google.com:19302' },
      ],
    };

    this.peerConnection = new RTCPeerConnection(configuration);

    this.peerConnection.ontrack = (event) => {
      if (event.streams && event.streams[0]) {
        this.remoteStream = event.streams[0];
        if (onRemoteTrackCallback) onRemoteTrackCallback(this.remoteStream);
      }
    };

    this.peerConnection.onicecandidate = (event) => {
      if (event.candidate) {
        this.iceCandidates.push(event.candidate);
      }
    };

    return this.peerConnection;
  }

  // Capture user webcam / microphone media stream
  async startLocalMedia(video = true, audio = true) {
    try {
      this.localStream = await navigator.mediaDevices.getUserMedia({ video, audio });
      if (this.peerConnection) {
        this.localStream.getTracks().forEach((track) => {
          this.peerConnection.addTrack(track, this.localStream);
        });
      }
      return this.localStream;
    } catch (err) {
      console.warn('[WebRTCService] Camera/Microphone access error or denied:', err);
      return null;
    }
  }

  // Create WebRTC Offer SDP
  async createOffer() {
    if (!this.peerConnection) await this.initPeerConnection();
    const offer = await this.peerConnection.createOffer();
    await this.peerConnection.setLocalDescription(offer);
    return offer;
  }

  // Handle incoming Offer & Create Answer SDP
  async handleOfferAndCreateAnswer(offer) {
    if (!this.peerConnection) await this.initPeerConnection();
    await this.peerConnection.setRemoteDescription(new RTCSessionDescription(offer));
    const answer = await this.peerConnection.createAnswer();
    await this.peerConnection.setLocalDescription(answer);
    return answer;
  }

  // Toggle Mute Audio Track
  toggleAudio(enable) {
    if (this.localStream) {
      this.localStream.getAudioTracks().forEach((t) => (t.enabled = enable));
    }
  }

  // Toggle Camera Video Track
  toggleVideo(enable) {
    if (this.localStream) {
      this.localStream.getVideoTracks().forEach((t) => (t.enabled = enable));
    }
  }

  // Screen Sharing Media Capture
  async startScreenShare() {
    try {
      const screenStream = await navigator.mediaDevices.getDisplayMedia({ video: true });
      return screenStream;
    } catch (err) {
      console.warn('[WebRTCService] Screen sharing canceled or unavailable:', err);
      return null;
    }
  }

  // End Call & Cleanup Tracks
  endCall() {
    if (this.localStream) {
      this.localStream.getTracks().forEach((track) => track.stop());
      this.localStream = null;
    }
    if (this.peerConnection) {
      this.peerConnection.close();
      this.peerConnection = null;
    }
  }
}

export const webrtcService = new WebRTCService();
