import {
  db,
  auth,
  googleProvider,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  collection,
  doc,
  setDoc,
  addDoc,
  updateDoc,
  getDocs,
  getDoc,
  query,
  where,
  orderBy,
  onSnapshot,
  serverTimestamp,
} from '../firebase.ts';
import type { TuitionRequest, ExamAttempt, Mentor, User, Parent, Student } from '../types/index.ts';

export function formatFirebaseAuthError(err: any): string {
  if (!err) return 'Authentication failed. Please try again.';
  const code = err.code || '';
  if (code === 'auth/email-already-in-use') {
    return 'This email address is already registered. Please login directly with your password.';
  }
  if (code === 'auth/weak-password') {
    return 'Password must be at least 6 characters long.';
  }
  if (code === 'auth/invalid-email') {
    return 'Please enter a valid email address.';
  }
  if (code === 'auth/user-not-found' || code === 'auth/wrong-password' || code === 'auth/invalid-credential') {
    return 'Invalid email or password. Please verify your registered credentials.';
  }
  if (code === 'auth/too-many-requests') {
    return 'Access temporarily blocked due to multiple failed login attempts. Please try again in a few minutes.';
  }
  if (code === 'auth/popup-closed-by-user') {
    return 'Google sign-in popup was closed before completing.';
  }
  if (code === 'auth/network-request-failed') {
    return 'Network connection error. Please verify your internet connection.';
  }
  return err.message || 'Authentication error. Please try again.';
}

