import React from 'react';
import { Modal } from 'react-native-paper';
import { StyleSheet, View } from 'react-native';
import ProductForm from '../ProductForm';
import { rgbaColor } from 'react-native-reanimated/lib/typescript/reanimated2/Colors';

export interface IModal {
  visible: boolean;
  onClose: () => void;
}

const ModalAcciones = ({ visible, onClose }: IModal) => {
  return (
    // <View style={styles.centeredView}>
    <Modal visible={visible} onDismiss={onClose} style={styles.centeredView}>
      <ProductForm />
    </Modal>
    // </View>
  );
};

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    // justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 40,
  },
});

export default ModalAcciones;
