import React from 'react';
import { Modal, Portal } from 'react-native-paper';
import { StyleSheet } from 'react-native';
import { useModal } from '../../context/modalContext';

export interface IModal {
  visible: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

const ModalAcciones = () => {
  const { visible, closeModal, modalContent } = useModal();

  return (
    <Portal>
      <Modal
        visible={visible}
        onDismiss={closeModal}
        style={styles.centeredView}>
        {modalContent}
      </Modal>
    </Portal>
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
