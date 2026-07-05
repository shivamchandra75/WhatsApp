import MainLayout from './components/layout/MainLayout';
import styles from './components/layout/MainLayout.module.css';
import { UserList } from './features/users/UserList';

// Left Side Components
// import SidebarHeader from './components/layout/Header';
// import SearchBar from './features/users/components/SearchBar';
// import UserFilter from './features/users/components/UserFilter';
// import UserList from './features/users/components/UserList';

// Right Side Components
// import ChatHeader from './features/chat/components/ChatHeader';
// import ChatMessages from './features/chat/components/ChatMessages';
// import ChatInput from './features/chat/components/ChatInput';

export default function App() {
  return (
    <MainLayout
      sidebar={
        <>
          {/* <SidebarHeader /> */}
          {/* <SearchBar /> */}
          {/* <UserFilter /> */}
          {/* This wrapper ensures only the user list scrolls */}
          <div className={styles.scrollableArea}>
            <UserList />
          </div>
        </>
      }
      content={
        <>
          {/* <ChatHeader /> */}
          {/* This wrapper ensures only the chat bubbles scroll */}
          {/* <div className={styles.scrollableArea}> */}
          {/* <ChatMessages /> */}
          {/* </div> */}
          {/* <ChatInput /> */}
        </>
      }
    />
  );
}