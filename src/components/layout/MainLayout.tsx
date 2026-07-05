import React from 'react';
import styles from './MainLayout.module.css';

interface MainLayoutProps {
    sidebar: React.ReactNode;
    content: React.ReactNode;
}

export default function MainLayout({ sidebar, content }: MainLayoutProps) {
    return (
        <div className={styles.layoutContainer}>

            {/* Left Column */}
            <aside className={styles.sidebar}>
                {sidebar}
            </aside>

            {/* Right Column */}
            <main className={styles.mainContent}>
                {content}
            </main>

        </div>
    );
}