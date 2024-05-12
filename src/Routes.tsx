import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import { useUserAuth } from './context/userAuthContext';
import HomeScreen from './screens/HomeScreen';
import LoginScreen from './screens/LoginScreen';
import SignupScreen from './screens/SignupScreen';
import { Provider } from 'react-native-paper';

const HomeProvider = () => {
  return (
    <Provider>
      <HomeScreen />
    </Provider>
  );
};
export const Routes = () => {
  const Stack = createNativeStackNavigator();
  const { user } = useUserAuth();

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
        <Stack.Screen component={HomeScreen} name="Home" />
      )}
    </Stack.Navigator>
  );
};
