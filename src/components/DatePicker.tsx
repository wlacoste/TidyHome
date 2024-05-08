import React from 'react';
import { View, Text } from 'react-native';
import { Button, Modal, Portal } from 'react-native-paper';
import { DatePickerInput, DatePickerModal } from 'react-native-paper-dates';
import { SafeAreaProvider } from 'react-native-safe-area-context';

interface IDatePicker {
  date: Date | undefined;
  setDate: (e: string | boolean | Date | undefined, nombre: string) => void;
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function DatePicker({
  date,
  setDate,
  open,
  setOpen,
}: IDatePicker) {
  const onDismissSingle = React.useCallback(() => {
    setOpen(false);
  }, [setOpen]);

  //   const onConfirmSingle = (e: React.SetStateAction<Date | undefined>) => {
  //     setOpen(false);
  //     setDate(e, 'fechaVencimiento');
  //   };

  return (
    <DatePickerInput
      locale="es"
      label="Fecha vencimiento"
      value={date}
      onChange={d => setDate(d, 'fechaVencimiento')}
      inputMode="start"
      presentationStyle="pageSheet"
    />
  );
}
