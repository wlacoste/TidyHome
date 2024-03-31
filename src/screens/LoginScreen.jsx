import {useNavigation} from '@react-navigation/core';
import React, {useState} from 'react';
import {useEffect} from 'react';
import {KeyboardAvoidingView, StyleSheet, View} from 'react-native';
import {Text, Button, TextInput} from 'react-native-paper';

import {auth} from '../../firebase';
import {useUserAuth} from '../context/userAuthContext';

const LoginScreen = () => {
  const [mail, setMail] = useState('');
  const [password, setPassword] = useState('');
  const [isPasswordSecure, setIsPasswordSecure] = useState(true);
  const {logIn, signUp} = useUserAuth();
  const [visible, setVisible] = useState(false);
  // const [error, setErrorMessage] = useState(null);
  const onToggleSnackBar = () => setVisible(!visible);

  // const onDismissSnackBar = () => setVisible(false);

  const navigation = useNavigation();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(user => {
      if (user) {
        navigation.navigate('Home');
      }
    });

    return () => {
      unsubscribe();
    };
  }, []);

  const handleLogin = () => {
    try {
      logIn(mail, password);
    } catch (err) {
      console.log(err.message);
    }
  };

  const handleSignUp = () => {
    try {
      signUp(mail, password);
    } catch (err) {
      console.log(err.message);
    }
  };

  return (
    <KeyboardAvoidingView behavior="padding" style={styles.container}>
      <View style={styles.titleContainer}>
        <Text variant="displayMedium">Clean App</Text>
      </View>
      <View style={styles.inputContainer}>
        <TextInput
          placeholder="Mail"
          style={styles.input}
          value={mail}
          onChangeText={text => setMail(text)}
        />
        <TextInput
          placeholder="Contraseña"
          right={
            <TextInput.Icon
              icon={isPasswordSecure ? 'eye-off' : 'eye'}
              onPress={() => {
                isPasswordSecure
                  ? setIsPasswordSecure(false)
                  : setIsPasswordSecure(true);
              }}
            />
          }
          value={password}
          onChangeText={text => setPassword(text)}
          // style={styles.input}
          secureTextEntry={isPasswordSecure}
        />
      </View>

      <View style={styles.buttonContainer}>
        <Button
          mode="contained-tonal"
          style={[styles.button, styles.buttonOutline]}
          onPress={handleLogin}>
          Login
        </Button>
        <Button
          mode="contained-tonal"
          style={[styles.button, styles.buttonOutline]}
          onPress={handleSignUp}>
          Register
        </Button>
        <Button
          mode="contained-tonal"
          style={[styles.button, styles.buttonOutline]}
          onPress={onToggleSnackBar}>
          Snack
        </Button>
        {/* <TouchableOpacity onPress={handleLogin} style={styles.button}>
          <Text style={styles.buttonText}> Login</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={handleSignUp}
          style={[styles.button, styles.buttonOutline]}
        >
          <Text style={styles.buttonOutlineText}>Register</Text>
        </TouchableOpacity> */}
        {/* <Snackbar
          visible={visible}
          onDismiss={onDismissSnackBar}
          action={{
            label: "Dismiss",
            onPress: () => {setVisible(false)
              
            },
          }}
        >
          {error}
        </Snackbar> */}
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  titleContainer: {
    marginBottom: 30,
  },
  inputContainer: {
    width: '80%',
    gap: 20,
  },
  input: {
    // backgroundColor: "white",
    // paddingHorizontal: 15,
    // paddingVertical: 10,
    // borderRadius: 10,
    // margin: 5,
  },
  buttonContainer: {
    width: '80%',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 40,
    gap: 10,
  },
  button: {
    // backgroundColor: "#0782F9",
    width: '100%',
    // padding: 15,
    borderRadius: 5,
  },
  // buttonOutline: {
  //   // backgroundColor: "white",
  //   marginTop: 5,
  //   borderColor: "#0782F9",
  //   borderWidth: 2,
  // },
  buttonText: {
    color: 'white',
    fontWeight: '700',
    fontSize: 16,
  },
  buttonOutlineText: {
    color: '#0782F9',
    fontWeight: '700',
    fontSize: 16,
  },
});

export default LoginScreen;
