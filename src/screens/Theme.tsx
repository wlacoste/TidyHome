import React from 'react';
import { RadioButton, useTheme } from 'react-native-paper';
import { useCustomTheme } from '../context/themeContext';

const ThemeSwitcher: React.FC = () => {
  const { toggleTheme, themeType } = useCustomTheme();
  const theme = useTheme();

  return (
    <RadioButton.Group
      onValueChange={value => toggleTheme(value as 'light' | 'dark' | 'system')}
      value={themeType}>
      <RadioButton.Item label="Light Theme" value="light" />
      <RadioButton.Item label="Dark Theme" value="dark" />
      <RadioButton.Item label="System Theme" value="system" />
    </RadioButton.Group>
  );
};

export default ThemeSwitcher;
