// import {
//   GoogleAuthProvider,
//   createUserWithEmailAndPassword,
//   onAuthStateChanged,
//   signInWithEmailAndPassword,
//   signInWithPopup,
//   signOut,
// } from 'firebase/auth';
import React, { createContext, useContext, useEffect, useState } from 'react';

// import { auth } from '../../firebase';

import auth from '@react-native-firebase/auth';

const userAuthContext = createContext({});

export function UserAuthContextProvider({ children }) {
  const [initializing, setInitializing] = useState(true);
  const [user, setUser] = useState(null);

  function logIn(email, password) {
    return auth().signInWithEmailAndPassword(email, password);
    // return signInWithEmailAndPassword(auth, email, password);
  }
  function signUp(email, password) {
    return auth().createUserWithEmailAndPassword(email, password);
    // return createUserWithEmailAndPassword(auth, );
  }
  function logOut() {
    return auth.logOut();
    // return signOut(auth);
  }

  function onAuthStateChanged(user) {
    console.log('usuario', user);
    setUser(user);
    if (initializing) {
      setInitializing(false);
    }
  }

  useEffect(() => {
    const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
    return subscriber; // unsubscribe on unmount
  }, []);

  return (
    <userAuthContext.Provider value={{ user, logIn, signUp, logOut }}>
      {children}
    </userAuthContext.Provider>
  );
}

export function useUserAuth() {
  return useContext(userAuthContext);
}
