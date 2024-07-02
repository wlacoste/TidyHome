import React, { useState } from 'react';
import { StyleSheet } from 'react-native';
import { FAB, Portal, useTheme } from 'react-native-paper';
import ModalAcciones from '../ModalAcciones/ModalAcciones';
import ProductForm from '../ProductForm';
import SimpleForm from '../SimpleInput';
import { useModal } from '../../context/modalContext';

const FabGroup = () => {
  const theme = useTheme();
  const [state, setState] = useState({ open: false });

  const onStateChange = ({ open }) => setState({ open });

  const { open } = state;

  const { closeModal, openModal, visible } = useModal();

  return (
    <Portal>
      <FAB.Group
        open={open}
        visible
        icon={'plus'}
        theme={{
          colors: {
            onPrimaryContainer: theme.colors.primary,
          },
          roundness: 9,
        }}
        style={styles.fab}
        actions={[
          {
            icon: 'package-variant',
            label: 'Producto nuevo',
            onPress: () => {
              openModal(<ProductForm tipo={'nuevo'} onClose={closeModal} />);
            },
          },
          {
            icon: 'swap-horizontal',
            label: 'Movimiento nuevo',
            onPress: () => console.log('Pressed email'),
          },
          {
            icon: 'pencil',
            label: 'Movimiento Input',
            onPress: () => {
              openModal(<SimpleForm tipo={'nuevo'} onClose={closeModal} />);
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
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  fab: {
    marginBottom: 60,
  },
});

export default FabGroup;
