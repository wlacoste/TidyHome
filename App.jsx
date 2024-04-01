import auth from '@react-native-firebase/auth';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import * as React from 'react';
import { PaperProvider } from 'react-native-paper';

import HomeScreen from './src/screens/HomeScreen';
import LoginScreen from './src/screens/LoginScreen';

export default function App() {
  const [initializing, setInitializing] = React.useState(true);
  const [user, setUser] = React.useState();

  // Handle user state changes
  function onAuthStateChanged(user) {
    setUser(user);
    console.log(user);
    if (initializing) {
      setInitializing(false);
    }
  }

  React.useEffect(() => {
    const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
    return subscriber;
  }, []);

  if (initializing) {
    return null;
  }
  const Stack = createNativeStackNavigator();

  return (
    <NavigationContainer>
      <PaperProvider>
        <Stack.Navigator>
          {user == null ? (
            <Stack.Screen
              component={LoginScreen}
              name="Login"
              options={{ headerShown: false }}
            />
          ) : (
            <Stack.Screen component={HomeScreen} name="Home" />
          )}
        </Stack.Navigator>
      </PaperProvider>
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
