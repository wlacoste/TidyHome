import { View, Text, ScrollView, StyleSheet } from 'react-native';
import React from 'react';
import { Card, IconButton } from 'react-native-paper';
import { TouchableOpacity } from 'react-native-gesture-handler';

const ColorPicker = ({ setColor }) => {
  return (
    <ScrollView
      horizontal
      style={{
        display: 'flex',
        flexDirection: 'row',
        padding: 10,
        gap: 10,
      }}>
      {colores.map(color => (
        <IconButton
          key={color}
          icon={'ab-testing'}
          iconColor={color}
          style={styles.boton}
          mode="contained-tonal"
          containerColor={color}
          onPress={() => setColor(color)}
        />
      ))}
    </ScrollView>
  );
};

export default ColorPicker;

const styles = StyleSheet.create({
  boton: { width: 50, height: 50, borderRadius: 25 },
});
const colores = [
  'rgb(255, 255, 153)',
  'rgb(255, 255, 77)',
  'rgb(255, 255, 0)',
  'rgb(179, 179, 0)',
  'rgb(102, 102, 0)',
  'rgb(255, 231, 190)',
  'rgb(255, 219, 153)',
  'rgb(255, 193, 77)',
  'rgb(255, 165, 0)',
  'rgb(179, 116, 0)',
  'rgb(102, 66, 0)',
  'rgb(246, 219, 198)',
  'rgb(243, 198, 165)',
  'rgb(234, 154, 98)',
  'rgb(224, 111, 31)',
  'rgb(157, 78, 21)',
  'rgb(112, 56, 15)',
  'rgb(255, 190, 190)',
  'rgb(255, 153, 153)',
  'rgb(255, 77, 77)',
  'rgb(255, 0, 0)',
  'rgb(179, 0, 0)',
  'rgb(102, 0, 0)',
  'rgb(255, 179, 191)',
  'rgb(255, 102, 128)',
  'rgb(255, 26, 64)',
  'rgb(204, 0, 34)',
  'rgb(128, 0, 21)',
  'rgb(255, 194, 255)',
  'rgb(255, 153, 255)',
  'rgb(255, 77, 255)',
  'rgb(255, 0, 255)',
  'rgb(179, 0, 179)',
  'rgb(102, 0, 102)',
  'rgb(225, 201, 248)',
  'rgb(205, 165, 243)',
  'rgb(168, 98, 234)',
  'rgb(138, 43, 226)',
  'rgb(105, 24, 180)',
  'rgb(65, 15, 112)',
  'rgb(194, 194, 255)',
  'rgb(153, 153, 255)',
  'rgb(77, 77, 255)',
  'rgb(0, 0, 255)',
  'rgb(0, 0, 179)',
  'rgb(0, 0, 102)',
  'rgb(194, 255, 194)',
  'rgb(153, 255, 153)',
  'rgb(77, 255, 77)',
  'rgb(0, 255, 0)',
  'rgb(0, 179, 0)',
  'rgb(0, 102, 0)',
];
