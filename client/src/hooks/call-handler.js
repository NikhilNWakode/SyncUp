import { io } from "socket.io-client";
import { useRef, useEffect, useCallback } from "react";
import { HOST } from "@/utils/constants.js"; // Assuming this contains your server URL
import { userAppStore } from "@/store";  // Assuming this contains user info

const useCallHandler = () => {
  const socket = useRef(null);
  const peerConnection = useRef(null);
  const localStream = useRef(null);
  const remoteStream = useRef(null);
  const { userInfo } = userAppStore();

  // Function to create and return a new PeerConnection
  const createPeerConnection = useCallback(() => {
    const pc = new RTCPeerConnection({
      iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
    });

    // Handle ICE candidates and send to remote peer
    pc.onicecandidate = (event) => {
      if (event.candidate) {
        socket.current.emit("iceCandidate", {
          recipentId: peerConnection.current.recipentId,
          candidate: event.candidate,
        });
      }
    };

    // Handle incoming remote streams
    pc.ontrack = (event) => {
      remoteStream.current.srcObject = event.streams[0];
    };

    return pc;
  }, []);

  // Initiate a call (audio/video)
  const initiateCall = useCallback(
    async (recipentId, isVideoEnabled) => {
      peerConnection.current = createPeerConnection();
      peerConnection.current.recipentId = recipentId;

      try {
        // Get media devices (video/audio)
        localStream.current = await navigator.mediaDevices.getUserMedia({
          video: isVideoEnabled,
          audio: true,
        });

        // Add local stream tracks to the peer connection
        localStream.current.getTracks().forEach((track) =>
          peerConnection.current.addTrack(track, localStream.current)
        );

        // Create an offer and set it as the local description
        const offer = await peerConnection.current.createOffer();
        await peerConnection.current.setLocalDescription(offer);

        // Send the offer to the recipient via socket
        socket.current.emit("videoCallRequest", {
          recipentId,
          offer,
        });
      } catch (error) {
        console.error("Error initiating call:", error);
      }
    },
    [createPeerConnection]
  );

  // Handle an incoming call from another user
  const handleIncomingCall = useCallback(
    async ({ callerId, offer }) => {
      peerConnection.current = createPeerConnection();
      peerConnection.current.recipentId = callerId;

      try {
        // Set the remote description from the offer
        await peerConnection.current.setRemoteDescription(new RTCSessionDescription(offer));

        // Create an answer and set it as the local description
        const answer = await peerConnection.current.createAnswer();
        await peerConnection.current.setLocalDescription(answer);

        // Send the answer back to the caller via socket
        socket.current.emit("callAccepted", { callerId, answer });
      } catch (error) {
        console.error("Error handling incoming call:", error);
      }
    },
    [createPeerConnection]
  );

  // Handle the accepted call (when the remote peer sends the answer)
  const handleCallAccepted = useCallback(
    async ({ answer }) => {
      try {
        await peerConnection.current.setRemoteDescription(new RTCSessionDescription(answer));
      } catch (error) {
        console.error("Error handling call acceptance:", error);
      }
    },
    []
  );

  // Handle ICE candidates received from the remote peer
  const handleIceCandidate = useCallback(
    async ({ candidate }) => {
      try {
        await peerConnection.current.addIceCandidate(new RTCIceCandidate(candidate));
      } catch (error) {
        console.error("Error adding ICE candidate:", error);
      }
    },
    []
  );

  // Clean up resources when the call ends
  const handleCallEnded = useCallback(() => {
    if (peerConnection.current) {
      peerConnection.current.close();
      peerConnection.current = null;
    }
    if (localStream.current) {
      localStream.current.getTracks().forEach((track) => track.stop());
      localStream.current = null;
    }
    remoteStream.current.srcObject = null;
  }, []);

  // Setup socket listeners and WebRTC signaling
  useEffect(() => {
    if (userInfo) {
      // Initialize Socket.io client
      socket.current = io(HOST, {
        withCredentials: true,
        query: { userId: userInfo.id },
      });

      // Listen for incoming call events
      socket.current.on("incomingCall", handleIncomingCall);
      socket.current.on("callAccepted", handleCallAccepted);
      socket.current.on("iceCandidate", handleIceCandidate);
      socket.current.on("callEnded", handleCallEnded);

      return () => {
        if (socket.current) {
          socket.current.disconnect();
        }
        handleCallEnded();
      };
    }
  }, [userInfo, handleIncomingCall, handleCallAccepted, handleIceCandidate, handleCallEnded]);

  return {
    initiateCall,
    localStream,
    remoteStream,
    endCall: handleCallEnded,
  };
};

export default useCallHandler;
