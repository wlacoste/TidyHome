import { NavigationContainer } from '@react-navigation/native';

import * as React from 'react';
import { useColorScheme } from 'react-native';
import { PaperProvider } from 'react-native-paper';
import { Routes } from './src/Routes';
import { UserAuthContextProvider } from './src/context/userAuthContext';
import { InputProvider } from './src/context/simpleInputContext';
import ProductProvider from './src/context/productContext';
import {
  MaterialDarkTheme,
  MaterialLightTheme,
} from './src/theme/themeOptions';
import { MMKVLoader } from 'react-native-mmkv-storage';

const storage = new MMKVLoader().initialize();

export default function App() {
  const scheme = useColorScheme();

  return (
    <NavigationContainer
      theme={scheme === 'dark' ? MaterialDarkTheme : MaterialLightTheme}>
      <UserAuthContextProvider>
        <ProductProvider>
          <InputProvider>
            <PaperProvider
              theme={
                scheme === 'dark' ? MaterialDarkTheme : MaterialLightTheme
              }>
              <Routes />
            </PaperProvider>
          </InputProvider>
        </ProductProvider>
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
