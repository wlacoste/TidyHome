import dayjs from 'dayjs';
import {
  IProductoForm,
  Producto,
  MovimientoProducto,
} from '../models/productos';

export const transformToProducto = (formu: IProductoForm) => {
  const producto: Producto = {
    id: formu.id ? formu.id : 0,
    nombre: formu.nombre,
    categoria: formu.categoria!,
    fechaCreacion: dayjs().toDate().toLocaleDateString('es-ES'),
    detalle: [],
    agregarListaCompra: false,
    cantidadAdvertencia: 0,
    seguirEstadistica: true,
  };
  const precio = formu.precio ? Number(formu.precio) : 0;
  const movimiento: MovimientoProducto = {
    id: 0,
    idProducto: formu.id ? formu.id : 0,
    fechaCreacion: dayjs().toDate().toLocaleDateString('es-ES'),
    precio: formu.isUnitario ? precio * Number(formu.cantidad) : precio,
    cantidad: formu.cantidad ? Number(formu.cantidad) : 1,
    isUnitario: formu.isUnitario,
    precioUnitario: formu.isUnitario ? precio : precio / Number(formu.cantidad),
    isVence: formu.isVence,
    fechaVencimiento: formu.isVence
      ? formu.fechaVencimiento?.toLocaleDateString('es-ES') + ''
      : '',
    isCompra: true,
    recordatorio: '',
  };
  return { producto, movimiento };
};

export const mapProductoToForm = (producto?: Producto): IProductoForm => {
  if (!producto) {
    return {
      nombre: '',
      cantidad: undefined,
      precio: undefined,
      isUnitario: false,
      categoria: undefined,
      fechaVencimiento: undefined,
      isVence: false,
      fechaCreacion: '',
    };
  }

  return {
    nombre: producto.nombre,
    cantidad: undefined, // You might want to set a default value here
    precio: undefined, // You might want to set a default value here
    isUnitario: false, // You might want to determine this based on some logic
    categoria: producto.categoria,
    fechaVencimiento: undefined, // You might want to set a default value here
    isVence: false, // You might want to determine this based on some logic
    fechaCreacion: producto.fechaCreacion,
  };
};
