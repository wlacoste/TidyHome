import React, { useState } from 'react';
import { View } from 'react-native';
import { Menu, Appbar } from 'react-native-paper';

const MenuComponent = ({ id }) => {
  const [visible, setVisible] = useState(false);

  const openMenu = () => setVisible(true);
  const closeMenu = () => setVisible(false);

  const handleEdit = () => {
    // Handle edit action
    console.log('Edit pressed', id);
  };

  const handleDelete = () => {
    // Handle delete action
    console.log('Delete pressed', id);
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
