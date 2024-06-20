import React, { useEffect } from 'react';
import { StyleSheet } from 'react-native';
import { useTheme } from 'react-native-paper';
import Categories from '../components/Categorias/Categorias';
import FabGroup from '../components/FAB/FAB';
import VisorProducto from '../components/VisorProducto/VisorProducto';
import VisorInput from './VisorInput';

import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer, Theme } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Todo from './TodoScreen';
import useDB from '../hooks/useDB';
import { deleteSpecifiedTables } from '../service/product-service';

const categoriaName = 'Home';
const inputName = 'Items';
const productoName = 'Movimiento';
const estadoName = 'Estado';
const todoName = 'Notas';

const HomeScreen = () => {
  const theme = useTheme<Theme>();
  const tema = useTheme();
  const Tab = createBottomTabNavigator();

  useDB();
  // deleteSpecifiedTables();

  return (
    <>
      <FabGroup />
      <NavigationContainer independent={true} theme={theme}>
        <Tab.Navigator
          sceneContainerStyle={styles.barra}
          initialRouteName={categoriaName}
          screenOptions={({ route }) => ({
            tabBarStyle: {
              backgroundColor: tema.colors.surface,
              borderTopWidth: 0,
              borderTopColor: tema.colors.elevation.level5,
              height: 50,
              elevation: 10,
            },
            tabBarLabelStyle: {
              paddingTop: 0,
              marginTop: -10,
              marginBottom: 5,
              fontWeight: '500',
            },
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
                case 'Home':
                  iconName = 'home-outline';
                  break;
                case 'Items':
                  iconName = 'receipt-outline';
                  break;
                case 'Movimiento':
                  iconName = 'ticket-outline';
                  break;
                case 'Notas':
                  iconName = 'pencil';
                  break;
                case 'Profile':
                  iconName = 'user';
                  break;
                case 'Estado':
                  iconName = 'stats-chart';
                  break;
                default:
                  break;
              }
              return (
                <Ionicons
                  name={iconName}
                  size={19}
                  color={focused ? tema.colors.onSurface : tema.colors.outline}
                />
              );
            },
          })}>
          <Tab.Screen
            name={categoriaName}
            component={Categories}
            options={{ headerShown: false }}
          />
          <Tab.Screen
            name={inputName}
            component={VisorInput}
            options={{ headerShown: false }}
          />
          <Tab.Screen
            name={estadoName}
            component={Todo}
            options={{ headerShown: false }}
          />
          <Tab.Screen
            name={productoName}
            component={VisorProducto}
            options={{ headerShown: false }}
          />
          <Tab.Screen
            name={todoName}
            component={Todo}
            options={{ headerShown: false }}
          />
        </Tab.Navigator>
      </NavigationContainer>
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
});

export default HomeScreen;
