import React from 'react';
import { StyleSheet, Text } from 'react-native';
import { Button, useTheme } from 'react-native-paper';
import Categories from '../components/Categorias/Categorias';
import FabGroup from '../components/FAB/FAB';
import VisorProducto from '../components/VisorProducto/VisorProducto';
import VisorInput from './VisorInput';

import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import {
  NavigationContainer,
  Theme,
  useNavigation,
} from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Todo from './TodoScreen';
import useDB from '../hooks/useDB';
import { deleteSpecifiedTables } from '../service/product-service';
import { ModalProvider } from '../context/modalContext';
import ModalAcciones from '../components/ModalAcciones/ModalAcciones';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootNavigationProp, TabParamList } from '../models/routeTypes';
import TestView from '../components/TestView/TestView';
import SettingsMenu from './Settings';
import SettingsStackNavigator from '../navigator/SettingNavigator';

// import { useNavigation } from '@react-navigation/native';
// export type HomeProps = NativeStackScreenProps<any, any>;

// const categoriaName = 'Home';
// const inputName = 'Items';
// const productoName = 'Movimiento';
// const estadoName = 'Estado';
// const todoName = 'Notas';

const HomeScreen = () => {
  const theme = useTheme<Theme>();
  const tema = useTheme();
  const Tab = createBottomTabNavigator<TabParamList>();

  useDB();
  // deleteSpecifiedTables();

  return (
    <>
      <ModalProvider>
        <FabGroup />
        <ModalAcciones />
        <Tab.Navigator
          sceneContainerStyle={styles.barra}
          initialRouteName={'Items'}
          screenOptions={({ route }) => ({
            tabBarStyle: {
              backgroundColor: tema.colors.surface,
              borderTopWidth: 0,
              borderTopColor: tema.colors.elevation.level5,
              height: 50,
              elevation: 10,
            },

            tabBarLabel: ({ focused, color }) => (
              <Text
                style={[
                  styles.labelText,
                  {
                    color: focused ? tema.colors.primary : tema.colors.outline,
                  },
                ]}>
                {route.name}
              </Text>
            ),
            tabBarActiveTintColor: tema.colors.onSurface,
            tabBarInactiveTintColor: tema.colors.outline,
            tabBarIconStyle: {
              paddingBottom: 0,
              marginBottom: 0,
              height: 7,
            },
            tabBarIcon: ({ focused, color, size }) => {
              let iconName;

              switch (route.name) {
                // case 'Home':
                //   iconName = 'home-outline';
                //   break;
                case 'Items':
                  iconName = 'receipt-outline';
                  break;
                case 'Movimiento':
                  iconName = 'ticket-outline';
                  break;
                case 'Notas':
                  iconName = 'pencil';
                  break;
                // case 'Profile':
                //   iconName = 'user';
                //   break;
                case 'Estado':
                  iconName = 'stats-chart';
                  break;
                case 'Settings':
                  iconName = 'cog-outline';
                  break;
                default:
                  break;
              }
              return (
                <Ionicons
                  name={iconName}
                  size={19}
                  color={focused ? tema.colors.primary : tema.colors.outline}
                />
              );
            },
          })}>
          {/* <Tab.Screen
            name={'Home'}
            component={Categories}
            options={{ headerShown: false }}
          /> */}
          <Tab.Screen
            key={'1'}
            name={'Items'}
            component={Categories}
            options={{ headerShown: false }}
          />
          <Tab.Screen
            key={'2'}
            name={'Estado'}
            component={Todo}
            options={{ headerShown: false }}
          />
          <Tab.Screen
            key={'3'}
            name={'Movimiento'}
            component={VisorProducto}
            options={{ headerShown: false }}
          />
          <Tab.Screen
            key={'4'}
            name={'Notas'}
            component={Todo}
            options={{ headerShown: false }}
          />
          <Tab.Screen
            key={'5'}
            name={'Settings'}
            component={SettingsStackNavigator}
            options={{ headerShown: false }}
          />
        </Tab.Navigator>
      </ModalProvider>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  barra: {},
  labelText: {
    paddingTop: 0,
    marginTop: -10,
    marginBottom: 5,
    fontWeight: '500',
    fontSize: 10,
  },
});

export default HomeScreen;
