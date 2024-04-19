import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Button, Text, useTheme } from 'react-native-paper';
import { useUserAuth } from '../context/userAuthContext';
import Categories from '../components';

const HomeScreen = () => {
  const { logOut } = useUserAuth();
  const theme = useTheme();

  return (
    <>
      <Categories />
      <View
        style={[
          styles.container,
          { backgroundColor: theme.colors.background },
        ]}>
        <Text>HomeScreendd</Text>

        <Button icon="camera" mode="contained" onPress={logOut}>
          Log out
        </Button>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default HomeScreen;
