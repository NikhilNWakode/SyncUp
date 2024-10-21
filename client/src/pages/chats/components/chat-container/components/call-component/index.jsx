import React, { useEffect, useRef, useState } from 'react';
import { useSocket } from "@/context/SocketContext";

const WebRTCCall = ({ recipentId, isAudioOnly }) => {
  const socket = useSocket();
  const [callStatus, setCallStatus] = useState('idle');
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const peerConnection = useRef(null);

  useEffect(() => {
    if (socket) {
      socket.on('incomingCall', handleIncomingCall);
      socket.on('callAccepted', handleCallAccepted);
      socket.on('iceCandidate', handleIceCandidate);
      socket.on('callEnded', handleCallEnded);
    }

    return () => {
      if (socket) {
        socket.off('incomingCall', handleIncomingCall);
        socket.off('callAccepted', handleCallAccepted);
        socket.off('iceCandidate', handleIceCandidate);
        socket.off('callEnded', handleCallEnded);
      }
    };
  }, [socket]);

  const startCall = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: !isAudioOnly, 
        audio: true 
      });
      localVideoRef.current.srcObject = stream;

      peerConnection.current = new RTCPeerConnection();
      stream.getTracks().forEach(track => 
        peerConnection.current.addTrack(track, stream)
      );

      peerConnection.current.onicecandidate = (event) => {
        if (event.candidate) {
          socket.emit('iceCandidate', { 
            recipentId, 
            candidate: event.candidate 
          });
        }
      };

      peerConnection.current.ontrack = (event) => {
        remoteVideoRef.current.srcObject = event.streams[0];
      };

      const offer = await peerConnection.current.createOffer();
      await peerConnection.current.setLocalDescription(offer);

      socket.emit('videoCallRequest', { 
        recipentId, 
        offer 
      });
      setCallStatus('calling');
    } catch (error) {
      console.error('Error starting call:', error);
      setCallStatus('error');
    }
  };

  const handleIncomingCall = async ({ callerId, offer }) => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: !isAudioOnly, 
        audio: true 
      });
      localVideoRef.current.srcObject = stream;

      peerConnection.current = new RTCPeerConnection();
      stream.getTracks().forEach(track => 
        peerConnection.current.addTrack(track, stream)
      );

      peerConnection.current.onicecandidate = (event) => {
        if (event.candidate) {
          socket.emit('iceCandidate', { 
            recipentId: callerId, 
            candidate: event.candidate 
          });
        }
      };

      peerConnection.current.ontrack = (event) => {
        remoteVideoRef.current.srcObject = event.streams[0];
      };

      await peerConnection.current.setRemoteDescription(new RTCSessionDescription(offer));
      const answer = await peerConnection.current.createAnswer();
      await peerConnection.current.setLocalDescription(answer);

      socket.emit('callAccepted', { callerId, answer });
      setCallStatus('inCall');
    } catch (error) {
      console.error('Error handling incoming call:', error);
      setCallStatus('error');
    }
  };

  const handleCallAccepted = async ({ answer }) => {
    try {
      await peerConnection.current.setRemoteDescription(new RTCSessionDescription(answer));
      setCallStatus('inCall');
    } catch (error) {
      console.error('Error handling call acceptance:', error);
      setCallStatus('error');
    }
  };

  const handleIceCandidate = async ({ candidate }) => {
    try {
      if (peerConnection.current) {
        await peerConnection.current.addIceCandidate(new RTCIceCandidate(candidate));
      }
    } catch (error) {
      console.error('Error handling ICE candidate:', error);
    }
  };

  const handleCallEnded = () => {
    if (peerConnection.current) {
      peerConnection.current.close();
    }
    if (localVideoRef.current.srcObject) {
      localVideoRef.current.srcObject.getTracks().forEach(track => track.stop());
    }
    setCallStatus('idle');
  };

  const endCall = () => {
    socket.emit('callEnded', { recipentId });
    handleCallEnded();
  };

  return (
    <div>
      <video ref={localVideoRef} autoPlay muted />
      <video ref={remoteVideoRef} autoPlay />
      {callStatus === 'idle' && <button onClick={startCall}>Start Call</button>}
      {callStatus === 'inCall' && <button onClick={endCall}>End Call</button>}
      {/* Add more UI elements based on callStatus */}
    </div>
  );
};

export default WebRTCCall;