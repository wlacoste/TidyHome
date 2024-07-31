import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import { useUserAuth } from './context/userAuthContext';
import HomeScreen from './screens/HomeScreen';
import LoginScreen from './screens/LoginScreen';
import SignupScreen from './screens/SignupScreen';
import changeNavigationBarColor from 'react-native-navigation-bar-color';
import { useTheme } from 'react-native-paper';
import { rgbToHex } from './utils/rgbToHex';
import TestView from './components/TestView/TestView';
import { RootStackParamList } from './models/routeTypes';

export const Routes = () => {
  const Stack = createNativeStackNavigator<RootStackParamList>();

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
      <>
        <Stack.Screen
          component={HomeScreen}
          name="Start"
          options={{ headerShown: false }}
        />
        <Stack.Screen
          component={LoginScreen}
          name="Login"
          // options={{ headerShown: false }}
        />

        <Stack.Screen
          component={SignupScreen}
          name="Signup"
          // options={{ headerShown: false }}
        />

        <Stack.Screen component={TestView} name="Test" />
      </>
    </Stack.Navigator>
  );
};
