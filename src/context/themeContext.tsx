import React, { createContext, useContext, useState } from 'react';
import { useColorScheme } from 'react-native';
import { MaterialDarkTheme, MaterialLightTheme } from '../theme/themeOptions';
import { PaperProvider } from 'react-native-paper';
import { NavigationContainer } from '@react-navigation/native';
import {
  DarkTheme as NavigationDarkTheme,
  DefaultTheme as NavigationDefaultTheme,
} from '@react-navigation/native';

const CombinedDefaultTheme = {
  ...NavigationDefaultTheme,
  ...MaterialLightTheme,
  colors: {
    ...NavigationDefaultTheme.colors,
    ...MaterialLightTheme.colors,
  },
};
const CombinedDarkTheme = {
  ...MaterialDarkTheme,
  ...NavigationDarkTheme,
  colors: {
    ...NavigationDarkTheme.colors,
    ...MaterialDarkTheme.colors,
  },
};

// Create a context for the theme
const ThemeContext = createContext({
  toggleTheme: (theme: 'light' | 'dark' | 'system') => {},
  themeType: 'system' as 'light' | 'dark' | 'system',
  theme: CombinedDefaultTheme,
});

// Custom hook to use the theme context
export const useCustomTheme = () => useContext(ThemeContext);

// Theme provider component
export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const colorScheme = useColorScheme();
  const [themeType, setThemeType] = useState<'light' | 'dark' | 'system'>(
    'system',
  );

  const toggleTheme = (theme: 'light' | 'dark' | 'system') => {
    setThemeType(theme);
  };

  //   const theme =
  //     themeType === 'system'
  //       ? colorScheme === 'dark'
  //         ? MaterialDarkTheme
  //         : MaterialLightTheme
  //       : themeType === 'dark'
  //       ? MaterialDarkTheme
  //       : MaterialLightTheme;
  const theme =
    themeType === 'system'
      ? colorScheme === 'dark'
        ? CombinedDarkTheme
        : CombinedDefaultTheme
      : themeType === 'dark'
      ? CombinedDarkTheme
      : CombinedDefaultTheme;
  const scheme = useColorScheme();

  return (
    <ThemeContext.Provider value={{ toggleTheme, themeType, theme }}>
      {/* <NavigationContainer
         theme={scheme === 'dark' ? MaterialDarkTheme : MaterialLightTheme}>*/}
      <PaperProvider theme={theme}>
        <NavigationContainer theme={theme}>{children}</NavigationContainer>
      </PaperProvider>
      {/* </NavigationContainer> */}
    </ThemeContext.Provider>
  );
};
