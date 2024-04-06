import React from 'react';
import { Text, View } from 'react-native';
import { Button } from 'react-native-paper';
import { useUserAuth } from '../context/userAuthContext';

const HomeScreen = () => {
  const { logOut } = useUserAuth();

  return (
    <View>
      <Text>HomeScreendd</Text>

      <Button icon="camera" mode="contained" onPress={logOut}>
        Log out
      </Button>
    </View>
  );
};

export default HomeScreen;
