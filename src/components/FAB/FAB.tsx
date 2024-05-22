import React, { useState } from 'react';
import { StyleSheet } from 'react-native';
import { FAB, Portal, useTheme } from 'react-native-paper';
import ModalAcciones from '../ModalAcciones/ModalAcciones';
import ProductForm from '../ProductForm';
import SimpleForm from '../SimpleInput';

const FabGroup = () => {
  const theme = useTheme();
  const [state, setState] = useState({ open: false });

  const onStateChange = ({ open }) => setState({ open });

  const { open } = state;

  const [visible, setVisible] = useState(false);

  const hideModal = () => setVisible(false);

  const [seleccionado, setSeleccionado] = useState<React.ReactNode | undefined>(
    undefined,
  );

  const getSeleccionado = (numero: number) => {
    let seleccion;
    switch (numero) {
      case 1:
        seleccion = <ProductForm onClose={hideModal} />;
        break;
      case 2:
        seleccion = <SimpleForm onClose={hideModal} />;
        break;
    }
    setSeleccionado(seleccion);
  };

  return (
    <Portal>
      <ModalAcciones
        visible={visible}
        onClose={hideModal}
        children={seleccionado}
      />
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
              getSeleccionado(1);
              setVisible(true);
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
              getSeleccionado(2);
              setVisible(true);
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
