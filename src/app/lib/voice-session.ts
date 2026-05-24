type VoiceSessionHandlers = {
  onTranscript?: (text: string, isFinal: boolean) => void;
  onStateChange?: (state: "connecting" | "listening" | "speaking" | "closed") => void;
  onError?: (error: Error) => void;
};

export class RealtimeVoiceSession {
  private connection?: RTCPeerConnection;
  private mediaStream?: MediaStream;

  constructor(private readonly handlers: VoiceSessionHandlers = {}) {}

  async start(providerToken: string) {
    this.handlers.onStateChange?.("connecting");
    this.mediaStream = await navigator.mediaDevices.getUserMedia({
      audio: {
        echoCancellation: true,
        noiseSuppression: true,
        autoGainControl: true,
      },
    });

    this.connection = new RTCPeerConnection({
      iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
    });

    this.mediaStream.getTracks().forEach((track) => {
      this.connection?.addTrack(track, this.mediaStream as MediaStream);
    });

    const dataChannel = this.connection.createDataChannel("ai-events");
    dataChannel.onmessage = (event) => {
      try {
        const payload = JSON.parse(event.data) as { type: string; text?: string; final?: boolean };
        if (payload.type === "transcript" && payload.text) {
          this.handlers.onTranscript?.(payload.text, Boolean(payload.final));
        }
        if (payload.type === "response.audio.delta") {
          this.handlers.onStateChange?.("speaking");
        }
      } catch (error) {
        this.handlers.onError?.(error instanceof Error ? error : new Error("Invalid voice event"));
      }
    };

    const offer = await this.connection.createOffer();
    await this.connection.setLocalDescription(offer);

    // Production integration: exchange this SDP with OpenAI Realtime, Deepgram, or an in-house gateway.
    dataChannel.onopen = () => {
      dataChannel.send(JSON.stringify({ type: "session.start", providerToken }));
      this.handlers.onStateChange?.("listening");
    };
  }

  interrupt() {
    this.handlers.onStateChange?.("listening");
  }

  stop() {
    this.mediaStream?.getTracks().forEach((track) => track.stop());
    this.connection?.close();
    this.handlers.onStateChange?.("closed");
  }
}
