import React from 'react';
import { Modal } from 'react-native-paper';
import { StyleSheet, View } from 'react-native';
import ProductForm from '../ProductForm';

export interface IModal {
  visible: boolean;
  onClose: () => void;
}

const ModalAcciones = ({ visible, onClose }: IModal) => {
  return (
    <View style={styles.centeredView}>
      <Modal visible={visible} onDismiss={onClose}>
        <ProductForm />
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  modalCard: {
    minHeight: 150,
    backgroundColor: 'white',
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
  },
});

export default ModalAcciones;
