import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import type { User, Role } from '../types/index.ts';
import { api } from '../services/api.ts';
import { auth, fbSignOut, onAuthStateChanged, db, doc, getDoc } from '../firebase.ts';
import { firestoreService } from '../services/firestoreService.ts';

interface AuthContextType {
  user: (User & { profileId?: string }) | null;
  token: string | null;
  role: Role | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string, role?: Role) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  registerParent: (data: any) => Promise<void>;
  registerMentor: (data: any) => Promise<string>;
  logout: () => void;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<(User & { profileId?: string }) | null>(null);
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('bba_mentors_token'));
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const role = user?.role || null;

  // 1. Listen for Firebase Auth changes & restore real session
  useEffect(() => {
    let isMounted = true;

    const unsubscribe = onAuthStateChanged(auth, async (fbUser) => {
      if (!isMounted) return;

      if (fbUser) {
        try {
          const userDocSnap = await getDoc(doc(db, 'users', fbUser.uid));
          if (userDocSnap.exists() && isMounted) {
            const userData = userDocSnap.data() as User;
            let profileData: any = null;

            if (userData.role === 'PARENT') {
              const pSnap = await getDoc(doc(db, 'parents', fbUser.uid));
              if (pSnap.exists()) profileData = pSnap.data();
            } else if (userData.role === 'MENTOR') {
              const mSnap = await getDoc(doc(db, 'mentors', fbUser.uid));
              if (mSnap.exists()) profileData = mSnap.data();
            }

            const idToken = await fbUser.getIdToken();
            const syncRes = await api.syncFirebaseUser({
              idToken,
              role: userData.role,
              name: userData.name,
              mobile: userData.mobile,
              district: userData.district,
              city: userData.city,
              profileData,
            });

            if (isMounted) {
              localStorage.setItem('bba_mentors_token', syncRes.token);
              setToken(syncRes.token);
              setUser({ ...syncRes.user, profileId: profileData?.id || fbUser.uid });
            }
          }
        } catch (err) {
          console.warn('Firebase session restore note:', err);
        } finally {
          if (isMounted) setIsLoading(false);
        }
      } else {
        // If no Firebase user, check if there is an active server token (e.g., Admin)
        const storedToken = localStorage.getItem('bba_mentors_token');
        if (storedToken) {
          try {
            const data = await api.getCurrentUser();
            if (isMounted) {
              const profileId = data.profile?.id;
              setUser({ ...data.user, profileId });
            }
          } catch {
            if (isMounted) {
              localStorage.removeItem('bba_mentors_token');
              setToken(null);
              setUser(null);
            }
          } finally {
            if (isMounted) setIsLoading(false);
          }
        } else {
          if (isMounted) setIsLoading(false);
        }
      }
    });

    return () => {
      isMounted = false;
      unsubscribe();
    };
  }, []);

  // 2. Real Login (Admin priority check & Firebase Auth)
  const login = async (email: string, password: string, requestedRole?: Role) => {
    setIsLoading(true);
    const cleanEmail = email.trim();

    try {
      // Step A: If logging into Admin portal or using admin email, verify admin backend immediately
      if (requestedRole === 'ADMIN' || cleanEmail.toLowerCase() === 'kdharmraj778@gmail.com') {
        try {
          const res = await api.login({ email: cleanEmail, password, role: 'ADMIN' });
          localStorage.setItem('bba_mentors_token', res.token);
          setToken(res.token);
          setUser(res.user);
          return;
        } catch (adminErr: any) {
          // If backend admin auth failed with password error, bubble it up directly
          if (adminErr?.message && !adminErr.message.includes('Server connection')) {
            throw adminErr;
          }
        }
      }

      // Step B: Attempt Firebase Authentication
      try {
        const fbResult = await firestoreService.loginWithFirebase(cleanEmail, password, requestedRole);
        const syncRes = await api.syncFirebaseUser({
          idToken: fbResult.idToken,
          role: fbResult.userData.role,
          name: fbResult.userData.name,
          mobile: fbResult.userData.mobile,
          district: fbResult.userData.district,
          city: fbResult.userData.city,
          profileData: fbResult.profileData,
        });

        localStorage.setItem('bba_mentors_token', syncRes.token);
        setToken(syncRes.token);
        setUser({ ...syncRes.user, profileId: fbResult.profileData?.id || fbResult.uid });
        return;
      } catch (fbErr: any) {
        // If it's a role mismatch error, bubble it up directly to guide the user
        if (fbErr.message && fbErr.message.includes('This account is registered as')) {
          throw fbErr;
        }

        // Step C: Fallback to backend authentication
        try {
          const res = await api.login({ email: cleanEmail, password, role: requestedRole });
          localStorage.setItem('bba_mentors_token', res.token);
          setToken(res.token);
          setUser(res.user);
          return;
        } catch (apiErr: any) {
          throw new Error(apiErr?.message || fbErr?.message || 'Invalid email or password');
        }
      }
    } finally {
      setIsLoading(false);
    }
  };

  // 3. Real Parent Registration with Firebase Auth & Firestore
  const registerParent = async (data: any) => {
    setIsLoading(true);
    try {
      const fbResult = await firestoreService.registerParentWithFirebase({
        name: data.name,
        email: data.email,
        mobile: data.mobile,
        password: data.password,
        district: data.district,
        city: data.city || data.district,
        address: data.address,
        childName: data.childName,
        classGrade: data.classGrade,
        board: data.board,
        schoolName: data.schoolName,
        targetSubjects: data.targetSubjects,
      });

      const syncRes = await api.syncFirebaseUser({
        idToken: fbResult.idToken,
        role: 'PARENT',
        name: fbResult.userData.name,
        mobile: fbResult.userData.mobile,
        district: fbResult.userData.district,
        city: fbResult.userData.city,
        profileData: {
          address: fbResult.parentData.address,
          child: fbResult.studentData,
        },
      });

      localStorage.setItem('bba_mentors_token', syncRes.token);
      setToken(syncRes.token);
      setUser({ ...syncRes.user, profileId: fbResult.parentData.id });
    } finally {
      setIsLoading(false);
    }
  };

  // 4. Real Mentor Registration with Firebase Auth & Firestore
  const registerMentor = async (data: any) => {
    setIsLoading(true);
    try {
      const fbResult = await firestoreService.registerMentorWithFirebase({
        name: data.name,
        email: data.email,
        mobile: data.mobile,
        password: data.password,
        district: data.district,
        city: data.city,
        preferredAreas: data.preferredAreas,
        qualification: data.qualification,
        college: data.college,
        teachingExperience: data.teachingExperience,
        subjects: data.subjects,
        classes: data.classes,
        boards: data.boards,
        teachingMode: data.teachingMode,
        availability: data.availability,
        expectedFee: data.expectedFee,
        about: data.about,
      });

      const syncRes = await api.syncFirebaseUser({
        idToken: fbResult.idToken,
        role: 'MENTOR',
        name: fbResult.userData.name,
        mobile: fbResult.userData.mobile,
        district: fbResult.userData.district,
        city: fbResult.userData.city,
        profileData: fbResult.mentorData,
      });

      localStorage.setItem('bba_mentors_token', syncRes.token);
      setToken(syncRes.token);
      setUser({ ...syncRes.user, profileId: fbResult.mentorData.id });
      return 'Registration successful! Your mentor profile is now active on Bihar Board Achievers Mentors.';
    } finally {
      setIsLoading(false);
    }
  };

  // 5. Google Sign-In via Firebase Auth
  const loginWithGoogle = async () => {
    setIsLoading(true);
    try {
      const { fbUser, idToken, userData } = await firestoreService.signInWithGoogle();
      const syncRes = await api.syncFirebaseUser({
        idToken,
        role: 'PARENT',
        name: userData.name,
        mobile: userData.mobile,
        district: userData.district,
        city: userData.city,
      });

      localStorage.setItem('bba_mentors_token', syncRes.token);
      setToken(syncRes.token);
      setUser({ ...syncRes.user, profileId: fbUser.uid });
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('bba_mentors_token');
    fbSignOut(auth).catch(() => {});
    setToken(null);
    setUser(null);
  };

  const refreshUser = async () => {
    if (!token) return;
    try {
      const data = await api.getCurrentUser();
      const profileId = data.profile?.id;
      setUser({ ...data.user, profileId });
    } catch {
      // Ignore
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        role,
        isAuthenticated: !!user,
        isLoading,
        login,
        loginWithGoogle,
        registerParent,
        registerMentor,
        logout,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

