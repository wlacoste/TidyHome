import React from 'react';
import { StyleSheet, View } from 'react-native';
import {
  Button,
  Text,
  useTheme,
  BottomNavigation,
  FAB,
  Portal,
  Provider,
} from 'react-native-paper';
import { useUserAuth } from '../context/userAuthContext';
import Categories from '../components/Categorias/Categorias';
import ProductForm from '../components/ProductForm';
import FabGroup from '../components/FAB/FAB';
import ModalAcciones from '../components/ModalAcciones/ModalAcciones';

const CategoriaRoute = () => <Categories />;

const ProductoRoute = () => <ProductForm />;

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
  ]);

  const renderScene = BottomNavigation.SceneMap({
    categoria: CategoriaRoute,
    producto: ProductoRoute,
  });

  return (
    // <View
    //   style={[styles.container, { backgroundColor: theme.colors.background }]}>
    //   <Categories />
    //   <ProductForm />
    //   <View>
    //     <Text>HomeScreendd</Text>

    //     <Button icon="camera" mode="contained" onPress={logOut}>
    //       Log out
    //     </Button>
    //   </View>
    // </View>
    <>
      <FabGroup />
      <BottomNavigation
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
