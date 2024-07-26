import { Producto } from './productos';

export interface ProductoPorComprar {
  id: number;
  nombre: string;
  cantidad?: number;
}

export interface ProductoLista {
  idProducto: number;
  nombre: string;
  cantidad?: number;
}

export interface ListaCompras {
  id: number;
  fechaCreacion: string;
  productos: ProductoLista[];
  productosPorComprar: ProductoPorComprar[];
}
