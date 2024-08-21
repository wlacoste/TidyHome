import React, { useMemo, useState } from 'react';
import { StyleSheet } from 'react-native';
import { FAB, Portal, useTheme } from 'react-native-paper';
import ProductForm from '../GestorProductos/ProductForm';
import SimpleForm from '../SimpleInput';
import { useModal } from '../../context/modalContext';
import TestView from '../TestView/TestView';
import { useFab } from '../../context/fabContext';
import { useNavigation } from '@react-navigation/native';
import { RootNavigationProp } from '../../models/routeTypes';

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
            label: 'Producto nuevo',
            color: theme.colors.primary,
            onPress: () => {
              openModal(<ProductForm onClose={closeModal} />);
            },
          },
          {
            icon: 'package-variant',
            label: 'Producto nuevo 2',
            color: theme.colors.primary,

            onPress: () => {
              navigation.navigate('ProductoForm');
            },
          },
          {
            icon: 'swap-horizontal',
            label: 'Movimiento nuevo',
            color: theme.colors.primary,

            onPress: () => console.log('Pressed email'),
          },
          {
            icon: 'swap-horizontal',
            label: 'Simple Context',
            color: theme.colors.primary,

            onPress: () => openModal(<TestView />),
          },
          {
            icon: 'pencil',
            label: 'Movimiento Input',
            color: theme.colors.primary,

            onPress: () => {
              openModal(<SimpleForm onClose={closeModal} />);
            },
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
