import React, { useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { FaPhoneSlash, FaMicrophone, FaMicrophoneSlash, FaVideo, FaVideoSlash, FaCompressAlt } from 'react-icons/fa';
import type { RootState } from '../../../store/store';
import { webRTCService } from '../services/webrtcService';
import { setFullScreen, toggleLocalAudio, toggleLocalVideo } from '../callSlice';
import styles from './VideoCall.module.css';

const VideoCall: React.FC = () => {
  const dispatch = useDispatch();
  const { status, remoteUser, isFullScreen, localVideoEnabled, localAudioEnabled, localStreamActive, remoteStreamActive } = useSelector((state: RootState) => state.call);
  
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (localVideoRef.current && webRTCService.localStream) {
      localVideoRef.current.srcObject = webRTCService.localStream;
      localVideoRef.current.play().catch(e => console.warn('Local play error:', e));
    }
  }, [localStreamActive, isFullScreen]);

  useEffect(() => {
    if (remoteVideoRef.current && webRTCService.remoteStream) {
      remoteVideoRef.current.srcObject = webRTCService.remoteStream;
      remoteVideoRef.current.play().catch(e => console.warn('Remote play error:', e));
    }
  }, [remoteStreamActive, isFullScreen]);

  useEffect(() => {
    if (webRTCService.localStream) {
      webRTCService.localStream.getVideoTracks().forEach(track => {
        track.enabled = localVideoEnabled;
      });
      webRTCService.localStream.getAudioTracks().forEach(track => {
        track.enabled = localAudioEnabled;
      });
    }
  }, [localVideoEnabled, localAudioEnabled]);

  if (status === 'idle') {
    return null;
  }

  const handleEndCall = () => {
    webRTCService.hangUp();
  };

  const handleToggleAudio = () => {
    dispatch(toggleLocalAudio());
  };

  const handleToggleVideo = () => {
    dispatch(toggleLocalVideo());
  };

  const handleMinimize = () => {
    dispatch(setFullScreen(false));
  };

  return (
    <div 
      className={isFullScreen ? styles.fullScreenContainer : styles.pipContainer}
      onClick={!isFullScreen ? () => dispatch(setFullScreen(true)) : undefined}
      title={!isFullScreen ? "Click to return to full screen" : undefined}
    >
      {isFullScreen && (
        <button className={styles.minimizeBtn} onClick={(e) => { e.stopPropagation(); handleMinimize(); }}>
          <FaCompressAlt />
        </button>
      )}

      <div className={styles.remoteVideoContainer}>
        <video 
          ref={remoteVideoRef} 
          autoPlay 
          playsInline 
          className={styles.remoteVideo} 
        />
        {status === 'ringing' && isFullScreen && (
          <div className={styles.ringingOverlay}>
            <div className={styles.avatar}>
               {remoteUser?.displayName ? remoteUser.displayName[0].toUpperCase() : '?'}
            </div>
            <h2>Calling {remoteUser?.displayName}...</h2>
          </div>
        )}
      </div>

      {isFullScreen && (
        <div className={styles.localVideoContainer}>
          <video 
            ref={localVideoRef} 
            autoPlay 
            playsInline 
            muted 
            className={styles.localVideo} 
          />
        </div>
      )}

      {isFullScreen && (
        <div className={styles.controlsBar}>
          <button 
            className={`${styles.controlBtn} ${!localAudioEnabled ? styles.disabledBtn : ''}`}
            onClick={(e) => { e.stopPropagation(); handleToggleAudio(); }}
          >
            {localAudioEnabled ? <FaMicrophone /> : <FaMicrophoneSlash />}
          </button>
          <button 
            className={`${styles.controlBtn} ${!localVideoEnabled ? styles.disabledBtn : ''}`}
            onClick={(e) => { e.stopPropagation(); handleToggleVideo(); }}
          >
            {localVideoEnabled ? <FaVideo /> : <FaVideoSlash />}
          </button>
          <button className={`${styles.controlBtn} ${styles.endCallBtn}`} onClick={(e) => { e.stopPropagation(); handleEndCall(); }}>
            <FaPhoneSlash />
          </button>
        </div>
      )}
    </div>
  );
};

export default VideoCall;
