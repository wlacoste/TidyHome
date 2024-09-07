import { Image, StyleSheet, TextStyle, View } from 'react-native';
import React from 'react';
import { Text } from 'react-native-paper';
import imagen from '../../assets/img/cat-mascot.png';
import imagen1 from '../../assets/img/cat-mascot-paper.png';
import imagen2 from '../../assets/img/cat-mascot-envelope.png';
import imagen3 from '../../assets/img/cat-mascotgroceries.png';

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
interface IfallbackCat {
  titulo: string;
  subtitulo?: string;
  numeroImagen?: number;
  tituloStyle?: TextStyle;
  subtituloStyle?: TextStyle;
}

const CatFallback: React.FC<IfallbackCat> = ({
  titulo,
  subtitulo,
  numeroImagen,
  tituloStyle,
  subtituloStyle,
}) => {
  return (
    <View style={styles.mensaje}>
      <Image source={getImagen(numeroImagen)} style={styles.avatar} />

      <Text variant="titleLarge" style={[styles.textomensaje, tituloStyle]}>
        {titulo}
      </Text>
      {subtitulo && (
        <Text variant="titleLarge" style={[styles.textomensaje, subtituloStyle]}>
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
    paddingHorizontal: 10,
    // paddingTop: '30%',
    gap: 10,
    textAlign: 'left',
  },
  avatar: {
    height: 200,
    width: 200,
  },
  textomensaje: {
    fontSize: 19,
    textAlign: 'center',
    fontWeight: '800',
  },
});
