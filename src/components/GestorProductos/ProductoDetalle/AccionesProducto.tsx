import React, { useState } from 'react';
import { View } from 'react-native';
import { Menu, Appbar } from 'react-native-paper';

const MenuComponent = ({ producto, setOpenModal, setOpenDelete }) => {
  const [visible, setVisible] = useState(false);

  const openMenu = () => setVisible(true);
  const closeMenu = () => setVisible(false);

  const handleEdit = () => {
    setOpenModal(true);
  };

  const handleDelete = () => {
    // Handle delete action
    setOpenDelete();
    console.log('Delete pressed', producto.id);
  };

  return (
    <View>
      <Menu
        visible={visible}
        onDismiss={closeMenu}
        anchor={<Appbar.Action icon="dots-vertical" onPress={openMenu} />}>
        <Menu.Item
          leadingIcon={'file-edit'}
          onPress={() => {
            closeMenu();
            handleEdit();
          }}
          title="Editar"
        />
        <Menu.Item
          leadingIcon={'trash-can'}
          onPress={() => {
            closeMenu();
            handleDelete();
          }}
          title="Eliminar"
        />
      </Menu>
    </View>
  );
};

export default MenuComponent;
