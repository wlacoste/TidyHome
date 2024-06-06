import dayjs from 'dayjs';
import { IProductoForm } from '../components/ProductForm/ProductForm';

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
