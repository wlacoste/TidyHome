import * as React from 'react';
import { Routes } from './src/Routes';
import { UserAuthContextProvider as AuthProvider } from './src/context/userAuthContext';
import { InputProvider } from './src/context/simpleInputContext';
import ProductProvider from './src/context/productContext';
import CategoryProvider from './src/context/categoryContext';
import SimpleProvider from './src/context/simpleContext';
import { ThemeProvider } from './src/context/themeContext';

import { MMKVLoader } from 'react-native-mmkv-storage';

const storage = new MMKVLoader().initialize();

export default function App() {
  return (
    <>
      <ThemeProvider>
        <AuthProvider>
          <CategoryProvider>
            <SimpleProvider>
              <ProductProvider>
                <InputProvider>
                  <Routes />
                </InputProvider>
              </ProductProvider>
            </SimpleProvider>
          </CategoryProvider>
        </AuthProvider>
      </ThemeProvider>
    </>
  );
}
