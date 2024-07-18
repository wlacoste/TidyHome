import React, { createContext, useContext, useState, useEffect } from 'react';
import { useColorScheme } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { PaperProvider } from 'react-native-paper';
import { MaterialDarkTheme, MaterialLightTheme } from '../theme/themeOptions'; // Assume these are your custom themes

// Create the context with a default value
const ThemeContext = createContext({
  toggleTheme: () => {},
  themeType: 'system',
  theme: MaterialLightTheme,
});

// Custom hook to use the theme context
export const useCustomTheme = () => useContext(ThemeContext);

// Theme provider component
export const ThemeProvider = ({ children }) => {
  const colorScheme = useColorScheme();
  const [themeType, setThemeType] = useState('system');

  const toggleTheme = theme => {
    if (['light', 'dark', 'system'].includes(theme)) {
      setThemeType(theme);
    } else {
      console.warn('Invalid theme type. Use "light", "dark", or "system".');
    }
  };

  const getTheme = () => {
    if (themeType === 'system') {
      return colorScheme === 'dark' ? MaterialDarkTheme : MaterialLightTheme;
    }
    return themeType === 'dark' ? MaterialDarkTheme : MaterialLightTheme;
  };

  const [theme, setTheme] = useState(getTheme());

  useEffect(() => {
    setTheme(getTheme());
  }, [themeType, colorScheme]);

  return (
    <ThemeContext.Provider value={{ toggleTheme, themeType, theme }}>
      <PaperProvider theme={theme}>
        <NavigationContainer theme={theme}>{children}</NavigationContainer>
      </PaperProvider>
    </ThemeContext.Provider>
  );
};
