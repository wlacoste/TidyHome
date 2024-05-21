import React from 'react';
import { StyleSheet } from 'react-native';
import { useTheme, BottomNavigation, Icon } from 'react-native-paper';
import { useUserAuth } from '../context/userAuthContext';
import Categories from '../components/Categorias/Categorias';
import FabGroup from '../components/FAB/FAB';
import VisorProducto from '../components/VisorProducto/VisorProducto';
import VisorInput from './VisorInput';

import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer, Theme } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';

const CategoriaRoute = () => <Categories />;
const ProductoRoute = () => <VisorProducto />;
const InputRoute = () => <VisorInput />;

const categoriaName = 'Categoria';
const inputName = 'Input';
const productoName = 'Producto';

const HomeScreen = () => {
  // const { logOut } = useUserAuth();
  const theme = useTheme<Theme>();
  const tema = useTheme();
  // const [index, setIndex] = React.useState(0);
  // const [state, setState] = React.useState({ open: false });

  // const onStateChange = ({ open: any }) => setState({ open });

  // const { open } = state;

  // const [routes] = React.useState([
  //   {
  //     key: 'categoria',
  //     title: 'Categorias',
  //     focusedIcon: 'heart',
  //     unfocusedIcon: 'heart-outline',
  //   },
  //   { key: 'producto', title: 'Producto', focusedIcon: 'album' },
  //   { key: 'cosa1', title: 'Producto', focusedIcon: 'pencil' },
  //   { key: 'cosa2', title: 'Producto', focusedIcon: 'album' },
  // ]);

  // const renderScene = BottomNavigation.SceneMap({
  //   categoria: CategoriaRoute,
  //   producto: ProductoRoute,
  //   cosa1: InputRoute,
  //   cosa2: ProductoRoute,
  // });

  const Tab = createBottomTabNavigator();

  const getIcon = (name, focused) => {
    let iconName;
    let rn = name;
    if (rn === categoriaName) {
      iconName = focused ? 'home' : 'pencil';
    } else if (rn === inputName) {
      iconName = focused ? 'album' : 'heart';
    }
    return <Ionicons name={iconName} />;
  };

  return (
    <>
      <FabGroup />
      {/* <BottomNavigation
        labeled={false}
        navigationState={{ index, routes }}
        onIndexChange={setIndex}
        renderScene={renderScene}
      /> */}
      <NavigationContainer independent={true} theme={theme}>
        <Tab.Navigator
          sceneContainerStyle={styles.barra}
          initialRouteName={categoriaName}
          // tabBarStyle={{ backGroundColor: 'red' }}
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
              // color: 'red',
            },
            tabBarIcon: ({ focused, color, size }) => {
              let iconName;

              switch (route.name) {
                case 'Categoria':
                  iconName = 'home';
                  break;
                case 'Input':
                  iconName = 'folder';
                  break;
                case 'Producto':
                  iconName = 'home';
                  break;
                case 'Forum':
                  iconName = 'activity';
                  break;
                case 'Profile':
                  iconName = 'user';
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
              // return <LottieView source={filePath} loop={false} autoPlay={focused} />;
              // return <Icon name={iconName} color={color} size={24} />;
            },
          })}
          // tabBarOptions={{}}
        >
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
            name={productoName}
            component={VisorProducto}
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
