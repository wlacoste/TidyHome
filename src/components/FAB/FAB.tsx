import React from 'react';
import { StyleSheet } from 'react-native';
import { FAB, Modal, Portal, useTheme } from 'react-native-paper';
import { useUserAuth } from '../../context/userAuthContext';
import ModalAcciones from '../ModalAcciones/ModalAcciones';

const FabGroup = () => {
  const theme = useTheme();
  const [state, setState] = React.useState({ open: false });

  const onStateChange = ({ open }) => setState({ open });

  const { open } = state;

  const [visible, setVisible] = React.useState(false);

  const hideModal = () => setVisible(false);

  return (
    <Portal>
      <ModalAcciones visible={visible} onClose={hideModal} />
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
            icon: 'plus',
            label: 'Nuevo Producto',
            onPress: () => setVisible(true),
          },
          {
            icon: 'email',
            label: 'Nuevo Movimiento',
            onPress: () => console.log('Pressed email'),
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
    marginBottom: 80,
  },
});

export default FabGroup;
