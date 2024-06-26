import dayjs from 'dayjs';
import { IProductoForm } from '../../components/ProductForm/ProductForm';
import { Producto, MovimientoProducto, IMovimientoSimple } from '../../models';
import {
  addMovimientoProducto,
  getMovimientoByProductId,
  insertProductWithMovimiento,
  updateMovimientoProducto,
} from '../../service/product-service';

const useProducto = () => {
  const submitProducto = (formu: IProductoForm) => {
    const producto: Producto = {
      id: 0,
      nombre: formu.nombre,
      categoria: formu.categoria,
      fechaCreacion: dayjs().toDate().toLocaleDateString('es-ES'),
      detalle: [],
    };
    const precio = formu.precio ? Number(formu.precio) : 0;
    const movimiento: MovimientoProducto = {
      id: 0,
      idProducto: 0,
      fechaCreacion: dayjs().toDate().toLocaleDateString('es-ES'),
      precio: formu.isUnitario ? precio * Number(formu.cantidad) : precio,
      cantidad: formu.cantidad ? Number(formu.cantidad) : 1,
      isUnitario: formu.isUnitario,
      precioUnitario: formu.isUnitario
        ? precio
        : precio / Number(formu.cantidad),
      isVence: formu.isVence,
      fechaVencimiento:
        formu.fechaVencimiento?.toLocaleDateString('es-ES') + '',
      isCompra: true,
    };
    console.log('producto', producto);
    console.log('movimiento', movimiento);
    return { producto, movimiento };
  };

  const nuevoProducto = async (formu: IProductoForm) => {
    try {
      const { movimiento, producto } = submitProducto(formu);
      await insertProductWithMovimiento(producto, movimiento);
      console.log('producto anadido');
      producto.detalle.push(movimiento);
      return producto;
    } catch (err) {
      console.error('Error al añadir producto:', err);
      throw err;
    }
  };

  const nuevoMovimiento = async ({
    idProducto,
    isCompra,
    ultimoMovimiento,
    cantidadActual,
  }: IMovimientoSimple) => {
    const isUpdate =
      ultimoMovimiento.fechaCreacion ===
        dayjs().toDate().toLocaleDateString('es-ES') &&
      ultimoMovimiento.isCompra === isCompra;
    console.log('fecha1', ultimoMovimiento.fechaCreacion);
    console.log('fecha2', dayjs().toDate().toLocaleDateString('es-ES'));
    console.log('isUpdatei', isUpdate);

    let cantidad = 1;
    if (isUpdate) {
      cantidad = isCompra
        ? ultimoMovimiento.cantidad + 1
        : ultimoMovimiento.cantidad - 1;
    }
    console.log('cantidad', cantidad);
    console.log(' actual', cantidadActual);
    console.log(' ultimoMovimiento.cantidad', ultimoMovimiento.cantidad);
    if (!isCompra && cantidad > cantidadActual) {
      return;
    }

    const movimiento: MovimientoProducto = {
      id: ultimoMovimiento.id,
      idProducto: idProducto,
      fechaCreacion: dayjs().toDate().toLocaleDateString('es-ES'),
      precio: ultimoMovimiento.precio,
      cantidad: cantidad,
      isUnitario: ultimoMovimiento.isUnitario,
      precioUnitario: ultimoMovimiento.precioUnitario,
      isVence: ultimoMovimiento.isVence,
      fechaVencimiento: ultimoMovimiento.fechaVencimiento,
      isCompra: isCompra,
    };

    try {
      let result = isUpdate
        ? await updateMovimientoProducto(movimiento) //insertedId undefined
        : await addMovimientoProducto(movimiento);

      const res = isUpdate
        ? (result as { insertId: number }).insertId
        : ultimoMovimiento.id;
      console.log('resultados', result, res);
      const nuevoAs = await getMovimientoByProductId(res);
      console.log('nuevoAs,', nuevoAs);
      return result;
    } catch (err) {
      console.error('Error al actualizar movimiento', err);
      throw err;
    }
  };

  return { nuevoProducto, nuevoMovimiento };
};

export default useProducto;