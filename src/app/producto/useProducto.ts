import dayjs from 'dayjs';
import { IProductoForm } from '../../components/ProductForm/ProductForm';
import { Producto, MovimientoProducto } from '../../models';
import { insertProductWithMovimiento } from '../../service/product-service';

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
    const { movimiento, producto } = submitProducto(formu);
    await insertProductWithMovimiento(producto, movimiento)
      .then(() => console.log('producto anadido'))
      .catch(err => console.log(err));
  };

  return { nuevoProducto };
};

export default useProducto;
