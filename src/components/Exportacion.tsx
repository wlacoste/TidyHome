import React from 'react';
import { StyleSheet, View } from 'react-native';
import { ActivityIndicator, Button, Dialog, Portal, Text } from 'react-native-paper';
import useExportacion from '../hooks/useExportacion';

const Exportacion = () => {
  const {
    openAlert,
    setOpenAlert,
    comenzarCarga,
    cargarDatos,
    openAlertDescarga,
    setOpenAlertDescarga,
    descargarDatosNube,
    descargarDatos,
    setProcesoCarga,
    procesoCarga,
  } = useExportacion();
  return (
    <>
      <View style={{ gap: 10 }}>
        <Button onPress={() => cargarDatos()} mode="contained" style={styles.boton}>
          Cargar datos
        </Button>
        <Button onPress={() => descargarDatos()} mode="contained" style={styles.boton}>
          Descargar datos
        </Button>
        {procesoCarga && <ActivityIndicator />}
      </View>
      <Portal>
        <Dialog
          visible={openAlert}
          onDismiss={() => {
            setOpenAlert(false);
            setProcesoCarga(false);
          }}>
          <Dialog.Content>
            <Text variant="bodyMedium">
              Se encontraron datos en la nube mas recientes que los locales. Desea continuar y
              guardar los datos en la nube?
            </Text>
          </Dialog.Content>
          <Dialog.Actions>
            <Button
              onPress={() => {
                setOpenAlert(false);
                setProcesoCarga(false);
              }}>
              Cancelar
            </Button>
            <Button
              onPress={() => {
                comenzarCarga(false);
                setOpenAlert(false);
              }}>
              Ok
            </Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
      <Portal>
        <Dialog
          visible={openAlertDescarga}
          onDismiss={() => {
            setOpenAlertDescarga(false);
            setProcesoCarga(false);
          }}>
          <Dialog.Content>
            <Text variant="bodyMedium">
              Se encontraron datos locales mas recientes que en la nube. Desea continuar? Los datos
              locales seran sobreescritos por los de la nube
            </Text>
          </Dialog.Content>
          <Dialog.Actions>
            <Button
              onPress={() => {
                setProcesoCarga(false);
                setOpenAlertDescarga(false);
              }}>
              Cancelar
            </Button>
            <Button
              onPress={() => {
                descargarDatosNube();
                setOpenAlertDescarga(false);
              }}>
              Ok
            </Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </>
  );
};

export default Exportacion;

const styles = StyleSheet.create({
  boton: {
    marginHorizontal: 16,
    borderRadius: 8,
  },
});
