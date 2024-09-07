import { useMemo } from 'react';
import { MovimientoProducto } from '../../../models/productos';
import { rellenar, stringAFecha } from './generarDataGrafico';

export const mapMovimientos = (movimientos: MovimientoProducto[]) => {
  // const mov = movimientos.sort((a, b) => a.id - b.id);
  const mov = [...movimientos].sort((a, b) => a.id - b.id);
  let total = 0;
  return mov.map(item => {
    total = item.isCompra ? total + item.cantidad : total - item.cantidad;
    return {
      value: total,
      label: item.fechaCreacion,
      fecha: item.fechaCreacion,
      fechaDate: stringAFecha(item.fechaCreacion),
      id: item.id,
    };
  });
};
export const useMovimiento = (
  movimientos: MovimientoProducto[] | undefined,
) => {
  const ultimaCompra = useMemo(() => {
    if (!movimientos) {
      return 1;
    }
    const newestCompra = movimientos.find(item => item.isCompra);
    if (!newestCompra) {
      return 1;
    }
    const ultimaFechaCompra = stringAFecha(newestCompra.fechaCreacion);
    const today = new Date();
    const utcDate1 = Date.UTC(
      ultimaFechaCompra.getFullYear(),
      ultimaFechaCompra.getMonth(),
      ultimaFechaCompra.getDate(),
    );
    const utcDate2 = Date.UTC(
      today.getFullYear(),
      today.getMonth(),
      today.getDate(),
    );

    const millisecondsPerDay = 1000 * 60 * 60 * 24;

    return Math.floor((utcDate2 - utcDate1) / millisecondsPerDay);
  }, [movimientos]);
  const data = useMemo(() => {
    if (!movimientos) {
      return [];
    }
    return mapMovimientos(movimientos);
  }, [movimientos]);

  const valoresGrafico = useMemo(() => {
    if (data.length === 0) {
      return [];
    }
    return rellenar(30, data, 1);
  }, [data]);

  const metricas = useMemo(() => {
    if (!movimientos || movimientos.length === 0) {
      return {
        cantidadActual: 0,
        avgDailyChange: 0,
        avgWeeklyChange: 0,
        daysUntilEmpty: Infinity,
      };
    }

    // Sort data by date
    const sortedData = [...valoresGrafico];

    // Calculate daily change
    const dailyChanges = sortedData.slice(1).map((item, index) => ({
      date: item.fechaDate,
      change: item.value - sortedData[index].value,
    }));

    // Calculate average daily change (velocity)
    const avgDailyChange =
      dailyChanges.reduce((sum, item) => sum + item.change, 0) /
      dailyChanges.length;

    // Calculate weekly change
    let weeklyChanges: any[] = [];
    for (let i = 7; i < sortedData.length; i += 7) {
      weeklyChanges.push({
        date: sortedData[i].fechaDate,
        change: sortedData[i].value - sortedData[i - 7].value,
      });
    }

    // Calculate average weekly change
    const avgWeeklyChange =
      weeklyChanges.length > 0
        ? weeklyChanges.reduce((sum, item) => sum + item.change, 0) /
          weeklyChanges.length
        : avgDailyChange * 7;

    // Estimate time until running out (assuming linear trend)
    const daysUntilEmpty =
      avgDailyChange < 0
        ? Math.ceil(
            sortedData[sortedData.length - 1].value / Math.abs(avgDailyChange),
          )
        : Infinity;

    return {
      cantidadActual: data[data.length - 1].value,
      avgDailyChange,
      avgWeeklyChange,
      daysUntilEmpty,
    };
  }, [movimientos]);

  return { metricas, valoresGrafico, ultimaCompra };
};
