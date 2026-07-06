import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { collection, onSnapshot } from 'firebase/firestore';
import { db } from '../../../confg/firebase';
import { setContacts } from '../usersSlice';
import { useAppSelector } from '../../../store/hooks';
import type { ContactProfile } from '../UserList.types';

export const useUsersList = () => {
    const dispatch = useDispatch();
    const currentUser = useAppSelector((state) => state.auth.user);

    useEffect(() => {
        if (!currentUser) return;

        const usersRef = collection(db, 'users');

        const unsubscribe = onSnapshot(usersRef, (snapshot) => {
            const usersData: ContactProfile[] = [];

            snapshot.forEach((doc) => {
                if (doc.id !== currentUser.uid) {
                    usersData.push(doc.data() as ContactProfile);
                }
            });

            dispatch(setContacts(usersData));
        });

        return () => unsubscribe();
    }, [dispatch, currentUser]);
};