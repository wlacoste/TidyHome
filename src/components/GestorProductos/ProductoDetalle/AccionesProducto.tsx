import React, { useState } from 'react';
import { View } from 'react-native';
import { Menu, Appbar } from 'react-native-paper';
import { useModal } from '../../../context/modalContext';
import EditarProducto from '../ProductForm/EditarProducto';

const MenuComponent = ({ producto }) => {
  const [visible, setVisible] = useState(false);
  const [visibleModal, setVisibleModal] = useState(false);

  const openMenu = () => setVisible(true);
  const closeMenu = () => setVisible(false);

  const { openModal, closeModal } = useModal();

  const handleEdit = () => {
    // Handle edit action
    // openModal(<EditarProducto onClose={closeModal} producto={producto} />);
    setVisibleModal(true);
    console.log('Edit pressed', producto.id);
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
      <EditarProducto
        visible={visibleModal}
        setVisible={setVisibleModal}
        producto={producto}
      />
    </View>
  );
};

export default MenuComponent;
