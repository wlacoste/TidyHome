import { useNavigation } from '@react-navigation/native';
import React, { useMemo, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { FAB, Portal, useTheme } from 'react-native-paper';
import { useFab } from '../../context/fabContext';
import { useModal } from '../../context/modalContext';
import { RootNavigationProp } from '../../models/routeTypes';
import CatFallback from '../CatFallback';
import ProductForm from '../GestorProductos/ProductForm';

const CatModal = () => {
  return (
    <View style={{ width: 200, height: 200 }}>
      <CatFallback titulo={''} />
    </View>
  );
};
const FabGroup = () => {
  const theme = useTheme();
  const [state, setState] = useState({ open: false });

  const onStateChange = ({ open }) => setState({ open });

  const { open } = state;

  const { closeModal, openModal } = useModal();

  const { shouldBeVisible, isTabScreen } = useFab();

  const bottomPosition = useMemo(() => {
    return isTabScreen && shouldBeVisible ? 0 : -136;
  }, [isTabScreen, shouldBeVisible]);

  const navigation = useNavigation<RootNavigationProp>();
  return (
    <Portal>
      <FAB.Group
        open={open}
        visible
        icon={open ? 'notebook' : 'plus'}
        theme={{
          colors: {
            onPrimaryContainer: theme.colors.onPrimary,
            primaryContainer: theme.colors.primary,
          },
          roundness: 9,
        }}
        style={[styles.fab, { bottom: bottomPosition }]}
        actions={[
          {
            icon: 'package-variant',
            label: 'Agregar producto',
            color: theme.colors.primary,
            onPress: () => {
              openModal(<ProductForm onClose={closeModal} />);
            },
          },
          {
            icon: 'package-variant',
            label: 'Agregar producto vista',
            color: theme.colors.primary,

            onPress: () => {
              navigation.navigate('ProductoForm');
            },
          },
          {
            icon: 'swap-horizontal',
            label: 'Simple Context',
            color: theme.colors.primary,

            onPress: () => openModal(<CatModal />),
          },
        ]}
        onStateChange={onStateChange}
        onPress={() => {
          if (open) {
            // do something if the speed dial is open
          }
        }}
      />
    </Portal>
  );
};

const styles = StyleSheet.create({
  fab: {
    paddingBottom: 60,
  },
});

export default FabGroup;
