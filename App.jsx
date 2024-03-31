import {NavigationContainer} from '@react-navigation/native';
import * as React from 'react';
import {PaperProvider} from 'react-native-paper';

import {UserAuthContextProvider} from './src/context/userAuthContext';
import Routes from './src/Routes/Routes';

export default function App() {
  return (
    <NavigationContainer>
      <PaperProvider>
        <UserAuthContextProvider>
          <Routes />
        </UserAuthContextProvider>
      </PaperProvider>
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
