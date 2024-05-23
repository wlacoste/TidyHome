import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import { useUserAuth } from './context/userAuthContext';
import HomeScreen from './screens/HomeScreen';
import LoginScreen from './screens/LoginScreen';
import SignupScreen from './screens/SignupScreen';
import changeNavigationBarColor from 'react-native-navigation-bar-color';
import { useTheme } from 'react-native-paper';

function rgbToHex(rgb) {
  // Extract the numbers from the string
  const result = rgb.match(/\d+/g);

  if (result) {
    // Convert each number to a two-digit hexadecimal string
    const r = parseInt(result[0], 10).toString(16).padStart(2, '0');
    const g = parseInt(result[1], 10).toString(16).padStart(2, '0');
    const b = parseInt(result[2], 10).toString(16).padStart(2, '0');

    // Concatenate the hex strings and prepend with #
    return `#${r}${g}${b}`;
  }

  // Return null if the input string is not in the expected format
  return 'red';
}
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
