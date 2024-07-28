import React, { createContext, useState, useContext, useEffect } from 'react';
import useIsTabScreen from '../hooks/useTabScreen';
import { LayoutAnimation } from 'react-native';
const FabContext = createContext();

export const FabProvider = ({ children }) => {
  const [shouldBeVisible, setIsFabVisible] = useState(false);

  const showFab = () => {
    console.log('showFabCalled');
    setIsFabVisible(true);
  };
  const hideFab = () => {
    console.log('hideFabCalled');
    setIsFabVisible(false);
  };

  const isTabScreen = useIsTabScreen();
  useEffect(() => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.spring);
  }, [isTabScreen, shouldBeVisible]);

  return (
    <FabContext.Provider
      value={{ shouldBeVisible, showFab, hideFab, isTabScreen }}>
      {children}
    </FabContext.Provider>
  );
};

export const useFab = () => useContext(FabContext);
