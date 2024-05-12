import React from 'react';
import { Card, Modal, Portal } from 'react-native-paper';
import Text from '../Text';
import { StyleSheet } from 'react-native';
import { white } from 'react-native-paper/lib/typescript/styles/themes/v2/colors';
import ProductForm from '../ProductForm';

export interface IModal {
  visible: boolean;
  onClose: () => void;
}

const ModalAcciones = ({ visible, onClose }: IModal) => {
  return (
    <Modal visible={visible} onDismiss={onClose}>
      <ProductForm />
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalCard: {
    minHeight: 150,
    backgroundColor: 'white',
  },
});

export default ModalAcciones;
