import React, { useState } from 'react';
import { View } from 'react-native';
import { Menu, Appbar } from 'react-native-paper';
import { useModal } from '../../../context/modalContext';
import EditarProducto from '../ProductForm/EditarProducto';

const MenuComponent = ({ producto, setOpenModal }) => {
  const [visible, setVisible] = useState(false);

  const openMenu = () => setVisible(true);
  const closeMenu = () => setVisible(false);

  const handleEdit = () => {
    setOpenModal(true);
  };

  const handleDelete = () => {
    // Handle delete action
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
          title="Edit"
        />
        <Menu.Item
          leadingIcon={'trash-can'}
          onPress={() => {
            closeMenu();
            handleDelete();
          }}
          title="Delete"
        />
      </Menu>
    </View>
  );
};

export default MenuComponent;
