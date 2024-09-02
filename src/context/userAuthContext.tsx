import React, { createContext, useState, useEffect, useContext } from 'react';
import auth, { FirebaseAuthTypes } from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import Toast from 'react-native-toast-message';

interface UserData {
  email: string | null;
  uid: string;
  nombre: string;
  apellido: string;
  displayName: string;
}

interface UserAuthContextType {
  user: UserData | null;
  logIn: (email: string, password: string) => Promise<void>;
  signUp: (
    email: string,
    password: string,
    nombre: string,
    apellido: string,
  ) => Promise<void>;
  logOut: () => Promise<void>;
  updateUserProfile: (displayName: string) => Promise<void>;
}

const defaultValue: UserAuthContextType = {
  user: null,
  logIn: async () => {},
  signUp: async () => {},
  logOut: async () => {},
  updateUserProfile: async () => {},
};

const UserAuthContext = createContext<UserAuthContextType>(defaultValue);

const UserAuthContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [initializing, setInitializing] = useState(true);
  const [user, setUser] = useState<UserData | null>(null);

  const usersCollection = firestore().collection('Users');

  async function logIn(email: string, password: string) {
    try {
      await auth().signInWithEmailAndPassword(email, password);
      // Fetch user data from Firestore
      const userDoc = await usersCollection.doc(auth().currentUser?.uid).get();
      if (userDoc.exists) {
        setUser(userDoc.data() as UserData);
      }
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Login failed',
        text2: (error as Error).message,
      });
    }
  }

  async function signUp(
    email: string,
    password: string,
    nombre: string,
    apellido: string,
  ) {
    try {
      const signInMethods = await auth().fetchSignInMethodsForEmail(email);

      if (signInMethods.length > 0) {
        // Email already exists
        Toast.show({
          type: 'error',
          text1: 'Registration failed',
          text2: 'This email is already registered',
        });
        return;
      }
      const userCredential = await auth().createUserWithEmailAndPassword(
        email,
        password,
      );
      const displayName = `${nombre}`;
      await userCredential.user.updateProfile({ displayName });

      const userData: UserData = {
        email: userCredential.user.email,
        uid: userCredential.user.uid,
        nombre,
        apellido,
        displayName,
      };

      await usersCollection.doc(userCredential.user.uid).set(userData);
      setUser(userData);

      Toast.show({
        type: 'success',
        text1: 'User registered successfully',
      });
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Registration failed',
        text2: (error as Error).message,
      });
    }
  }

  async function logOut() {
    try {
      await auth().signOut();
      setUser(null);
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Logout failed',
        text2: (error as Error).message,
      });
    }
  }

  async function updateUserProfile(displayName: string) {
    try {
      const currentUser = auth().currentUser;
      if (currentUser) {
        await currentUser.updateProfile({ displayName });
        await usersCollection.doc(currentUser.uid).update({ displayName });
        setUser(prevUser => (prevUser ? { ...prevUser, displayName } : null));
      }
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Profile update failed',
        text2: (error as Error).message,
      });
    }
  }

  async function onAuthStateChanged(
    firebaseUser: FirebaseAuthTypes.User | null,
  ) {
    if (firebaseUser) {
      const userDoc = await usersCollection.doc(firebaseUser.uid).get();
      if (userDoc.exists) {
        setUser(userDoc.data() as UserData);
      }
    } else {
      setUser(null);
    }
    if (initializing) {
      setInitializing(false);
    }
  }

  useEffect(() => {
    const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
    return subscriber; // unsubscribe on unmount
  }, []);

  return (
    <UserAuthContext.Provider
      value={{ user, logIn, signUp, logOut, updateUserProfile }}>
      {children}
    </UserAuthContext.Provider>
  );
};

export function useUserAuth() {
  return useContext(UserAuthContext);
}

export { UserAuthContextProvider };
