import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { NavigatorScreenParams, useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { RootNavigationProp, SettingsList } from '../models/routeTypes';

const SettingsMenu = () => {
  const navigation = useNavigation<RootNavigationProp>();

  const menuItems = [
    { icon: 'person', title: 'Perfil', route: 'Profile' },
    {
      icon: 'category',
      title: 'Ajustes de la categoría',
      route: 'CategorySettings',
    },
    { icon: 'attach-money', title: 'Moneda', route: 'Currency' },
    { icon: 'alarm', title: 'Recordatorio', route: 'Reminder' },
    { icon: 'payment', title: 'Pagos Regulares', route: 'RegularPayments' },
    {
      icon: 'date-range',
      title: 'Fecha de inicio mensual',
      route: 'MonthlyStartDate',
      isVIP: true,
    },
    { icon: 'color-lens', title: 'Temas', route: 'Themes' },
    { icon: 'format-size', title: 'Tamaño de fuente', route: 'FontSize' },
    {
      icon: 'dashboard',
      title: 'Ajustes de la página de inicio',
      route: 'HomePageSettings',
    },
    { icon: 'account-balance', title: 'Cuentas', route: 'Accounts' },
    { icon: 'assessment', title: 'Presupuesto', route: 'Budget' },
    {
      icon: 'import-export',
      title: 'Exportar datos',
      route: 'ExportData',
      isVIP: true,
    },
    { icon: 'lock', title: 'Contraseña', route: 'Password', isVIP: true },
  ];

  return (
    <ScrollView style={styles.container}>
      {menuItems.map((item, index) => (
        <TouchableOpacity
          key={index}
          style={styles.menuItem}
          onPress={() =>
            navigation.navigate('Settings', {
              screen: item.route as keyof SettingsList,
            })
          }>
          <Icon name={item.icon} size={24} color="#FFD700" />
          <Text style={styles.menuText}>{item.title}</Text>
          {item.isVIP && (
            <View style={styles.vipBadge}>
              <Text style={styles.vipText}>VIP</Text>
            </View>
          )}
          <Icon name="chevron-right" size={24} color="#555" />
        </TouchableOpacity>
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
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  menuText: {
    color: 'white',
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
