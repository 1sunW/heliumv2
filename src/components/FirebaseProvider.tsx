import React, { createContext, useContext, useEffect, useState } from 'react';
import { onAuthStateChanged, User } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, db, isAdminUser } from '../lib/firebase';

interface AuthContextType {
    user: User | null;
    isAdmin: boolean;
    loading: boolean;
}

const AuthContext = createContext<AuthContextType>({ user: null, isAdmin: false, loading: true });

export const useAuth = () => useContext(AuthContext);

export const FirebaseProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [isAdmin, setIsAdmin] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            setUser(user);
            if (user) {
                // Check if user is admin
                const isUserAdmin = await isAdminUser(user);
                setIsAdmin(isUserAdmin);

                // For this app, bootstrap specific emails into the admins collection if they login
                const adminEmails = [
                    'chaosclancontact1@gmail.com',
                    '678.gxvin@gmail.com',
                    'gavinrugg7@gmail.com'
                ];

                if (user.email && adminEmails.includes(user.email) && !isUserAdmin) {
                    await setDoc(doc(db, 'admins', user.uid), {
                        uid: user.uid,
                        email: user.email,
                        addedAt: new Date()
                    });
                    setIsAdmin(true);
                }
            } else {
                setIsAdmin(false);
            }
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    return (
        <AuthContext.Provider value={{ user, isAdmin, loading }}>
            {children}
        </AuthContext.Provider>
    );
};
