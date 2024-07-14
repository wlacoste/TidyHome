import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import TestView from '../components/TestView/TestView';
import { SettingsList } from '../models/routeTypes';
import SettingsMenu from '../screens/Settings';
import ResetTables from '../components/ResetTables/Reset';

const SettingsStack = createNativeStackNavigator<SettingsList>();

function SettingsStackNavigator() {
  return (
    <SettingsStack.Navigator>
      <SettingsStack.Screen
        name="SettingsMenu"
        component={SettingsMenu}
        options={{ title: 'Ajustes' }}
      />

      <SettingsStack.Screen
        name="Profile"
        component={TestView}
        options={{ title: 'Perfil' }}
      />
      <SettingsStack.Screen name="Reminder" component={TestView} />
      <SettingsStack.Screen name="RegularPayments" component={TestView} />
      <SettingsStack.Screen name="Currency" component={ResetTables} />
      {/* Add other settings screens here */}
    </SettingsStack.Navigator>
  );
}

export default SettingsStackNavigator;
