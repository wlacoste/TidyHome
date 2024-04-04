import { NavigationContainer } from '@react-navigation/native';

import * as React from 'react';
import { useColorScheme } from 'react-native';
import { MD3LightTheme, PaperProvider } from 'react-native-paper';
import { Routes } from './src/Routes';
import { UserAuthContextProvider } from './src/context/userAuthContext';
import { DarkTheme } from './src/theme/themeOptions';

export default function App() {
  const scheme = useColorScheme();

  console.log(scheme);

  return (
    <NavigationContainer>
      <UserAuthContextProvider>
        <PaperProvider theme={scheme === 'dark' ? DarkTheme : MD3LightTheme}>
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
