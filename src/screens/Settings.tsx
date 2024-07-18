import React from 'react';
import { TouchableOpacity, StyleSheet, ScrollView, View } from 'react-native';
import { NavigatorScreenParams, useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { RootNavigationProp, SettingsList } from '../models/routeTypes';
import { Divider, Text, useTheme } from 'react-native-paper';
import { useUserAuth } from '../context/userAuthContext';

const SettingsMenu = () => {
  const navigation = useNavigation<RootNavigationProp>();
  const { user, logOut } = useUserAuth();

  const theme = useTheme();
  return (
    <ScrollView
      style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View>
        <Text>Hola, {user?.email}</Text>
        {!user && (
          <>
            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => {
                navigation.navigate('Login');
              }}>
              <Text>Login</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => {
                navigation.navigate('Signup');
              }}>
              <Text>Register</Text>
            </TouchableOpacity>
          </>
        )}
        {user && (
          <TouchableOpacity style={styles.menuItem} onPress={() => logOut()}>
            <Text>Cerrar sesion</Text>
          </TouchableOpacity>
        )}
        <Divider />
      </View>
      {menuItems.map((item, index) => (
        <View key={index}>
          <TouchableOpacity
            style={styles.menuItem}
            onPress={() =>
              navigation.navigate('Ajustes', {
                screen: item.route as keyof SettingsList,
              })
            }>
            <Icon name={item.icon} size={24} color={theme.colors.primary} />
            <Text style={styles.menuText}>{item.title}</Text>
            <Icon name="chevron-right" size={24} color="#555" />
          </TouchableOpacity>
          <Divider />
        </View>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    // borderBottomWidth: 1,
    // borderBottomColor: '#333',
  },
  menuText: {
    // color: 'white',
    fontSize: 16,
    marginLeft: 15,
    flex: 1,
  },
  vipBadge: {
    backgroundColor: '#FFD700',
    borderRadius: 10,
    paddingHorizontal: 8,
    paddingVertical: 2,
    marginRight: 10,
  },
  vipText: {
    color: '#121212',
    fontSize: 12,
    fontWeight: 'bold',
  },
});

export default SettingsMenu;
const menuItems = [
  { icon: 'person', title: 'Perfil', route: 'Profile' },
  {
    icon: 'category',
    title: 'Ajustes de la categoría',
    route: 'CategorySettings',
  },
  { icon: 'attach-money', title: 'Reset base', route: 'Currency' },
  // { icon: 'alarm', title: 'Recordatorio', route: 'Reminder' },
  // { icon: 'payment', title: 'Pagos Regulares', route: 'RegularPayments' },
  // {
  //   icon: 'date-range',
  //   title: 'Fecha de inicio mensual',
  //   route: 'MonthlyStartDate',
  // },
  { icon: 'color-lens', title: 'Temas', route: 'Themes' },
  // {
  //   icon: 'dashboard',
  //   title: 'Ajustes de la página de inicio',
  //   route: 'HomePageSettings',
  // },
  // { icon: 'account-balance', title: 'Cuentas', route: 'Accounts' },
  // { icon: 'assessment', title: 'Presupuesto', route: 'Budget' },
  {
    icon: 'import-export',
    title: 'Exportar datos',
    route: 'ExportData',
  },
  {
    icon: 'message',
    title: 'Comentarios',
    route: 'Comentarios',
  },
  {
    icon: 'info',
    title: 'About',
    route: 'About',
  },
  // { icon: 'lock', title: 'Contraseña', route: 'Password' },
];
