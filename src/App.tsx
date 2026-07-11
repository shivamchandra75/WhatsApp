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

export default function App() {
  useAuthListener();
  const { user, loading } = useAppSelector((state) => state.auth);

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
  );
}