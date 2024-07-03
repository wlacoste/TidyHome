import dayjs from 'dayjs';

export type ToDoItem = {
  id: number;
  value: string;
};

export type IProducto = {
  nombre: string;
  cantidad: number;
  precio: number;
  isUnitario: boolean;
  categoria: string;
  fechaVencimiento: string;
  isVence: boolean;
  fechaCreacion: string;
};

export interface Producto {
  id: number;
  nombre: string;
  categoria: string;
  fechaCreacion: string;
  detalle: MovimientoProducto[];
}

export interface MovimientoProducto {
  id: number;
  idProducto: number;
  fechaCreacion: string;
  precio: number;
  cantidad: number;
  isUnitario: boolean;
  precioUnitario: number;
  isVence: boolean;
  fechaVencimiento: string;
  isCompra: boolean;
}

export interface IMovimientoSimple {
  idProducto: number;
  isCompra: boolean;
  ultimoMovimiento?: MovimientoProducto;
  cantidadActual: number;
}

export interface IProductoForm {
  id?: number;
  nombre: string;
  cantidad: string | undefined;
  precio: string | undefined;
  isUnitario: boolean;
  categoria: string;
  fechaVencimiento: Date | undefined;
  isVence: boolean;
  fechaCreacion: string | Date;
}

export interface IProductForm {
  tipo: 'update' | 'nuevo';
  onClose?: () => void;
  producto?: Producto;
}
