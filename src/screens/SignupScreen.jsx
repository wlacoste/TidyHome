import React, { useState } from 'react';
import { KeyboardAvoidingView, StyleSheet, View } from 'react-native';
import { Button, Text, TextInput } from 'react-native-paper';
import { useUserAuth } from '../context/userAuthContext';

const SignupScreen = () => {
  const [nombre, setNombre] = useState('');
  const [apellido, setApellido] = useState('');
  const [mail, setMail] = useState('');
  const [password, setPassword] = useState('');
  const [isPasswordSecure, setIsPasswordSecure] = useState(true);
  const { signUp } = useUserAuth();

  const handleSignUp = () => {
    if (mail.trim() && password.trim() && nombre.trim() && apellido.trim()) {
      signUp(mail, password, nombre, apellido);
    }
  };

  return (
    <KeyboardAvoidingView behavior="padding" style={styles.container}>
      <View style={styles.titleContainer}>
        <Text variant="displayMedium">Sign up</Text>
      </View>
      <View style={styles.inputContainer}>
        <TextInput
          placeholder="Nombre"
          style={styles.input}
          value={nombre}
          onChangeText={text => setNombre(text)}
        />
        <TextInput
          placeholder="apellido"
          style={styles.input}
          value={apellido}
          onChangeText={text => setApellido(text)}
        />
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
          onPress={handleSignUp}>
          Register
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

export default SignupScreen;
