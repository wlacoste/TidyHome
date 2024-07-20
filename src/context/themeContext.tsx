import React, { createContext, useContext, useEffect, useState } from 'react';
import { StyleSheet, useColorScheme } from 'react-native';
import { MaterialDarkTheme, MaterialLightTheme } from '../theme/themeOptions';
import { ActivityIndicator, PaperProvider } from 'react-native-paper';
import { NavigationContainer } from '@react-navigation/native';
import {
  DarkTheme as NavigationDarkTheme,
  DefaultTheme as NavigationDefaultTheme,
} from '@react-navigation/native';
import { toastConfig } from '../utils/toastConfig';
import Toast from 'react-native-toast-message';
import { getTheme, initDatabase, saveTheme } from '../service/theme-service';

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

const ThemeContext = createContext({
  toggleTheme: (theme: 'light' | 'dark' | 'system') => {},
  themeType: 'system' as 'light' | 'dark' | 'system',
  theme: CombinedDefaultTheme,
});

export const useCustomTheme = () => useContext(ThemeContext);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const colorScheme = useColorScheme();
  const [themeType, setThemeType] = useState<'light' | 'dark' | 'system'>(
    'system',
  );
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initializeTheme = async () => {
      try {
        await initDatabase();
        const savedTheme = await getTheme();
        setThemeType(savedTheme);
      } catch (error) {
        Toast.show({
          type: 'error',
          text1: 'Hubo un error al obtener el tema',
        });
        console.error('Failed to initialize theme:', error);
      } finally {
        setIsLoading(false);
      }
    };

    initializeTheme();
  }, []);

  const toggleTheme = async (theme: 'light' | 'dark' | 'system') => {
    setThemeType(theme);
    try {
      await saveTheme(theme);
      Toast.show({
        type: 'success',
        text1: `Se cambió el tema a ${theme}`,
      });
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Hubo un error al cambiar el tema',
      });
      console.error('Failed to save theme:', error);
    }
  };

  if (isLoading) {
    return (
      <ActivityIndicator
        style={styles.loading}
        animating={true}
        size={'large'}
      />
    );
  }

  const theme =
    themeType === 'system'
      ? colorScheme === 'dark'
        ? CombinedDarkTheme
        : CombinedDefaultTheme
      : themeType === 'dark'
      ? CombinedDarkTheme
      : CombinedDefaultTheme;

  return (
    <ThemeContext.Provider value={{ toggleTheme, themeType, theme }}>
      <PaperProvider theme={theme}>
        <NavigationContainer theme={theme}>{children}</NavigationContainer>
      </PaperProvider>
      <Toast config={toastConfig(theme)} />
    </ThemeContext.Provider>
  );
};

const styles = StyleSheet.create({
  loading: {
    flexGrow: 1,
  },
});
