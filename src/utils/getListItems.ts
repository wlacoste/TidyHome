import { ListItem } from 'react-native-paper-select/lib/typescript/interface/paperSelect.interface';
import { ICategoria } from '../components/Categorias/Categorias';

export const getListItem = (categorias: ICategoria[]) => {
  const items: ListItem[] = categorias.map(categoria => ({
    _id: categoria.id.toString(),
    value: categoria.nombre,
  }));
  return items;
};
