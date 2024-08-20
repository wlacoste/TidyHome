import React from 'react';
import { View, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { Icon, Text } from 'react-native-paper';
import imagen from '../../assets/img/cat-mascot.png';

const UserHeader = ({ user, onLoginPress, onLogoutPress }) => {
  if (user) {
    return (
      <View style={styles.container}>
        <View style={styles.userInfo}>
          <Image source={imagen} style={styles.avatar} />
          {/* <Image
            source={{ uri: user.avatar || 'https://via.placeholder.com/80' }}
            style={styles.avatar}
          /> */}
          <Text style={styles.greeting}>Hola, {user.nombre}!</Text>
        </View>
        <TouchableOpacity style={styles.logoutButton} onPress={onLogoutPress}>
          <Text style={styles.logoutButtonText}>Cerrar sesíon </Text>
          <Icon size={16} source={'chevron-right'} />
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.logoutButton} onPress={onLoginPress}>
        <Text style={styles.buttonText}>Iniciar sesión</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    // backgroundColor: '#f0f0f0',
    borderRadius: 8,
    marginBottom: 0,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  greeting: {
    fontSize: 16,
    fontWeight: 'bold',
    // color: 'red',
  },
  button: {
    backgroundColor: '#007AFF',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 16,
  },
  buttonText: {
    // color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  logoutButton: {
    // backgroundColor: '#FF3B30',
    paddingVertical: 8,
    paddingHorizontal: 5,
    borderRadius: 6,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  logoutButtonText: {
    // color: '#FFFFFF',
    fontSize: 14,
    // fontWeight: 'bold',
  },
});

export default UserHeader;