export const firestoreService = {
  // 1. Register Parent with Firebase Auth & Firestore
  registerParentWithFirebase: async (data: {
    name: string;
    email: string;
    mobile: string;
    password: string;
    district: string;
    city?: string;
    address?: string;
    childName?: string;
    classGrade?: string;
    board?: string;
    schoolName?: string;
    targetSubjects?: string[];
  }) => {
    try {
      const cleanEmail = data.email.trim().toLowerCase();
      const userCred = await createUserWithEmailAndPassword(auth, cleanEmail, data.password);
      const uid = userCred.user.uid;

      const userData: User = {
        id: uid,
        email: cleanEmail,
        role: 'PARENT',
        name: data.name.trim(),
        mobile: data.mobile.trim(),
        district: data.district || 'Patna',
        city: data.city || data.district || 'Patna',
        state: 'Bihar',
        createdAt: new Date().toISOString(),
      };

      await setDoc(doc(db, 'users', uid), {
        ...userData,
        createdAtServer: serverTimestamp(),
      });

      const parentData: Parent = {
        id: uid,
        userId: uid,
        name: data.name.trim(),
        mobile: data.mobile.trim(),
        email: cleanEmail,
        district: data.district || 'Patna',
        city: data.city || data.district || 'Patna',
        state: 'Bihar',
        address: data.address || data.district || 'Patna',
        createdAt: new Date().toISOString(),
      };

      await setDoc(doc(db, 'parents', uid), {
        ...parentData,
        createdAtServer: serverTimestamp(),
      });

      let studentData: Student | undefined;
      if (data.childName && data.childName.trim()) {
        const studentId = `student-${Date.now()}`;
        studentData = {
          id: studentId,
          parentId: uid,
          name: data.childName.trim(),
          classGrade: data.classGrade || 'Class 10',
          board: (data.board as any) || 'CBSE',
          schoolName: data.schoolName ? data.schoolName.trim() : '',
          gender: 'Other',
          subjects:
            Array.isArray(data.targetSubjects) && data.targetSubjects.length > 0
              ? data.targetSubjects
              : ['Mathematics', 'Science'],
          learningGoals: 'Strong conceptual fundamentals and high marks in school & board exams.',
          currentAcademicLevel: 'Average',
          address: data.address || data.district || 'Patna',
          district: data.district || 'Patna',
          city: data.city || data.district || 'Patna',
          preferredMode: 'Home Tuition',
          preferredTutorGender: 'No Preference',
          preferredTiming: 'Evening 5:00 PM - 7:00 PM',
          monthlyBudget: '₹3,500 - ₹5,000',
          status: 'Active',
          createdAt: new Date().toISOString(),
        };

        await setDoc(doc(db, 'students', studentId), {
          ...studentData,
          createdAtServer: serverTimestamp(),
        });
      }

      const idToken = await userCred.user.getIdToken();
      return { uid, idToken, userData, parentData, studentData };
    } catch (err: any) {
      throw new Error(formatFirebaseAuthError(err));
    }
  },

  // 2. Register Mentor with Firebase Auth & Firestore
  registerMentorWithFirebase: async (data: {
    name: string;
    email: string;
    mobile: string;
    password: string;
    district: string;
    city?: string;
    preferredAreas?: string[];
    qualification: string;
    college?: string;
    teachingExperience?: string;
    subjects: string[];
    classes: string[];
    boards: string[];
    teachingMode?: string;
    availability?: string;
    expectedFee?: string;
    about?: string;
  }) => {
    try {
      const cleanEmail = data.email.trim().toLowerCase();
      const userCred = await createUserWithEmailAndPassword(auth, cleanEmail, data.password);
      const uid = userCred.user.uid;

      const userData: User = {
        id: uid,
        email: cleanEmail,
        role: 'MENTOR',
        name: data.name.trim(),
        mobile: data.mobile.trim(),
        district: data.district || 'Patna',
        city: data.city || data.district || 'Patna',
        state: 'Bihar',
        createdAt: new Date().toISOString(),
      };

      await setDoc(doc(db, 'users', uid), {
        ...userData,
        createdAtServer: serverTimestamp(),
      });

      const mentorData: Mentor = {
        id: uid,
        userId: uid,
        fullName: data.name.trim(),
        mobile: data.mobile.trim(),
        email: cleanEmail,
        qualification: data.qualification || 'Graduate',
        college: data.college || 'University in Bihar',
        teachingExperience: data.teachingExperience || '2+ Years',
        subjects: data.subjects && data.subjects.length > 0 ? data.subjects : ['Mathematics', 'Science'],
        classes: data.classes && data.classes.length > 0 ? data.classes : ['Class 9', 'Class 10'],
        boards: (data.boards && data.boards.length > 0 ? data.boards : ['CBSE', 'BSEB']) as any,
        preferredAreas:
          data.preferredAreas && data.preferredAreas.length > 0
            ? data.preferredAreas
            : [data.city || data.district || 'Patna'],
        district: data.district || 'Patna',
        city: data.city || data.district || 'Patna',
        pincode: '800001',
        teachingMode: (data.teachingMode as any) || 'Home Tuition',
        availability: data.availability || 'Evenings 4:00 PM - 8:00 PM',
        expectedFee: data.expectedFee || '₹3,500 - ₹5,000 / month',
        about:
          data.about ||
          'Dedicated educator focused on building student confidence and rigorous problem solving.',
        profilePhoto:
          'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&h=300&fit=crop&crop=faces',
        rating: 5.0,
        reviewCount: 0,
        verificationStatus: 'Verified', // Active so profile is open on website immediately!
        createdAt: new Date().toISOString(),
      };

      await setDoc(doc(db, 'mentors', uid), {
        ...mentorData,
        createdAtServer: serverTimestamp(),
      });

      return { uid, idToken: await userCred.user.getIdToken(), userData, mentorData };
    } catch (err: any) {
      throw new Error(formatFirebaseAuthError(err));
    }
  },

  // 3. Login with Firebase Auth
  loginWithFirebase: async (email: string, password: string, requestedRole?: string) => {
    try {
      const cleanEmail = email.trim().toLowerCase();
      const userCred = await signInWithEmailAndPassword(auth, cleanEmail, password);
      const uid = userCred.user.uid;

      // Fetch user record from Firestore
      const userDocSnap = await getDoc(doc(db, 'users', uid));
      let userData: User;
      if (userDocSnap.exists()) {
        userData = userDocSnap.data() as User;
      } else {
        userData = {
          id: uid,
          email: cleanEmail,
          name: userCred.user.displayName || (cleanEmail === 'kdharmraj778@gmail.com' ? 'Dharmraj (Director & Admin)' : 'BBA User'),
          role: cleanEmail === 'kdharmraj778@gmail.com' ? 'ADMIN' : ((requestedRole as any) || 'PARENT'),
          mobile: cleanEmail === 'kdharmraj778@gmail.com' ? '6287919120' : '',
          district: 'Patna',
          city: 'Patna',
          state: 'Bihar',
          createdAt: new Date().toISOString(),
        };
        await setDoc(doc(db, 'users', uid), userData);
      }

      if (cleanEmail === 'kdharmraj778@gmail.com') {
        userData.role = 'ADMIN';
        userData.name = 'Dharmraj (Director & Admin)';
        userData.mobile = '6287919120';
        try {
          await setDoc(doc(db, 'users', uid), userData, { merge: true });
        } catch {
          // ignore offline sync
        }
      }

      if (requestedRole && userData.role !== requestedRole) {
        throw new Error(
          `This account is registered as ${userData.role}, not ${requestedRole}. Please select the ${userData.role.toLowerCase()} portal.`
        );
      }

      let profileData: any = null;
      if (userData.role === 'PARENT') {
        const pSnap = await getDoc(doc(db, 'parents', uid));
        if (pSnap.exists()) profileData = pSnap.data();
      } else if (userData.role === 'MENTOR') {
        const mSnap = await getDoc(doc(db, 'mentors', uid));
        if (mSnap.exists()) profileData = mSnap.data();
      }

      return { uid, idToken: await userCred.user.getIdToken(), userData, profileData };
    } catch (err: any) {
      throw new Error(formatFirebaseAuthError(err));
    }
  },

  // 4. Update Mentor Profile in Firestore
  updateMentorProfile: async (uid: string, updates: Partial<Mentor>) => {
    try {
      const mentorRef = doc(db, 'mentors', uid);
      await setDoc(mentorRef, updates, { merge: true });
      return { success: true };
    } catch (err: any) {
      console.warn('Firestore updateMentorProfile warning:', err);
      return { success: false, error: err };
    }
  },

  // 5. Update Parent Profile in Firestore
  updateParentProfile: async (uid: string, updates: Partial<Parent>) => {
    try {
      const parentRef = doc(db, 'parents', uid);
      await setDoc(parentRef, updates, { merge: true });
      return { success: true };
    } catch (err: any) {
      console.warn('Firestore updateParentProfile warning:', err);
      return { success: false, error: err };
    }
  },

  // 6. Google Sign-In via Firebase Auth
  signInWithGoogle: async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const fbUser = result.user;

      const userRef = doc(db, 'users', fbUser.uid);
      const userSnap = await getDoc(userRef);

      let userData: User;
      if (!userSnap.exists()) {
        userData = {
          id: fbUser.uid,
          email: fbUser.email || '',
          name: fbUser.displayName || 'Parent User',
          role: 'PARENT',
          mobile: fbUser.phoneNumber || '',
          district: 'Patna',
          city: 'Patna',
          state: 'Bihar',
          createdAt: new Date().toISOString(),
        };
        await setDoc(userRef, {
          ...userData,
          createdAtServer: serverTimestamp(),
        });

        const parentRef = doc(db, 'parents', fbUser.uid);
        await setDoc(parentRef, {
          id: fbUser.uid,
          userId: fbUser.uid,
          name: userData.name,
          mobile: userData.mobile,
          email: userData.email,
          city: 'Patna',
          district: 'Patna',
          state: 'Bihar',
          createdAt: new Date().toISOString(),
          createdAtServer: serverTimestamp(),
        });
      } else {
        userData = userSnap.data() as User;
      }

      return { fbUser, idToken: await fbUser.getIdToken(), userData };
    } catch (err: any) {
      console.error('Firebase Google Sign-In error:', err);
      throw new Error(formatFirebaseAuthError(err));
    }
  },

  // 2. Save Tuition Request to Firestore
  saveTuitionRequest: async (requestData: Partial<TuitionRequest>) => {
    try {
      const colRef = collection(db, 'tuitionRequests');
      const docRef = await addDoc(colRef, {
        ...requestData,
        status: requestData.status || 'Pending',
        createdAt: new Date().toISOString(),
        createdAtServer: serverTimestamp(),
      });
      return { success: true, id: docRef.id };
    } catch (err) {
      console.warn('Firestore tuition request save warning:', err);
      return { success: false, error: err };
    }
  },

  // 3. Save Free Demo Booking Request to Firestore
  saveDemoBooking: async (demoData: {
    parentName: string;
    parentMobile: string;
    studentClass: string;
    district: string;
    mode: string;
    preferredSubject?: string;
  }) => {
    try {
      const colRef = collection(db, 'demoBookings');
      const docRef = await addDoc(colRef, {
        ...demoData,
        status: 'Pending Verification',
        source: 'Website Landing Form',
        createdAt: new Date().toISOString(),
        createdAtServer: serverTimestamp(),
      });
      return { success: true, id: docRef.id };
    } catch (err) {
      console.warn('Firestore demo booking save warning:', err);
      return { success: false, error: err };
    }
  },

  // 4. Save Weekly Exam Attempt to Firestore
  saveExamAttempt: async (attemptData: Partial<ExamAttempt>) => {
    try {
      const colRef = collection(db, 'examAttempts');
      const docRef = await addDoc(colRef, {
        ...attemptData,
        createdAt: new Date().toISOString(),
        createdAtServer: serverTimestamp(),
      });
      return { success: true, id: docRef.id };
    } catch (err) {
      console.warn('Firestore exam attempt save warning:', err);
      return { success: false, error: err };
    }
  },

  // 5. Save Support Ticket to Firestore
  saveSupportTicket: async (ticketData: {
    userId: string;
    userName: string;
    role: string;
    subject: string;
    message: string;
    priority?: string;
  }) => {
    try {
      const colRef = collection(db, 'supportTickets');
      const docRef = await addDoc(colRef, {
        ...ticketData,
        status: 'Open',
        priority: ticketData.priority || 'Normal',
        createdAt: new Date().toISOString(),
        createdAtServer: serverTimestamp(),
      });
      return { success: true, id: docRef.id };
    } catch (err) {
      console.warn('Firestore support ticket save warning:', err);
      return { success: false, error: err };
    }
  },

  // 6. Real-time subscription to Tuition Requests
  subscribeTuitionRequests: (onUpdate: (requests: TuitionRequest[]) => void) => {
    try {
      const colRef = collection(db, 'tuitionRequests');
      return onSnapshot(colRef, (snapshot) => {
        const list: TuitionRequest[] = [];
        snapshot.forEach((doc) => {
          list.push({ id: doc.id, ...(doc.data() as any) });
        });
        onUpdate(list);
      });
    } catch (err) {
      console.warn('Firestore subscribeTuitionRequests error:', err);
      return () => {};
    }
  },

  // 7. Real-time subscription to Verified Mentors
  subscribeMentors: (district: string | null, onUpdate: (mentors: Mentor[]) => void) => {
    try {
      let q = query(collection(db, 'mentors'));
      if (district) {
        q = query(collection(db, 'mentors'), where('district', '==', district));
      }
      return onSnapshot(q, (snapshot) => {
        const list: Mentor[] = [];
        snapshot.forEach((doc) => {
          list.push({ id: doc.id, ...(doc.data() as any) });
        });
        onUpdate(list);
      });
    } catch (err) {
      console.warn('Firestore subscribeMentors error:', err);
      return () => {};
    }
  },

  // 8. Test Firestore Connection
  pingFirestore: async (): Promise<boolean> => {
    try {
      const pingDoc = doc(db, 'system_health', 'ping');
      await setDoc(pingDoc, {
        lastPing: new Date().toISOString(),
        status: 'online',
        updatedAt: serverTimestamp(),
      }, { merge: true });
      return true;
    } catch (err) {
      console.warn('Firestore ping notice:', err);
      return false;
    }
  },
};
