import React, { useState } from 'react';
import { StyleSheet } from 'react-native';
import { FAB, Portal, useTheme } from 'react-native-paper';
import ModalAcciones from '../ModalAcciones/ModalAcciones';
import ProductForm from '../ProductForm';
import SimpleForm from '../SimpleInput';
import { IProductForm, Producto } from '../../models';

interface IComponenteModal {}

const ComponenteModal = ({ tipo, children, open }) => {
  const [visible, setVisible] = useState(open ? open : false);

  const hideModal = () => setVisible(false);

  return (
    <ModalAcciones />
    // </Portal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default ComponenteModal;
