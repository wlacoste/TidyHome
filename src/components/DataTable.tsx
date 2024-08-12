import * as React from 'react';
import { useState } from 'react';
import { LayoutAnimation, StyleSheet, View } from 'react-native';
import { DataTable, useTheme } from 'react-native-paper';

interface IDataTable<T, R> {
  items: T[];
  renderItem: (props: R) => React.ReactElement;
  getItemProps: (item: T, index: number, array: T[]) => R;
}
const DataTableComponent = <T, R>({
  items,
  renderItem,
  getItemProps,
}: IDataTable<T, R>) => {
  const [page, setPage] = useState(0);
  const itemsPerPage = 5;
  console.log('data tabnle', items);
  const paginatedItems = React.useMemo(() => {
    const from = page * itemsPerPage;
    const to = Math.min((page + 1) * itemsPerPage, items.length);
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);

    return items.slice(from, to);
  }, [items, page]);

  React.useEffect(() => {
    setPage(0);
  }, []);

  const from = page * itemsPerPage;
  const to = Math.min((page + 1) * itemsPerPage, items.length);

  return (
    <DataTable style={styles.tabla}>
      <DataTable.Pagination
        style={styles.pagina}
        page={page}
        numberOfPages={Math.ceil(items.length / itemsPerPage)}
        onPageChange={page => setPage(page)}
        label={` Pagina ${page + 1} de ${Math.ceil(
          items.length / itemsPerPage,
        )}`}
        numberOfItemsPerPage={itemsPerPage}
        // showFastPaginationControls
        selectPageDropdownLabel={'Rows per page'}
      />
      <View>
        {paginatedItems.map((item, index) => (
          <View key={`${index}-${page}`} style={styles.celda}>
            {renderItem(getItemProps(item, index + from, items))}
          </View>
        ))}
      </View>
    </DataTable>
  );
};

export default DataTableComponent;

const styles = StyleSheet.create({
  tabla: {
    padding: 0,
    margin: 0,
    width: '100%',
    minHeight: 100,
    // borderWidth: 1,
    // borderColor: 'green',
    display: 'flex',
    // left: -20,
    // alignItems: 'center',
  },
  celda: {
    margin: 0,
    alignItems: 'center',
    width: '100%',
    // height: 120,
    // borderWidth: 1,
    // borderColor: 'teal',
    padding: 0,
    justifyContent: 'center',
  },
  pagina: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 45,
    textAlignVertical: 'center',

    marginTop: -15,
    // lineHeight: 40,
    // alignSelf: 'center',

    // minHeight: 500,
    // borderWidth: 1,
    // borderColor: 'pink',
  },
});
