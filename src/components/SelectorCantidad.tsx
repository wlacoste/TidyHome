import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Button, IconButton, Text, useTheme } from 'react-native-paper';

interface ISelectorCantidad {
  cantidad: number;
  onDecrement: any;
  onIncrement: any;
  styles?: any;
}

const SelectorCantidad = ({
  cantidad,
  onDecrement,
  onIncrement,
  styles,
}: ISelectorCantidad) => {
  const theme = useTheme();

  return (
    <View style={[defaultStyles.container, styles?.container]}>
      <IconButton
        mode="contained"
        style={[defaultStyles.buttonLeft, styles?.buttonLeft]}
        onPress={onDecrement}
        icon="minus"
      />
      <Text style={[defaultStyles.cantidad, styles?.cantidad]}>{cantidad}</Text>

      <IconButton
        containerColor={theme.colors.primaryContainer}
        iconColor={theme.colors.primary}
        mode="contained"
        style={[defaultStyles.buttonRight, styles?.buttonRight]}
        onPress={onIncrement}
        icon="plus"
      />
    </View>
  );
};

const defaultStyles = StyleSheet.create({
  container: {
    // alignSelf: 'flex-end',
    flexDirection: 'row',
    alignItems: 'flex-end',
    maxWidth: '32%',
  },
  cantidad: {
    fontSize: 20,
    fontWeight: '700',
    textAlignVertical: 'center',
    width: '100%',

    textAlign: 'center',

    height: 40,
    flex: 1,
  },
  buttonLeft: {
    padding: 0,
    margin: 0,
    // marginLeft: 8,
    width: 40,
    height: 40,
  },
  buttonRight: {
    padding: 0,
    margin: 0,
    width: 40,
    height: 40,
  },
});

export default SelectorCantidad;
