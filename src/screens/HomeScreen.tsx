import React from 'react';
import { StyleSheet } from 'react-native';
import { useTheme, BottomNavigation } from 'react-native-paper';
import { useUserAuth } from '../context/userAuthContext';
import Categories from '../components/Categorias/Categorias';
import FabGroup from '../components/FAB/FAB';
import VisorProducto from '../components/VisorProducto/VisorProducto';
import VisorInput from './VisorInput';

const CategoriaRoute = () => <Categories />;

const ProductoRoute = () => <VisorProducto />;
const InputRoute = () => <VisorInput />;

const HomeScreen = () => {
  const { logOut } = useUserAuth();
  const theme = useTheme();
  const [index, setIndex] = React.useState(0);
  const [state, setState] = React.useState({ open: false });

  const onStateChange = ({ open: any }) => setState({ open });

  const { open } = state;

  const [routes] = React.useState([
    {
      key: 'categoria',
      title: 'Categorias',
      focusedIcon: 'heart',
      unfocusedIcon: 'heart-outline',
    },
    { key: 'producto', title: 'Producto', focusedIcon: 'album' },
    { key: 'cosa1', title: 'Producto', focusedIcon: 'pencil' },
    { key: 'cosa2', title: 'Producto', focusedIcon: 'album' },
  ]);

  const renderScene = BottomNavigation.SceneMap({
    categoria: CategoriaRoute,
    producto: ProductoRoute,
    cosa1: InputRoute,
    cosa2: ProductoRoute,
  });

  return (
    <>
      <FabGroup />
      <BottomNavigation
        labeled={false}
        navigationState={{ index, routes }}
        onIndexChange={setIndex}
        renderScene={renderScene}
      />
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default HomeScreen;
