import dayjs from 'dayjs';
// import { IProductoForm } from '../../components/ProductForm/ProductForm';
import {
  Producto,
  MovimientoProducto,
  IMovimientoSimple,
  IProductoForm,
} from '../../models/productos';
import {
  addMovimientoProducto,
  deleteMovimientoProducto,
  getMovimientoById,
  insertProductWithMovimiento,
  updateMovimientoProducto,
} from '../../service/product-service';
import { transformToProducto } from '../../utils/transformToProducto';
import Toast from 'react-native-toast-message';

const useProducto = () => {
  const nuevoProducto = async (formulario: IProductoForm) => {
    try {
      const { movimiento, producto } = transformToProducto(formulario);
      const resultado = await insertProductWithMovimiento(producto, movimiento);
      Toast.show({
        type: 'success',
        text1: `Producto ${producto.nombre} añadido correctamente`,
      });
      // producto.detalle.push(movimiento);
      return resultado;
    } catch (err) {
      console.error('Error al añadir producto:', err);
      throw err;
    }
  };

  const primerMovimiento = async (formulario: IProductoForm) => {
    const { movimiento } = transformToProducto(formulario);
    return await persistirMovimiento(movimiento, false);
  };
  const nuevoMovimiento = async ({
    idProducto,
    isCompra,
    ultimoMovimiento,
    cantidadActual,
    recordatorio,
  }: IMovimientoSimple) => {
    //TODO abrir modal de nuevo producto cuando no hay mas movimientos
    if (!ultimoMovimiento) {
      return;
    }

    const isUpdate =
      ultimoMovimiento.fechaCreacion ===
        dayjs().toDate().toLocaleDateString('es-ES') &&
      ultimoMovimiento.isCompra === isCompra;

    let cantidad = 1;
    if (isUpdate) {
      cantidad = ultimoMovimiento.cantidad + 1;
    }

    let nuevaCantidadActual = cantidadActual;
    if (!ultimoMovimiento.isCompra) {
      nuevaCantidadActual += ultimoMovimiento.cantidad;
    }
    if (!isCompra && nuevaCantidadActual < cantidad) {
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
      recordatorio: recordatorio ? recordatorio : '',
    };

    return await persistirMovimiento(movimiento, isUpdate);
  };

  const persistirMovimiento = async (
    movimiento: MovimientoProducto,
    isUpdate: boolean,
  ) => {
    try {
      let result = isUpdate
        ? await updateMovimientoProducto(movimiento) //insertedId undefined
        : await addMovimientoProducto(movimiento);

      const idUpdate = !isUpdate
        ? (result as { insertId: number }).insertId
        : movimiento.id;

      const movimientoGuadado = await getMovimientoById(idUpdate);
      return movimientoGuadado;
    } catch (err) {
      console.error('Error al actualizar movimiento', err);
      // throw err;
    }
  };

  const borrarMovimiento = async (id: number) => {
    try {
      await deleteMovimientoProducto(id);
      return true;
    } catch (err) {
      console.error('No se pudo eliminar el movimiento', err);
      // throw err;
    }
  };

  return {
    nuevoProducto,
    nuevoMovimiento,
    borrarMovimiento,
    primerMovimiento,
  };
};

export default useProducto;
