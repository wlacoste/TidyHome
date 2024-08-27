import { useState, useEffect, useCallback } from 'react';
import { calculateTotal } from '../components/GestorProductos/ProductoBar';
import { ItemCompra } from '../components/ListaComprasGenerada';
import { useProductContext } from '../context/productContext';
import { Producto } from '../models/productos';

export interface CantidadItem {
  idProducto: number;
  cantidadAComprar: number;
  checked: boolean;
  nombre: string;
}

export const getCantidadAComprar = (producto: Producto) => {
  let cantidad = 1;
  if (
    producto.cantidadAdvertencia &&
    calculateTotal(producto.detalle) < producto.cantidadAdvertencia
  ) {
    cantidad = producto.cantidadAdvertencia - calculateTotal(producto.detalle);
  }
  return cantidad;
};
export const useListaCompras = (setLista: (items: ItemCompra[]) => void) => {
  const { productos, loading } = useProductContext();
  const [itemsCompra, setItemsCompra] = useState<Producto[]>([]);
  const [filteredProducts, setFilteredProducts] = useState(productos);
  const [seleccionados, setSeleccionados] = useState<number[]>([]);
  const [cantidades, setCantidades] = useState<CantidadItem[]>([]);

  useEffect(() => {
    if (productos.length == 0) {
      return;
    }
    let items = productos.filter(
      producto =>
        producto.agregarListaCompra ||
        (producto.cantidadAdvertencia &&
          producto.cantidadAdvertencia >= calculateTotal(producto.detalle)) ||
        calculateTotal(producto.detalle) <= 0,
    );
    setItemsCompra(items);
  }, [productos]);

  useEffect(() => {
    setCantidades(
      filteredProducts.map(producto => ({
        idProducto: producto.id,
        cantidadAComprar: getCantidadAComprar(producto),
        checked: true,
        nombre: producto.nombre,
      })),
    );
  }, [filteredProducts]);

  useEffect(() => {
    if (seleccionados.length === 0) {
      return setFilteredProducts(itemsCompra);
    }
    let filtrados = itemsCompra.filter(product =>
      seleccionados.includes(product.categoria.id),
    );

    setFilteredProducts(filtrados);
  }, [itemsCompra, seleccionados]);

  const getProductoState = useCallback(
    (productoId: number): CantidadItem | undefined => {
      return cantidades.find(item => item.idProducto === productoId);
    },
    [cantidades],
  );

  const updateProductoState = (
    productoId: number,
    updates: Partial<CantidadItem>,
  ) => {
    setCantidades(prevState =>
      prevState.map(item =>
        item.idProducto === productoId ? { ...item, ...updates } : item,
      ),
    );
  };

  const handleIncrement = (productoId: number) => {
    const currentCantidad = getProductoState(productoId)?.cantidadAComprar || 0;
    updateProductoState(productoId, { cantidadAComprar: currentCantidad + 1 });
  };

  const handleDecrement = (productoId: number) => {
    const currentCantidad = getProductoState(productoId)?.cantidadAComprar || 0;
    if (currentCantidad > 0) {
      updateProductoState(productoId, {
        cantidadAComprar: currentCantidad - 1,
      });
    }
  };

  const toggleCheckbox = (productoId: number) => {
    updateProductoState(productoId, {
      checked: !getProductoState(productoId)?.checked,
    });
  };

  const handleSubmit = () => {
    const lista: ItemCompra[] = cantidades
      .filter(item => item.checked)
      .map(item => ({
        id: item.idProducto,
        cantidad: item.cantidadAComprar,
        item: item.nombre,
      }));
    setLista(lista);
  };

  return {
    productos,
    loading,
    getProductoState,
    toggleCheckbox,
    handleDecrement,
    handleIncrement,
    seleccionados,
    filteredProducts,
    handleSubmit,
    setSeleccionados,
  };
};
