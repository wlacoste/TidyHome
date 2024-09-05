import { Image, StyleSheet, View } from 'react-native';
import React from 'react';
import { Text } from 'react-native-paper';
import imagen from '../../assets/img/cat-mascot.png';
import imagen1 from '../../assets/img/cat-mascot-paper.png';
import imagen2 from '../../assets/img/cat-mascot-envelope.png';
import imagen3 from '../../assets/img/cat-mascotgroceries.png';

interface IfallbackCat {
  numeroImagen?: number;
  titulo: string;
  subtitulo?: string;
}

const getImagen = (numero?: number) => {
  if (numero === 1) {
    return imagen1;
  }
  if (numero === 2) {
    return imagen2;
  }
  if (numero === 3) {
    return imagen3;
  }
  return imagen;
};
const CatFallback = ({ titulo, subtitulo, numeroImagen }: IfallbackCat) => {
  return (
    <View style={styles.mensaje}>
      <Image source={getImagen(numeroImagen)} style={styles.avatar} />

      <Text variant="titleLarge" style={styles.textomensaje}>
        {titulo}
      </Text>
      {subtitulo && (
        <Text variant="titleLarge" style={styles.textomensaje}>
          {subtitulo}
        </Text>
      )}
    </View>
  );
};

export default CatFallback;

const styles = StyleSheet.create({
  mensaje: {
    flexGrow: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    padding: '10%',
    paddingTop: '30%',
    gap: 10,
    textAlign: 'left',
  },
  avatar: {
    height: 200,
    width: 200,
  },
  textomensaje: {
    textAlign: 'center',
    fontWeight: '800',
  },
});
