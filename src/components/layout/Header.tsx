import React, { useState } from 'react';
import styles from './Header.module.css';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { signOutUser } from '../../features/auth/authSlice';
import { LogOut } from 'lucide-react';
import ConfirmationModal from '../ui/ConfirmationModal';

const SidebarHeader: React.FC = () => {
  const dispatch = useAppDispatch();
  const { authLoading } = useAppSelector(state => state.auth)
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const handleLogout = () => {
    dispatch(signOutUser());
    setShowLogoutModal(false);
  }

  return (
    <>
      <div className={styles.header}>
        <h3 className={styles.title}>WhatsUp</h3>
        <button
          onClick={() => setShowLogoutModal(true)}
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

      <ConfirmationModal 
        isOpen={showLogoutModal}
        title="Log Out"
        message="Are you sure you want to log out of your account? You will need to sign back in to access your messages."
        confirmText="Log Out"
        cancelText="Cancel"
        onConfirm={handleLogout}
        onCancel={() => setShowLogoutModal(false)}
        isLoading={authLoading}
      />
    </>
  );
};

export default SidebarHeader;
