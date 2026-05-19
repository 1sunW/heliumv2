import React, { createContext, useContext, useEffect, useState } from 'react';
import { onAuthStateChanged, User } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, db } from '../lib/firebase';

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
                // Check if user is admin in Firestore
                const adminDoc = await getDoc(doc(db, 'admins', user.uid));
                setIsAdmin(adminDoc.exists());

                // Optional: Bootstrap the first admin if the collection is empty? 
                // But usually we don't do that automatically for security.
                // For this app, I'll add a check: if the user matches the creator's email, make them admin.
                if (user.email === 'chaosclancontact1@gmail.com' && !adminDoc.exists()) {
                    await setDoc(doc(db, 'admins', user.uid), {
                        uid: user.uid,
                        email: user.email
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
