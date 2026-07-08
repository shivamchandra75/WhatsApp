import { useEffect } from 'react';
import { useAppDispatch } from '../../../store/hooks';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../../../confg/firebase';
import { setUser } from '../authSlice';
import { updateUserOnlineStatusInFirestore } from '../Services/authService';

export const useAuthListener = () => {
    const dispatch = useAppDispatch();

    // Subscribe to Firebase Auth state changes
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
            if (firebaseUser) {
                // Extract only serializable data for Redux
                dispatch(setUser({
                    uid: firebaseUser.uid,
                    email: firebaseUser.email,
                    displayName: firebaseUser.displayName,
                }));
            } else {
                dispatch(setUser(null));
            }
        });

        // Clean up the subscription on unmount
        return () => unsubscribe();
    }, [dispatch]);

    // Set isOnline: false when the tab/window is closing
    useEffect(() => {
        const handleBeforeUnload = () => {
            const uid = auth.currentUser?.uid;
            if (uid) {
                // Fire-and-forget — no await, browser is closing
                updateUserOnlineStatusInFirestore(uid, false);
            }
        };

        window.addEventListener('beforeunload', handleBeforeUnload);
        return () => window.removeEventListener('beforeunload', handleBeforeUnload);
    }, []);
};