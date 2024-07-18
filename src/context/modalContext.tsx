import React, { createContext, useState, useContext, ReactNode } from 'react';
import { StyleSheet } from 'react-native';
import { Modal } from 'react-native-paper';

interface ModalContextType {
  visible: boolean;
  openModal: (content: ReactNode) => void;
  closeModal: () => void;
  modalContent: ReactNode | null;
}

const defaultModalContext: ModalContextType = {
  visible: false,
  openModal: () => {},
  closeModal: () => {},
  modalContent: null,
};

const ModalContext = createContext<ModalContextType>(defaultModalContext);

export const ModalProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [visible, setVisible] = useState(false);
  const [modalContent, setModalContent] = useState<ReactNode | null>(null);

  const openModal = (content: ReactNode) => {
    setModalContent(content);
    setVisible(true);
  };

  const closeModal = () => {
    setVisible(false);
    setModalContent(null);
  };

  return (
    <ModalContext.Provider
      value={{ visible, openModal, closeModal, modalContent }}>
      {children}
      <Modal
        visible={visible}
        onDismiss={closeModal}
        style={styles.centeredView}>
        {modalContent}
      </Modal>
    </ModalContext.Provider>
  );
};

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    alignItems: 'center',
    marginBottom: 40,
  },
});
export const useModal = () => {
  return useContext(ModalContext);
};
