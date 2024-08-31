import { useState } from 'react';
import { LayoutAnimation } from 'react-native';
import { IListasCompras } from '../components/ListaCompras/ListaScreen';
import { ItemCompra } from '../components/ListaComprasGenerada';
import { formatDate } from '../utils/formatDate';

export const useListasCompras = () => {
  const [listas, setListas] = useState<IListasCompras[]>([]);

  const handleNewLista = (items: ItemCompra[]) => {
    const newList = {
      id: Date.now().toString(),
      items: items,
      fecha: formatDate(new Date()),
      comentario: '',
      titulo: 'Lista de compras',
    };
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setListas(prev => [newList, ...prev]);
  };

  const agregarAlista = (item: string, idLista: string, cantidad?: number) => {
    setListas(prev => {
      return prev.map(lista => {
        if (lista.id === idLista) {
          return {
            ...lista,
            items: [
              ...lista.items,
              { item: item, id: 0, cantidad: cantidad ? cantidad : 1 },
            ],
          };
        }
        return lista;
      });
    });
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
  };

  const eliminarLista = (idLista: string) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setListas(prev => prev.filter(lista => lista.id !== idLista));
  };

  const cambiarNombre = (nombre: string, idLista: string) => {
    setListas(prev =>
      prev.map(lista =>
        lista.id === idLista ? { ...lista, titulo: nombre } : lista,
      ),
    );
  };

  return {
    listas,
    handleNewLista,
    agregarAlista,
    eliminarLista,
    cambiarNombre,
  };
};
