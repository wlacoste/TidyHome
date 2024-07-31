import React from 'react';
import { StyleSheet, Text } from 'react-native';
import { useTheme } from 'react-native-paper';
import Categories from '../components/Categorias/Categorias';
import FabGroup from '../components/FAB/FAB';

import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Theme } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Todo from './TodoScreen';
import useDB from '../hooks/useDB';
import { ModalProvider } from '../context/modalContext';
import { TabParamList } from '../models/routeTypes';
import SettingsStackNavigator from '../navigator/SettingNavigator';
import ProductStackNavigator from '../navigator/ProductNavigator';
import { FabProvider } from '../context/fabContext';

const HomeScreen = () => {
  // const theme = useTheme<Theme>();
  const tema = useTheme();
  const Tab = createBottomTabNavigator<TabParamList>();

  useDB();
  // deleteSpecifiedTables();

  return (
    <>
      <ModalProvider>
        <FabProvider>
          <Tab.Navigator
            sceneContainerStyle={styles.barra}
            initialRouteName={'Productos'}
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
                      color: focused
                        ? tema.colors.primary
                        : tema.colors.outline,
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
                  case 'Productos':
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
                  case 'Ajustes':
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
              name={'Productos'}
              component={ProductStackNavigator}
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
              name={'Ajustes'}
              component={SettingsStackNavigator}
              options={{ headerShown: false }}
            />
          </Tab.Navigator>
          {/* <Portal.Host> */}
          <FabGroup />
          {/* </Portal.Host> */}
          {/* <NewFAB /> */}
        </FabProvider>
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
