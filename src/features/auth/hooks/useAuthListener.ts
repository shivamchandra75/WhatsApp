import { useEffect } from 'react';
import { useAppDispatch } from '../../../store/hooks';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../../../confg/firebase';
import { setUser } from '../authSlice';

export const useAuthListener = () => {
    const dispatch = useAppDispatch();

    useEffect(() => {
        // Subscribe to Firebase Auth changes
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
};