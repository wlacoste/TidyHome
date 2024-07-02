import React, { createContext, useState, useContext, ReactNode } from 'react';

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
    </ModalContext.Provider>
  );
};

export const useModal = () => {
  return useContext(ModalContext);
};
