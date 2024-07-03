import dayjs from 'dayjs';
// import { IProductoForm } from '../../components/ProductForm/ProductForm';
import {
  Producto,
  MovimientoProducto,
  IMovimientoSimple,
  IProductoForm,
} from '../../models';
import {
  addMovimientoProducto,
  deleteMovimientoProducto,
  getMovimientoProductoById,
  insertProductWithMovimiento,
  updateMovimientoProducto,
} from '../../service/product-service';
import { transformToProducto } from '../../utils/transformToProducto';

const useProducto = () => {
  const nuevoProducto = async (formulario: IProductoForm) => {
    try {
      const { movimiento, producto } = transformToProducto(formulario);
      await insertProductWithMovimiento(producto, movimiento);
      console.log('producto anadido');
      producto.detalle.push(movimiento);
      return producto;
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
  }: IMovimientoSimple) => {
    //TODO abrir modal de nuevo producto cuando no hay mas movimientos
    if (!ultimoMovimiento) {
      return;
    }

    const isUpdate =
      ultimoMovimiento.fechaCreacion ===
        dayjs().toDate().toLocaleDateString('es-ES') &&
      ultimoMovimiento.isCompra === isCompra;
    console.log('fecha1', ultimoMovimiento.fechaCreacion);
    console.log('fecha2', dayjs().toDate().toLocaleDateString('es-ES'));
    console.log('isUpdatei', isUpdate);

    let cantidad = 1;
    if (isUpdate) {
      cantidad = ultimoMovimiento.cantidad + 1;
    }
    if (!isCompra && cantidad > cantidadActual + 1) {
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
      console.log('resultados', result, idUpdate);
      const movimientoGuadado = await getMovimientoProductoById(idUpdate);
      console.log('nuevoAs,', movimientoGuadado);
      return movimientoGuadado;
    } catch (err) {
      console.error('Error al actualizar movimiento', err);
      throw err;
    }
  };

  const borrarMovimiento = async (id: number) => {
    try {
      await deleteMovimientoProducto(id);
      return true;
    } catch (err) {
      console.error('No se pudo eliminar el movimiento', err);
      throw err;
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
