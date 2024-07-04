import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import { useUserAuth } from './context/userAuthContext';
import HomeScreen from './screens/HomeScreen';
import LoginScreen from './screens/LoginScreen';
import SignupScreen from './screens/SignupScreen';
import changeNavigationBarColor from 'react-native-navigation-bar-color';
import { useTheme } from 'react-native-paper';
import { rgbToHex } from './utils/rgbToHex';

export const Routes = () => {
  const Stack = createNativeStackNavigator();
  const { user } = useUserAuth();
  const theme = useTheme();

  React.useEffect(() => {
    return changeNavigationBarColor(
      rgbToHex(theme.colors.surface),
      !theme.dark,
    );
  }, [theme]);

  return (
    <Stack.Navigator>
      {user === null ? (
        <>
          <Stack.Screen
            component={LoginScreen}
            name="Login"
            options={{ headerShown: false }}
          />

          <Stack.Screen
            component={SignupScreen}
            name="Signup"
            options={{ headerShown: false }}
          />
        </>
      ) : (
        <Stack.Screen
          component={HomeScreen}
          name="Home"
          options={{ headerShown: false }}
        />
      )}
    </Stack.Navigator>
  );
};
