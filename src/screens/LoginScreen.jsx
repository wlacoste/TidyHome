import React, { useState } from 'react';
import { Alert, KeyboardAvoidingView, StyleSheet, View } from 'react-native';
import { Button, Text, TextInput } from 'react-native-paper';
import { useUserAuth } from '../context/userAuthContext';

const LoginScreen = ({ navigation }) => {
  const [mail, setMail] = useState('');
  const [password, setPassword] = useState('');
  const [isPasswordSecure, setIsPasswordSecure] = useState(true);
  const [visible, setVisible] = useState(false);
  const onToggleSnackBar = () => setVisible(!visible);
  const { logIn } = useUserAuth();

  const handleLogin = () => {
    if (mail.trim() && password.trim()) {
      logIn(mail, password)
        .then(() => {
          Alert.alert('inicio sesionado');
        })
        .catch(error => console.log(error));
    }
  };

  return (
    <KeyboardAvoidingView behavior="padding" style={styles.container}>
      <View style={styles.titleContainer}>
        <Text variant="displayMedium">Clean Apps</Text>
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
          onPress={() => navigation.navigate('Signup')}>
          Register
        </Button>
        <Button
          mode="contained-tonal"
          style={[styles.button, styles.buttonOutline]}
          onPress={onToggleSnackBar}>
          Snack
        </Button>
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
