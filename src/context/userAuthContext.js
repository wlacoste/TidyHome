/* eslint-disable react-hooks/exhaustive-deps */
import React, { createContext, useContext, useEffect, useState } from 'react';

import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';

const userAuthContext = createContext({});

export function UserAuthContextProvider({ children }) {
  const [initializing, setInitializing] = useState(true);
  const [user, setUser] = useState(null);

  const usersCollection = firestore().collection('Users');

  function logIn(email, password) {
    return auth().signInWithEmailAndPassword(email, password);
    // return signInWithEmailAndPassword(auth, email, password);
  }
  function signUp(email, password, nombre, apellido) {
    return auth()
      .createUserWithEmailAndPassword(email, password)
      .then(userCredential => {
        // const user = userCredential.user;
        // Save the user data to the "Users" collection
        return usersCollection.doc(userCredential.user.uid).set({
          email: userCredential.user.email,
          uid: userCredential.user.uid,
          nombre: nombre,
          apellido: apellido,
        });
      });
  }

  function logOut() {
    return auth().signOut();
    // return signOut(auth);
  }

  function onAuthStateChanged(usuario) {
    setUser(usuario);
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
