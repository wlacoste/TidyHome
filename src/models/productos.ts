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
  categoria: Categoria;
  fechaVencimiento: string;
  isVence: boolean;
  fechaCreacion: string;
};

export interface Categoria {
  id: number;
  name: string;
  icon: string;
  isEnabled: boolean;
}

export interface Producto {
  id: number;
  nombre: string;
  categoria: Categoria;
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

export const DefaultCategories: Categoria[] = [
  {
    id: 1,
    name: 'Compras',
    icon: 'cart-outline',
    isEnabled: true,
  },
  {
    id: 2,
    name: 'Alimentos',
    icon: 'silverware-fork-knife',
    isEnabled: true,
  },
  {
    id: 3,
    name: 'Telefono',
    icon: 'cellphone',
    isEnabled: true,
  },
  {
    id: 4,
    name: 'Entretenimiento',
    icon: 'microphone-variant',
    isEnabled: true,
  },
  {
    id: 5,
    name: 'Educación',
    icon: 'book-open-variant',
    isEnabled: true,
  },
  {
    id: 6,
    name: 'Belleza',
    icon: 'face-woman-shimmer-outline',
    isEnabled: true,
  },
  {
    id: 7,
    name: 'Deportes',
    icon: 'swim',
    isEnabled: true,
  },
  {
    id: 8,
    name: 'Social',
    icon: 'account-multiple',
    isEnabled: true,
  },
  {
    id: 9,
    name: 'Transporte',
    icon: 'bus',
    isEnabled: true,
  },
  {
    id: 10,
    name: 'Ropa',
    icon: 'tshirt-crew-outline',
    isEnabled: true,
  },
  {
    id: 11,
    name: 'Auto',
    icon: 'car-outline',
    isEnabled: true,
  },
  {
    id: 12,
    name: 'Bebidas',
    icon: 'liquor',
    isEnabled: true,
  },
  {
    id: 13,
    name: 'Cigarrillo',
    icon: 'smoking',
    isEnabled: true,
  },
  {
    id: 14,
    name: 'Electronicos',
    icon: 'ipod',
    isEnabled: true,
  },
  {
    id: 15,
    name: 'Viajes',
    icon: 'airplane',
    isEnabled: true,
  },
  {
    id: 16,
    name: 'Salud',
    icon: 'bottle-tonic-plus',
    isEnabled: true,
  },
  {
    id: 17,
    name: 'Mascota',
    icon: 'cat',
    isEnabled: true,
  },
  {
    id: 18,
    name: 'Reparacion',
    icon: 'tools',
    isEnabled: true,
  },
  {
    id: 19,
    name: 'Vivienda',
    icon: 'format-paint',
    isEnabled: true,
  },
  {
    id: 20,
    name: 'Hogar',
    icon: 'bookshelf',
    isEnabled: true,
  },
  {
    id: 21,
    name: 'Regalo',
    icon: 'gift',
    isEnabled: true,
  },
  {
    id: 22,
    name: 'Donar',
    icon: 'hand-heart-outline',
    isEnabled: true,
  },
  {
    id: 23,
    name: 'Loteria',
    icon: 'slot-machine',
    isEnabled: true,
  },
  {
    id: 24,
    name: 'Bocadillos',
    icon: 'food-croissant',
    isEnabled: true,
  },
  {
    id: 25,
    name: 'Hijos',
    icon: 'baby-carriage',
    isEnabled: true,
  },
  {
    id: 26,
    name: 'Verduras',
    icon: 'carrot',
    isEnabled: true,
  },
  {
    id: 27,
    name: 'Frutas',
    icon: 'fruit-grapes-outline',
    isEnabled: true,
  },
];
