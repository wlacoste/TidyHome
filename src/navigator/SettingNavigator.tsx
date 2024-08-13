import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import TestView from '../components/TestView/TestView';
import { SettingsList } from '../models/routeTypes';
import SettingsMenu from '../screens/Settings';
import ResetTables from '../components/ResetTables/Reset';
import About from '../screens/About';
import ThemeSwitcher from '../screens/Theme';
import CategoryView from '../screens/CategoryView';

const SettingsStack = createNativeStackNavigator<SettingsList>();

function SettingsStackNavigator() {
  return (
    <SettingsStack.Navigator>
      <SettingsStack.Screen
        name="SettingsMenu"
        component={SettingsMenu}
        options={{ title: 'Ajustes', headerShown: false }}
      />

      <SettingsStack.Screen
        name="Profile"
        component={TestView}
        options={{ title: 'Perfil' }}
      />
      <SettingsStack.Screen name="Reminder" component={TestView} />
      <SettingsStack.Screen name="RegularPayments" component={TestView} />
      <SettingsStack.Screen name="Currency" component={ResetTables} />
      <SettingsStack.Screen name="About" component={About} />
      <SettingsStack.Screen name="Themes" component={ThemeSwitcher} />
      <SettingsStack.Screen
        name="CategorySettings"
        component={CategoryView}
        options={{ title: 'Ajustes de categoría' }}
      />
      {/* <SettingsStack.Screen name="ExportData" component={ProductForm} /> */}
      {/* Add other settings screens here */}
    </SettingsStack.Navigator>
  );
}

export default SettingsStackNavigator;
