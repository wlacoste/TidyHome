import React from 'react';
import { Text as RNText, useTheme } from 'react-native-paper';

import { TextProps as RNTextProps } from 'react-native';

interface TextProps extends RNTextProps {
  children: React.ReactNode;
}

const Text: React.FC<TextProps> = ({ style, ...props }) => {
  const theme = useTheme();

  return (
    <RNText style={[{ color: theme.colors.onSurface }, style]} {...props} />
  );
};

export default Text;
