import { createContext, useContext, useEffect, useState } from 'react';

import auth, { FirebaseAuthTypes } from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import Toast from 'react-native-toast-message';

interface UserAuthContextType {
  user: FirebaseAuthTypes.User | null;
  logIn: (
    email: string,
    password: string,
  ) => Promise<FirebaseAuthTypes.UserCredential>;
  signUp: (
    email: string,
    password: string,
    nombre: string,
    apellido: string,
  ) => Promise<any>;
  logOut: () => void;
}
const defaultValue: UserAuthContextType = {
  user: null,
  logIn: async () => {
    throw new Error('logIn function must be overridden');
  },
  signUp: async () => {
    throw new Error('signUp function must be overridden');
  },
  logOut: () => {},
};

const UserAuthContext = createContext<UserAuthContextType>(defaultValue);

const UserAuthContextProvider = ({ children }: any) => {
  const [initializing, setInitializing] = useState(true);
  const [user, setUser] = useState<FirebaseAuthTypes.User | null>(null);

  const usersCollection = firestore().collection('Users');

  function logIn(email: string, password: string) {
    return auth().signInWithEmailAndPassword(email, password);
    // return signInWithEmailAndPassword(auth, email, password);
  }
  function signUp(
    email: string,
    password: string,
    nombre: string,
    apellido: string,
  ) {
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
      })
      .then(() => {
        Toast.show({
          type: 'success',
          text1: 'Usuario registrado',
        });
      })
      .catch(error => {
        Toast.show({
          type: 'error',
          text1: 'Ha ocurrido un error al registrar el usuario',
        });
      });
  }

  function logOut() {
    return auth().signOut();
    // return signOut(auth);
  }

  function onAuthStateChanged(usuario: FirebaseAuthTypes.User | null) {
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
    // eslint-disable-next-line react/react-in-jsx-scope
    <UserAuthContext.Provider value={{ user, logIn, signUp, logOut }}>
      {children}
    </UserAuthContext.Provider>
  );
};

export function useUserAuth() {
  return useContext(UserAuthContext);
}
export { UserAuthContextProvider };
// export { UserAuthContext, UserAuthContextProvider };
