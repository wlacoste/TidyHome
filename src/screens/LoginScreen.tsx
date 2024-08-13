import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useState } from 'react';
import { Image, KeyboardAvoidingView, StyleSheet, View } from 'react-native';
import { Button, Text, TextInput, useTheme } from 'react-native-paper';
import { useUserAuth } from '../context/userAuthContext';
import Toast from 'react-native-toast-message';
import imagen from '../../assets/img/cat-mascot.png';

export type LoginScreenProps = NativeStackScreenProps<any, 'Login'>;

const LoginScreen = ({ navigation }: LoginScreenProps) => {
  const [mail, setMail] = useState('');
  const [password, setPassword] = useState('');
  const [isPasswordSecure, setIsPasswordSecure] = useState(true);

  const onToggleSnackBar = () =>
    Toast.show({
      type: 'info',
      text1: 'Esto es un toast',
      // text2: 'This is some something 👋',
    });
  const { logIn } = useUserAuth();
  const theme = useTheme();

  const handleLogin = () => {
    if (mail.trim() && password.trim()) {
      logIn(mail, password)
        .then(() => {
          Toast.show({
            type: 'success',
            text1: 'Sesion iniciada',
          });
        })
        .then(() => navigation.navigate('Productos'))
        .catch(error => {
          console.log(error.toString().split(']')[1]);
          Toast.show({
            type: 'error',
            text1: error.toString().split(']')[1],
          });
        });
    }
  };

  return (
    <KeyboardAvoidingView
      behavior="padding"
      style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={styles.titleContainer}>
        <Image source={imagen} style={styles.avatar} />

        <Text variant="displayMedium">Clean Apps</Text>
      </View>
      <View style={styles.inputContainer}>
        <TextInput
          placeholder="Mail"
          value={mail}
          onChangeText={text => setMail(text)}
        />
        <TextInput
          placeholder="Contraseña"
          right={
            <TextInput.Icon
              icon={isPasswordSecure ? 'eye' : 'eye-off'}
              onPress={() => {
                isPasswordSecure
                  ? setIsPasswordSecure(false)
                  : setIsPasswordSecure(true);
              }}
            />
          }
          value={password}
          onChangeText={text => setPassword(text)}
          secureTextEntry={isPasswordSecure}
        />
      </View>

      <View style={styles.buttonContainer}>
        <Button
          mode="contained-tonal"
          style={[
            styles.button,
            { backgroundColor: theme.colors.toastPrimary },
          ]}
          onPress={handleLogin}>
          Iniciar sesión
        </Button>
        <Button
          mode="contained-tonal"
          style={[styles.button]}
          onPress={() => navigation.navigate('Signup')}>
          Registrarse
        </Button>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  titleContainer: {
    marginBottom: 30,
    display: 'flex',
    alignItems: 'center',
  },
  avatar: {
    height: 200,
    width: 200,
  },
  inputContainer: {
    width: '80%',
    gap: 20,
  },
  buttonContainer: {
    width: '80%',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 40,
    gap: 10,
  },
  button: {
    width: '100%',
    borderRadius: 5,
  },
});

export default LoginScreen;
