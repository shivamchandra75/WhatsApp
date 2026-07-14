import React, { useEffect } from 'react';
import MainLayout from './components/layout/MainLayout';
import styles from './components/layout/MainLayout.module.css';
import { UserList } from './features/users/UserList';
import { useAppSelector } from './store/hooks';
import { useAuthListener } from './features/auth/hooks/useAuthListener';
import LoginPage from './features/auth/components/LoginPage';

// Left Side Components
import Sidebar from './components/layout/Sidebar';

// Right Side Components
import ChatHeader from './features/chat/components/ChatHeader';
import ChatMessages from './features/chat/components/ChatMessages';
import ChatInput from './features/chat/components/ChatInput';

// Call Components
import VideoCall from './features/call/components/VideoCall';
import IncomingCallModal from './features/call/components/IncomingCallModal';
import { webRTCService } from './features/call/services/webrtcService';

export default function App() {
  useAuthListener();
  const { user, loading } = useAppSelector((state) => state.auth);

  useEffect(() => {
    if (user) {
      // Listen for incoming calls
      webRTCService.listenForIncomingCalls(user.uid);

      // Request media permissions on login
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        navigator.mediaDevices.getUserMedia({ video: true, audio: true })
          .then(stream => {
            // Stop tracks immediately since we just wanted permission
            stream.getTracks().forEach(track => track.stop());
          })
          .catch(err => {
            console.warn('User denied media permissions on login:', err);
          });
      } else {
        console.warn('Media devices not supported or running in an insecure context (HTTP instead of HTTPS).');
      }

      return () => {
        webRTCService.stopListeningForIncomingCalls();
      };
    }
  }, [user]);

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', backgroundColor: '#f0f2f5' }}>
        <p>Loading WhatsApp...</p>
      </div>
    );
  }

  if (!user) {
    return <LoginPage />;
  }

  return (
    <>
      <MainLayout
        sidebar={<Sidebar />}
        content={
          <>
            <ChatHeader />
            <div className={styles.scrollableArea}>
              <ChatMessages />
            </div>
            <ChatInput />
          </>
        }
      />
      <IncomingCallModal />
      <VideoCall />
    </>
  );
}