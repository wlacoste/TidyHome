import React, { useState } from 'react';
import { View } from 'react-native';
import { Menu, Appbar } from 'react-native-paper';

const ListaAcciones = ({ eliminar, compartir }) => {
  const [visible, setVisible] = useState(false);

  const openMenu = () => setVisible(true);
  const closeMenu = () => setVisible(false);

  return (
    <View>
      <Menu
        visible={visible}
        onDismiss={closeMenu}
        anchor={<Appbar.Action icon="dots-vertical" onPress={openMenu} />}>
        <Menu.Item
          leadingIcon={'share-variant'}
          onPress={() => {
            closeMenu();
            compartir();
          }}
          title="Compartir"
        />
        <Menu.Item
          leadingIcon={'trash-can'}
          onPress={() => {
            closeMenu();
            eliminar();
          }}
          title="Eliminar"
        />
      </Menu>
    </View>
  );
};

export default ListaAcciones;
