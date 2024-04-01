import { NavigationContainer } from '@react-navigation/native';
import * as React from 'react';
import { PaperProvider } from 'react-native-paper';

import { Routes } from './src/Routes';
import { UserAuthContextProvider } from './src/context/userAuthContext';

export default function App() {
  return (
    <NavigationContainer>
      <UserAuthContextProvider>
        <PaperProvider>
          <Routes />
        </PaperProvider>
      </UserAuthContextProvider>
    </NavigationContainer>
  );
}

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: "#fff",
//     alignItems: "center",
//     justifyContent: "center",
//   },
// });
