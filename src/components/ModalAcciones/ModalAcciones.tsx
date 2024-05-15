import React from 'react';
import { Modal } from 'react-native-paper';
import { StyleSheet, View } from 'react-native';
import ProductForm from '../ProductForm';
import { rgbaColor } from 'react-native-reanimated/lib/typescript/reanimated2/Colors';

export interface IModal {
  visible: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

const ModalAcciones = ({ visible, onClose, children }: IModal) => {
  return (
    <Modal visible={visible} onDismiss={onClose} style={styles.centeredView}>
      {children}
    </Modal>
  );
};

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    alignItems: 'center',
    marginBottom: 40,
  },
});

export default ModalAcciones;
