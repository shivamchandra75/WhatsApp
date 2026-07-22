import React from 'react';
import styles from './Header.module.css';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { signOutUser } from '../../features/auth/authSlice';
import { LogOut } from 'lucide-react';

const SidebarHeader: React.FC = () => {
  const dispatch = useAppDispatch();
  const { authLoading } = useAppSelector(state => state.auth)

  const handleLogout = () => {
    dispatch(signOutUser());
  }

  return (
    <div className={styles.header}>
      <h3 className={styles.title}>WhatsUp</h3>
      <button
        onClick={handleLogout}
        disabled={authLoading}
        className={styles.button}
        style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
      >
        <LogOut size={16} />
        {
          authLoading
            ? "Logging Out..." : "Logout"

        }
      </button>
    </div>
  );
};

export default SidebarHeader;
